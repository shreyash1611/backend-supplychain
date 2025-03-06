const mongoose = require('mongoose');

const supplyChainSchema = new mongoose.Schema({
  chainId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  admin: { type: String, required: true }, 
  members: [{
    googleId: String,
    name: String,
    email: String,
    role: String
  }]
});

module.exports = mongoose.model('SupplyChain', supplyChainSchema); 