const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_CONNECTION_STRING = 'mongodb+srv://kanakaraju:Jack9233@cluster0.4j4ykfa.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp';

mongoose.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());

// Define a User schema and model
const userSchema = new mongoose.Schema({
  user_id: Number,
  user_name: String,
  back_accounts: [String],
  accounts: {
    bank: String,
    branch: String,
    address: String,
    city: String,
    district: String,
    state: String,
    bank_code: String,
    weather: {
      temp: Number,
      humidity: Number,
    },
  },
});

const User = mongoose.model('User', userSchema);

// Create or update user data
app.post('/api/user', async (request, response) => {
  try {
    const { user_id, user_name, back_accounts, ...userData } = request.body.data;

    let user = await User.findOne({ user_id });

    if (!user) {
      user = new User({
        user_id,
        user_name,
        back_accounts,
        ...userData,
      });
    } else {
      
      user.set({
        user_name,
        back_accounts,
        ...userData,
      });
    }

    await user.save();

    response.json({ message: 'User data saved successfully' });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch user data by user_id
app.get('/api/user/:user_id', async (request, response) => {
  try {
    const user = await User.findOne({ user_id: request.params.user_id });

    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    response.json({ data: user });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
