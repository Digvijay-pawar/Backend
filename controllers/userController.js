import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import generateUserId from '../utils/generateUserId.js';
// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { mobileNumber, password } = req.body;

  const user = await User.findOne({ mobileNumber });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      userID: user.userID,
      mobileNumber: user.mobileNumber,
      balance: user.balance,
    });
  } else {
    res.status(401);
    throw new Error('Invalid Mobile Number or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { mobileNumber,inviteCode, password } = req.body;

  const userExists = await User.findOne({ mobileNumber });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    mobileNumber,
    inviteCode,
    password,
    userID: generateUserId(),
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      mobileNumber: user.mobileNumber,
      inviteCode: user.inviteCode,
      balance: user.balance,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};


export {
  authUser,
  registerUser,
  logoutUser
};
