require('dotenv').config({ path: 'backend/.env' });
const mongoose = require('mongoose');
const Developer = require('./backend/models/Developer');
const { generateToken } = require('./backend/utils/auth');

async function test() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/authenticator');
    const dev = await Developer.create({ email: 'test2@test.com', password: 'password', name: 'test' });
    console.log('dev created:', dev);
    const token = generateToken({ id: dev._id, role: 'developer' });
    console.log('token:', token);
  } catch (err) {
    console.error('Error:', err);
  }
  mongoose.disconnect();
}
test();
