const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    let user = await UserModel.getUserByEmail(email);
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = await UserModel.createUser(name, email, hashedPassword);

    const payload = { user: { id: userId } };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'super_secret_jwt_key_resume_ai',
      { expiresIn: '10h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token, user: { id: userId, name, email } });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server validation error during signup' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'super_secret_jwt_key_resume_ai',
      { expiresIn: '10h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server validation error during login' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching user profiles' });
  }
};

module.exports = { signup, login, getUser };
