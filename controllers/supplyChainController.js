const SupplyChain = require('../models/SupplyChain');
const User = require('../models/User');

exports.createSupplyChain = async (req, res) => {
  try {
    const { name, description } = req.body;
    const supplyChain = await SupplyChain.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id]
    });
    res.json(supplyChain);
  } catch (error) {
    console.error('Error creating supply chain:', error);
    res.status(500).json({ error: 'Failed to create supply chain' });
  }
};

exports.getMyChains = async (req, res) => {
  try {
    const chains = await SupplyChain.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    });
    res.json(chains);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch supply chains' });
  }
};

exports.getChainById = async (req, res) => {
  try {
    const chain = await SupplyChain.findById(req.params.chainId);
    if (!chain) {
      return res.status(404).json({ error: 'Supply chain not found' });
    }
    res.json(chain);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch supply chain' });
  }
};

exports.joinChain = async (req, res) => {
  try {
    const { chainId } = req.body;
    const chain = await SupplyChain.findById(chainId);
    
    if (!chain) {
      return res.status(404).json({ error: 'Supply chain not found' });
    }
    
    if (chain.members.includes(req.user._id)) {
      return res.status(400).json({ error: 'Already a member' });
    }
    
    chain.members.push(req.user._id);
    await chain.save();
    
    res.json(chain);
  } catch (error) {
    res.status(500).json({ error: 'Failed to join supply chain' });
  }
};