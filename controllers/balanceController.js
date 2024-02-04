import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const checkBalance = asyncHandler(async (req, res) => {
    const { mobileNumber } = req.body;

    const user = await User.findOne({ mobileNumber });

    if (user) {
        res.json({
            balance: user.balance,
        });
    }
});
const updateBalance = asyncHandler(async (req, res) => {
    const { mobileNumber, balance } = req.body;

    const user = await User.findOne({ mobileNumber });

    if (user) {
        user.balance = balance;
        await user.save();
        res.json({
            balance: user.balance,
        });
    }
})

export {
    checkBalance,
    updateBalance
};
