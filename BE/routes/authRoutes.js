const express = require('express');
const { signup, confirm, signin , userInfo, google, callback,resendVerificationCode } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication and Google OAuth
 */

/**
 * @swagger
 * /api/auth/getUserInfo:
 *   get:
 *     summary: Retrieves user information for the authenticated user.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   description: Unique identifier for the user.
 *                 fullName:
 *                   type: string
 *                   description: Full name of the user.
 *                 email:
 *                   type: string
 *                   description: Email of the user.
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *       500:
 *         description: Internal server error while fetching user info.
 */

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Google OAuth authentication route.
 *     tags: [Authentication]
 *     description: Redirects to Google OAuth consent screen for user authentication.
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent screen.
 *       500:
 *         description: Internal server error during Google authentication process.
 */

/**
 * @swagger
 * /api/auth/callback:
 *   post:
 *     summary: Handles the callback from Google OAuth.
 *     tags: [Authentication]
 *     description: Receives the OAuth callback from Google and processes the user login or signup.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: The authorization code received from Google OAuth.
 *     responses:
 *       200:
 *         description: User logged in or signed up successfully via Google.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT token for the logged-in user.
 *       400:
 *         description: Bad Request - Invalid or missing authorization code.
 *       500:
 *         description: Internal server error during OAuth callback handling.
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Registers a new user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the user.
 *               email:
 *                 type: string
 *                 description: Email of the user.
 *               password:
 *                 type: string
 *                 description: Password chosen by the user.
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully."
 *       400:
 *         description: Bad Request - Missing or invalid input data.
 *       500:
 *         description: Internal server error during user registration.
 */

/**
 * @swagger
 * /api/auth/confirm:
 *   post:
 *     summary: Confirms user email address for registration.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token sent to user's email for email confirmation.
 *     responses:
 *       200:
 *         description: Email successfully confirmed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email confirmed successfully."
 *       400:
 *         description: Bad Request - Invalid or missing confirmation token.
 *       500:
 *         description: Internal server error during email confirmation.
 */

/**
 * @swagger
 * /api/auth/resend-code:
 *   post:
 *     summary: Resend the email verification code to the user.
 *     tags: [Authentication]
 *     description: Sends a new verification code to the user’s email to confirm their account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user requesting the verification code.
 *                 example: "johndoe"
 *     responses:
 *       200:
 *         description: Verification code resent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Verification code resent successfully"
 *       400:
 *         description: Resend failed due to invalid input or Cognito error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Resend failed"
 *                 message:
 *                   type: string
 *                   example: "Invalid username or Cognito error message"
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Authenticates an existing user and generates a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user.
 *               password:
 *                 type: string
 *                 description: Password for the user.
 *     responses:
 *       200:
 *         description: User signed in successfully and JWT token generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT token for the authenticated user.
 *       400:
 *         description: Bad Request - Invalid email or password.
 *       401:
 *         description: Unauthorized - Invalid credentials.
 *       500:
 *         description: Internal server error during user authentication.
 */

router.get('/getUserInfo', authenticate, userInfo );
router.post('/resend-code',resendVerificationCode);
router.get('/google',google);
router.post('/callback',callback);
router.post('/signup', signup);
router.post('/confirm', confirm);
router.post('/signin', signin);


module.exports = router;
