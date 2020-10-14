const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const schema = new Schema({
    name: {
        type: String,
        require: [true, 'name is required'],
        lowercase: true,
        minlength: [5, 'name must be atleast 5 characters'],
        maxlength: [256, 'name must be below 256 characters'],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is required'],
        validate: [validator.isEmail, 'please provide valid email address'],
        trim: true
    },
    phone: String,
    address: {
        type: String,
        minlength: [5, 'address should be at least 5 characters'],
        default: 'Genesys Techhub'
    },
    password: {
        type: String,
        minlength: [5, 'password must be atleast 5 characters'],
        required: [true, 'password field is required'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'password confirm field is required'],
        validate: {
            validator: function (val) {
                return this.password === val
            },
            message: 'passwords must match'
        }
    },
    role: {
        type: String,
        enum: ['admin', 'chef', 'customer'],
        default: 'user',
        select: false
    }
});

// Document middlewares
schema.pre('save', async function (next) {
    if (!this.isNew) return next();
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirm = undefined;
    next();
});

// Instance methods
schema.methods.signToken = function() {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_EXPIRES
    });
}

schema.methods.verifyPassword = async (userPassword, dbPassword) => {
    return await bcrypt.compare(userPassword, dbPassword);
}

module.exports = model('User', schema);