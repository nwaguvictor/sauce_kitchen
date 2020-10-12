const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'name is required'],
        lowercase: true,
        minlength: [5, 'name must be atleast 5 characters'],
    }
});

module.exports = mongoose.model('User', userSchema);