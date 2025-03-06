const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    
    // Instead of verifying with Google servers, trust the credential data directly
    const credential = req.body.credential;
    
    if (!credential) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        details: 'Google credential token is missing' 
      });
    }
    
    const parts = credential.split('.');
    if (parts.length !== 3) {
      return res.status(400).json({ error: 'Invalid token format' });
    }
    
    
    let payload;
    try {
      const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = Buffer.from(base64Payload, 'base64').toString('utf8');
      payload = JSON.parse(jsonPayload);
      console.log('Decoded payload:', JSON.stringify(payload, null, 2));
    } catch (e) {
      return res.status(400).json({ error: 'Invalid token payload' });
    }
    
    
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;  
    
    if (!googleId || !email || !name) {
      return res.status(400).json({ 
        error: 'Invalid token data', 
        details: 'Missing required user information' 
      });
    }
    
    
    let user = await User.findOne({ googleId });
    if (!user) {
      console.log('Creating new user with Google ID:', googleId);
      user = new User({
        googleId,
        email,
        name,  
        chains: []
      });
      await user.save();
      console.log('New user created:', user._id);
      
     
      return res.json({ 
        success: true, 
        userId: user._id.toString(),
        name: name,  
        isNewUser: true
      });
    } else {
      console.log('Existing user found:', user._id);
      
      
      return res.json({ 
        success: true, 
        userId: user._id.toString(),
        name: user.name,  
        isNewUser: false
      });
    }
  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({ 
      error: 'Login failed', 
      details: error.message
    });
  }
};