const User = require('../models/User');
const SupplyChain = require('../models/SupplyChain');


exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        chains: user.chains
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile', details: error.message });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { userId, name } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (name) user.name = name;
    
    await user.save();
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
};

exports.getChainMembers = async (req, res) => {
  try {
    const { chainId, userId } = req.query;
    
    if (!chainId || !userId) {
      return res.status(400).json({ error: 'Chain ID and User ID are required' });
    }
    
    console.log(`Fetching members for chain: ${chainId}, requested by user: ${userId}`);
    
    // Find the chain
    const chain = await SupplyChain.findOne({ chainId });
    if (!chain) {
      console.log(`Chain not found: ${chainId}`);
      return res.status(404).json({ error: 'Supply chain not found' });
    }
    
    console.log(`Chain found: ${chain.name}, members: ${chain.members.length}`);
    
    
    const user = await User.findById(userId);
    if (!user) {
      console.log(`User not found: ${userId}`);
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userChain = user.chains.find(c => c.chainId === chainId);
    if (!userChain) {
      console.log(`User is not a member of this chain`);
      return res.status(403).json({ error: 'User is not a member of this chain' });
    }
    
    if (userChain.role !== 'admin') {
      console.log(`User is not an admin of this chain`);
      return res.status(403).json({ error: 'Only admin can view all members' });
    }
    
    console.log(`User is admin. Returning ${chain.members.length} members`);
    
    res.json({
      success: true,
      members: chain.members
    });
  } catch (error) {
    console.error('Get chain members error:', error);
    res.status(500).json({ error: 'Failed to get chain members', details: error.message });
  }
};
