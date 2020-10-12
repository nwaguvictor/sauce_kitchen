const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'name is required'],
        lowercase: true,
        minlength: [5, 'name must be atleast 5 characters'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is required'],
    },
    password: {
        type: String,
        minlength: [5, 'password must be atleast 5 characters'],
        required: [true, 'password field is required']
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
        enum: ['admin, chef, user'],
        default: 'user'
    }
});

module.exports = mongoose.model('User', userSchema);