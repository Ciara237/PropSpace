const bcrypt = require('bcryptjs');
const User = require('../models/User');

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json(user);
};

const updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { username, phone, avatar } = req.body;

  if (username !== undefined) {
    const existingUser = await User.findOne({ username, _id: { $ne: req.user.id } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    user.username = username;
  }

  if (phone !== undefined) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  const updatedUser = user.toObject();
  delete updatedUser.passwordHash;

  return res.status(200).json(updatedUser);
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old password and new password are required' });
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);

  if (!isMatch) {
    return res.status(400).json({ message: 'Incorrect old password' });
  }

  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  await user.save();

  return res.status(200).json({ message: 'Password updated successfully' });
};

module.exports = { getProfile, updateProfile, updatePassword };
