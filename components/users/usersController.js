const _ = require('underscore');
const User = require('./user');
const AppError = require('../../utils/appError');
const { asyncWrapper, sendAuthResponse } = require('../../utils/helpers');

const controller = {
    signup: asyncWrapper(async (req, res, next) => {
        const { name, email, password, passwordConfirm } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return next(new AppError('user with that email already exist', 400));
        }
    
        user = await User.create({ name, email, password, passwordConfirm });
    
        // send response
        sendAuthResponse(res, user);
    }),
    signin: asyncWrapper(async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) return next(new AppError('provide email and password', 400));
    
        let user = await User.findOne({ email }).select('+password');
    
        if (!user || !(await user.verifyPassword(password, user.password))) {
            return next(new AppError('user email or password is incorrect', 401));
        }
    
        // Send Response
        sendAuthResponse(res, user);
    }),
    me: asyncWrapper(async (req, res, next) => {
        res.status(200).json({
            status: 'success',
            data: { user: req.user }
        });
    }),
    updateMe: asyncWrapper(async (req, res, next) => {
        const filtered = _.pick(req.body, 'name', 'email', 'address', 'phone');
        const user = await User.findByIdAndUpdate(req.user._id, filtered, { new: true, runValidators: true })
        res.status(200).json({
            status: 'success',
            data: { user }
        })
    }),
    deleteMe: asyncWrapper(async (req, res, next) => {
        await User.findOneAndUpdate({email: req.user.email}, { isActive: false });
        res.status(201).json({
            status: 'success',
            data: null
        });
    }),
    passwordForgot: asyncWrapper(async (req, res, next) => {

    }),
    passwordReset: asyncWrapper(async (req, res, next) => {

    }),
    passwordUpdate: asyncWrapper(async (req, res, next) => {
        const { current, password, passwordConfirm } = req.body;
        let user = await User.findById(req.user._id).select('+password');
        if (!current || !password || !passwordConfirm) {
            return next(new AppError('please provide all password fields', 400));
        }
        if (! (await user.verifyPassword(current, user.password))) {
            return next(new AppError('current password is wrong', 401));
        }
        user.password = password;
        user.passwordConfirm = passwordConfirm;
        await user.save();

        sendAuthResponse(res, user, 'password updated successfully');
    }),
    view: asyncWrapper(async (req, res, next) => {
        const users = await User.find({});
        res.status(200).json({
            status: 'success',
            data: {
                users
            }
        });
    }),
    show: asyncWrapper(async (req, res, next) => {

    }),
    delete: asyncWrapper(async (req, res, next) => {
        await User.findByIdAndDelete(req.params.id);
        res.status(201).json({
            status: 'success',
            data: null
        });
    })
}

module.exports = controller;

