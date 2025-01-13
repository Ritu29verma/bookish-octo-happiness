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
// const COGNITO_REDIRECT_URI=`${process.env.REDIRECT_URI}/CognitoCallback`;
exports.google = async (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email%20profile%20openid`;
  res.redirect(googleAuthUrl);
};



// exports.callback = async (req, res) => {
//   const { code } = req.body;

//   if (!code) {
//     return res.status(400).json({ error: "Missing authorization code" });
//   }

//   try {

//     const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", null, {
//       params: {
//         client_id: GOOGLE_CLIENT_ID,
//         client_secret: GOOGLE_CLIENT_SECRET,
//         redirect_uri: REDIRECT_URI,
//         code,
//         grant_type: "authorization_code",
//       },
//     }).catch(err => {
//       console.error("Error exchanging authorization code:", err.response?.data || err.message);
//       throw new Error("Failed to exchange authorization code with Google.");
//     });

//     const { id_token } = tokenResponse.data;

//     const decodedToken = jwt.decode(id_token);
//     const userEmail = decodedToken?.email;

//     if (!userEmail) {
//       console.error("Decoded token:", decodedToken);
//       return res.status(400).json({ error: "Email not found in Google token" });
//     }

//     const user = await User.findOne({ where: { email: userEmail } }).catch(err => {
//       console.error("Database error while fetching user:", err.message);
//       throw new Error("Database error while fetching user.");
//     });

//     if (!user) {
//       console.warn(`User not found for email: ${userEmail}`);
//       return res.status(404).json({
//         error: "User not found",
//         message: "Please sign up before attempting to log in.",
//       });
//     }

//     const { password, username } = user;

//     const authParams = {
//       AuthFlow: "USER_PASSWORD_AUTH",
//       ClientId: CLIENT_ID,
//       AuthParameters: {
//         USERNAME: username,
//         PASSWORD: password,
//       },
//     };

//     const authResponse = await cognito.initiateAuth(authParams).promise().catch(err => {
//       console.error("Cognito authentication error:", err.message);
//       throw new Error("Failed to authenticate user with Cognito.");
//     });

//     const accessToken = authResponse.AuthenticationResult.AccessToken;
//     const userObj = await User.findOne({ where: { username } });
//     if (!userObj) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const token = jwt.sign(
//       { userId : userObj.id, username, accessToken },
//       process.env.JWT_SECRET
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       refreshToken: authResponse.AuthenticationResult.RefreshToken,
//     });
//   } catch (error) {
//     console.error("Error during callback:", error.message);
//     res.status(500).json({
//       error: "Callback failed",
//       message: error.message || "An unexpected error occurred.",
//     });
//   }
// };

// exports.callback = async (req, res) => {
//   const { code } = req.body;

//   if (!code) {
//     return res.status(400).json({ error: "Missing authorization code" });
//   }

//   try {
//     // Exchange the authorization code for an ID token
//     const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", null, {
//             params: {
//               client_id: GOOGLE_CLIENT_ID,
//               client_secret: GOOGLE_CLIENT_SECRET,
//               redirect_uri: REDIRECT_URI,
//               code,
//               grant_type: "authorization_code",
//             },
//           }).catch(err => {
//             console.error("Error exchanging authorization code:", err.response?.data || err.message);
//             throw new Error("Failed to exchange authorization code with Google.");
//           });

//     const { id_token } = tokenResponse.data;

//     // Decode the ID token to get user information
//     const decodedToken = jwt.decode(id_token);
//     const userEmail = decodedToken?.email;
//     const firstName = decodedToken?.given_name;
//     console.log(firstName)

//     if (!userEmail || !firstName) {
//       return res.status(400).json({ error: "Invalid token: Email or first name not found" });
//     }

//     // Check if the user already exists in the database
//     let user = await User.findOne({ where: { email: userEmail } });

//     let username;
//     let password;

//     if (!user) {
//       // User doesn't exist in the database, sign them up
//       username = firstName.toLowerCase().replace(/\s+/g, "_"); // Generate a username from the first name
//       password = `Test@12345`; // Temporary password

//       // Sign up the user in Cognito
//       const signupParams = {
//         ClientId: CLIENT_ID,
//         Username: username,
//         Password: password,
//         UserAttributes: [
//           { Name: "email", Value: userEmail },
//         ],
//       };

//       await cognito.signUp(signupParams).promise();

//       // Assign the user to the "customer" group in Cognito
//       const groupParams = {
//         GroupName: "customer",
//         Username: username,
//         UserPoolId: USER_POOL_ID,
//       };

//       await cognito.adminAddUserToGroup(groupParams).promise();

//       // Save the user in the database
//       user = await User.create({
//         username,
//         email: userEmail,
//         password,
//         role: "customer",
//         verified: false,
//       });
//     } else {
//       // User exists in the database, sign them up in Cognito if not already registered
//       username = user.username;
//       password = user.password;

//     }

//     // Sign in the user using Cognito
//     const authParams = {
//       AuthFlow: "USER_PASSWORD_AUTH",
//       ClientId: CLIENT_ID,
//       AuthParameters: {
//         USERNAME: username,
//         PASSWORD: password,
//       },
//     };
//     const authResponse = await cognito.initiateAuth(authParams).promise();

//     // Generate a JWT token for the user
//     const token = jwt.sign(
//       {
//         userId: user.id,
//         username,
//         accessToken: authResponse.AuthenticationResult.AccessToken,
//       },
//       process.env.JWT_SECRET
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       refreshToken: authResponse.AuthenticationResult.RefreshToken,
//     });
//   } catch (error) {
//     console.error("Error during callback:", error.message);
//     res.status(500).json({
//       error: "Callback failed",
//       message: error.message || "An unexpected error occurred.",
//     });
//   }
// };

// exports.callback = async (req, res) => {
//   const { code } = req.body;

//   if (!code) {
//     return res.status(400).json({ error: "Missing authorization code" });
//   }

//   try {
//     // Exchange the Google authorization code for an ID token
//     const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", null, {
//       params: {
//         client_id: GOOGLE_CLIENT_ID,
//         client_secret: GOOGLE_CLIENT_SECRET,
//         redirect_uri: REDIRECT_URI,
//         code,
//         grant_type: "authorization_code",
//       },
//     });

//     const { id_token } = tokenResponse.data;

//     // Decode the ID token
//     const decodedToken = jwt.decode(id_token);
//     const userEmail = decodedToken?.email;
//     const firstName = decodedToken?.given_name;

//     if (!userEmail || !firstName) {
//       return res.status(400).json({ error: "Invalid token: Email or first name not found" });
//     }

//     // Check if the user exists in the database
//     let user = await User.findOne({ where: { email: userEmail } });
//     let username;

//     if (!user) {
//       // New user: create them in the database
//       username = firstName.toLowerCase().replace(/\s+/g, "_");
//       user = await User.create({
//         username,
//         email: userEmail,
//         password: "Test@12345", // Provide a dummy password
//         role: "customer",
//         verified: true,
//       });
//     } else {
//       username = user.username;
//     }
//     console.log(username)
//     // Authenticate the user with Cognito using the Google ID token
//     const authParams = {
//       AuthFlow: "ADMIN_NO_SRP_AUTH",
//       ClientId: CLIENT_ID,
//       UserPoolId: USER_POOL_ID, // Ensure UserPoolId is included
//       AuthParameters: {
//         USERNAME: username, // Use email as the username
//         IDP: "Google",
//         ID_TOKEN: id_token,
//       },
//     };

//     const authResponse = await cognito.adminInitiateAuth(authParams).promise();

//     // Generate a JWT token for your application
//     const token = jwt.sign(
//       {
//         userId: user.id,
//         username,
//         accessToken: authResponse.AuthenticationResult.AccessToken,
//       },
//       process.env.JWT_SECRET
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       refreshToken: authResponse.AuthenticationResult.RefreshToken,
//     });
//   } catch (error) {
//     console.error("Error during callback:", error.message);
//     res.status(500).json({
//       error: "Callback failed",
//       message: error.message || "An unexpected error occurred.",
//     });
//   }
// };

exports.callback = async (req, res) => {
  const { code } = req.body; // Cognito sends the code as a query parameter.

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    // Exchange the code for tokens
    const tokenResponse = await axios.post(`https://${process.env.USER_POOL_DOMAIN}.auth.${process.env.AWS_REGION}.amazoncognito.com/oauth2/token`, null, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params: {
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        code,
      },
    });

    const { id_token, access_token, refresh_token } = tokenResponse.data;

    // Decode the ID token to get user details
    const decodedToken = jwt.decode(id_token);
    console.log("Decoded ID Token:", decodedToken); 
    const { email } = decodedToken;
    const cognitoUsername = decodedToken['cognito:username'];
    const isGoogleSignIn = decodedToken['identities']?.some(
      (identity) => identity.providerName === 'Google'
    );

    if (!email || !cognitoUsername) {
      return res.status(400).json({ error: "Invalid token: Missing email or username" });
    }

    // Extract username: part of email before '@' for Google sign-ins
    // const emailUsername = email.split('@')[0];

    // Declare username variable here
    let username;

    // Check if user exists in your database
    let user = await User.findOne({ where: { email } });
    if (!user) {
      // Assign username for new users
      username = cognitoUsername;
      user = await User.create({
        username,
        email,
        role: "customer",
        verified: isGoogleSignIn ? false:true,
      });
    } else {
      // Assign username for existing users
      username = user.username;

    }

    const groupParams = {
      GroupName: user.role,
      UserPoolId: USER_POOL_ID,
      Username: cognitoUsername,
    };

    await cognito.adminAddUserToGroup(groupParams).promise();

    // Generate a custom JWT token for your application
    const appToken = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        cognitoAccessToken: access_token,
      },
      process.env.JWT_SECRET
    );

    res.json({
      message: "Login successful",
      token: appToken,
      refreshToken: refresh_token,
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

  exports.login = (req, res) => {
    const hostedUiUrl = `https://${process.env.USER_POOL_DOMAIN}.auth.${process.env.AWS_REGION}.amazoncognito.com/oauth2/authorize?` +
      `client_id=${CLIENT_ID}` +
      `&response_type=code` +
      `&scope=email%20profile%20openid` +
      `&redirect_uri=${REDIRECT_URI}`;
      
    res.redirect(hostedUiUrl);
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

