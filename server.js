const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const chainRoutes = require('./routes/chainRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/chain', chainRoutes);
app.use('/user', userRoutes);

console.log('Attempting to connect to MongoDB Atlas...');
console.log('If connection fails, please check your IP whitelist in MongoDB Atlas');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, 
  socketTimeoutMS: 45000, 
})
.then(() => {
  console.log('Connected to MongoDB Atlas successfully!');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('\n===== TROUBLESHOOTING STEPS =====');
  console.log('1. Check that your MongoDB Atlas connection string is correct in .env file');
  console.log('2. Make sure your IP address is whitelisted in MongoDB Atlas:');
  console.log('   - Log in to MongoDB Atlas at https://cloud.mongodb.com');
  console.log('   - Go to Network Access in the left sidebar');
  console.log('   - Click "Add IP Address" and add your current IP');
  console.log('   - Or add 0.0.0.0/0 to allow access from anywhere (less secure)');
  console.log('3. Check that your MongoDB Atlas cluster is running');
  console.log('4. Verify your username and password in the connection string');
  console.log('================================\n');
});


app.get('/', (req, res) => {
  res.send('Supply Chain API is running. MongoDB connection status: ' + 
    (mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to check server status`);
});