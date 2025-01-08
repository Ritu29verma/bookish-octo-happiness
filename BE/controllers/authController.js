require('dotenv').config(); 
const AWS = require('../config/awsConfig');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const axios = require("axios");

const cognito = new AWS.CognitoIdentityServiceProvider();
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.REDIRECT_URI}/callback`;

exports.google = async (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email%20profile%20openid`;
  res.redirect(googleAuthUrl);
};



exports.callback = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {

    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", null, {
      params: {
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
        grant_type: "authorization_code",
      },
    }).catch(err => {
      console.error("Error exchanging authorization code:", err.response?.data || err.message);
      throw new Error("Failed to exchange authorization code with Google.");
    });

    const { id_token } = tokenResponse.data;

    const decodedToken = jwt.decode(id_token);
    const userEmail = decodedToken?.email;

    if (!userEmail) {
      console.error("Decoded token:", decodedToken);
      return res.status(400).json({ error: "Email not found in Google token" });
    }

    const user = await User.findOne({ where: { email: userEmail } }).catch(err => {
      console.error("Database error while fetching user:", err.message);
      throw new Error("Database error while fetching user.");
    });

    if (!user) {
      console.warn(`User not found for email: ${userEmail}`);
      return res.status(404).json({
        error: "User not found",
        message: "Please sign up before attempting to log in.",
      });
    }

    const { password, username } = user;

    const authParams = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };

    const authResponse = await cognito.initiateAuth(authParams).promise().catch(err => {
      console.error("Cognito authentication error:", err.message);
      throw new Error("Failed to authenticate user with Cognito.");
    });

    const accessToken = authResponse.AuthenticationResult.AccessToken;
    const userObj = await User.findOne({ where: { username } });
    if (!userObj) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { userId : userObj.id, username, accessToken },
      process.env.JWT_SECRET
    );

    res.json({
      message: "Login successful",
      token,
      refreshToken: authResponse.AuthenticationResult.RefreshToken,
    });
  } catch (error) {
    console.error("Error during callback:", error.message);
    res.status(500).json({
      error: "Callback failed",
      message: error.message || "An unexpected error occurred.",
    });
  }
};


exports.signup = async (req, res) => {
    const { username, password, email, role } = req.body;
  
    const params = {
      ClientId: CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [{ Name: 'email', Value: email }],
    };
  
    try {
      // Register the user with Cognito
      const data = await cognito.signUp(params).promise();
  
      // Assign the user to the appropriate group
      const groupParams = {
        GroupName: role,
        Username: username,
        UserPoolId: USER_POOL_ID,
      };
  
      await cognito.adminAddUserToGroup(groupParams).promise();
      // Create the user entry in the database with verified set to false
      await User.create({
        username,
        email,
        password: password,
        role,
        verified: false,
      });
  
      res.json({ message: 'User signed up successfully', userSub: data.UserSub });
    } catch (err) {
      res.status(400).json({ error: 'Signup failed', message: err.message });
    }
  };
  


exports.confirm = async (req, res) => {
    const { username, confirmationCode } = req.body;
  
    const params = {
      ClientId: CLIENT_ID,
      Username: username,
      ConfirmationCode: confirmationCode,
    };
  
    try {
      // Confirm the user's signup with Cognito
      await cognito.confirmSignUp(params).promise();
  
      // Update the verified field in the database
      const user = await User.findOne({ where: { username } });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.verified = true;
      await user.save();
  
      res.json({ message: 'User confirmed successfully' });
    } catch (err) {
      res.status(400).json({ error: 'Confirmation failed', message: err.message });
    }
  };
  


exports.signin = async (req, res) => {
    const { username, password } = req.body;
  
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };
  
    try {
      const data = await cognito.initiateAuth(params).promise();
      
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const token = jwt.sign(
      { 
        userId: user.id, 
        username: username, 
        accessToken: data.AuthenticationResult.AccessToken 
      },
      process.env.JWT_SECRET
    );
  
      res.json({
        message: "Sign-in successful",
        token,
        refreshToken: data.AuthenticationResult.RefreshToken,
      });
    } catch (err) {
      res.status(400).json({
        message: "Authentication failed",
        error: err.message,
      });
    }
  };
  

  exports.userInfo = async (req, res) => {
    const { username } = req.user; 
  
    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
  
    try {
      // Fetch user groups
      const params = {
        Username: username,
        UserPoolId: process.env.COGNITO_USER_POOL_ID, 
      };
  
      const groupData = await cognitoIdentityServiceProvider
        .adminListGroupsForUser(params)
        .promise();
  
      // Extract group names
      const groups = groupData.Groups.map(group => group.GroupName);
  

      return res.status(200).json({ username, groups });
    } catch (error) {
      console.error("Error fetching user groups:", error);
      return res.status(500).json({ message: "Failed to fetch user groups" });
    }
  };
  
  

  exports.resendVerificationCode = async (req, res) => {
    const { username } = req.body;
  
    const params = {
      ClientId: CLIENT_ID,
      Username: username,
    };
  
    try {
      // Resend the verification code using Cognito
      await cognito.resendConfirmationCode(params).promise();
      res.json({ message: "Verification code resent successfully" });
    } catch (err) {
      res.status(400).json({ error: "Resend failed", message: err.message });
    }
  };

