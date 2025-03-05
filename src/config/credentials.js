// Google OAuth credentials configuration
module.exports = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID_HERE',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET_HERE',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback'
  }
};
