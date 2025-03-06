const SupplyChain = require('../models/SupplyChain');
const User = require('../models/User');
const crypto = require('crypto');


exports.createChain = async (req, res) => {
  try {
    const { name, userId } = req.body;
    
    if (!name || !userId) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Chain name and userId are required'
      });
    }
    
    // Find the user to get their details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    
    const chainId = crypto.randomBytes(4).toString('hex');

    
    const newChain = new SupplyChain({
      chainId,
      name,
      admin: user.googleId,
      members: [{
        googleId: user.googleId,
        name: user.name,
        email: user.email,
        role: 'admin'
      }]
    });

    await newChain.save();
    console.log(`Created chain ${chainId} with admin ${user.name}`);
    
    
    user.chains.push({
      chainId,
      name,
      role: 'admin'
    });
    
    await user.save();
    
    res.json({ 
      success: true, 
      chainId, 
      name 
    });
  } catch (error) {
    console.error('Chain creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create chain',
      details: error.message
    });
  }
};


exports.joinChain = async (req, res) => {
  try {
    const { chainId, userId } = req.body;
    
    if (!chainId || !userId) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Chain ID and userId are required'
      });
    }
    
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    
    const chain = await SupplyChain.findOne({ chainId });
    if (!chain) {
      return res.status(404).json({ 
        error: 'ChainID does not exist or has been removed by the admin'
      });
    }
    
    
    const isMember = chain.members.some(member => member.googleId === user.googleId);
    if (isMember) {
      return res.status(400).json({ error: 'You are already a member of this chain' });
    }
    
    
    chain.members.push({
      googleId: user.googleId,
      name: user.name,
      email: user.email,
      role: 'user'
    });
    
    await chain.save();
    
    
    user.chains.push({
      chainId,
      name: chain.name,
      role: 'user'
    });
    
    await user.save();
    
    res.json({ 
      success: true, 
      chainId, 
      name: chain.name 
    });
  } catch (error) {
    console.error('Chain join error:', error);
    res.status(500).json({ 
      error: 'Failed to join chain',
      details: error.message
    });
  }
};


exports.getUserChains = async (req, res) => {
  try {
    const { userId } = req.params;
    
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      chains: user.chains 
    });
  } catch (error) {
    console.error('Get user chains error:', error);
    res.status(500).json({ 
      error: 'Failed to get user chains',
      details: error.message
    });
  }
};


exports.getChainDetails = async (req, res) => {
  try {
    const { chainId } = req.params;
    const userId = req.headers.authorization;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    // First get the user's googleId using their userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Now find the chain
    const chain = await SupplyChain.findOne({ chainId });
    if (!chain) {
      return res.status(404).json({ error: 'Supply chain not found' });
    }

    // Compare the googleId with chain.admin
    const isAdmin = chain.admin === user.googleId;
    
    console.log('Comparing:', {
      'User googleId': user.googleId,
      'Chain admin': chain.admin,
      'Is Admin': isAdmin
    });
    
    res.json({ 
      success: true, 
      chain,
      isAdmin
    });
  } catch (error) {
    console.error('Get chain details error:', error);
    res.status(500).json({ 
      error: 'Failed to get chain details',
      details: error.message
    });
  }
};