const express = require('express');
const router = express.Router();
const { 
  createChain, 
  joinChain, 
  getUserChains, 
  getChainDetails 
} = require('../controllers/chainController');


router.post('/create', createChain);


router.post('/join', joinChain);


router.get('/user/:userId', getUserChains);

router.get('/:chainId', getChainDetails);

module.exports = router; 