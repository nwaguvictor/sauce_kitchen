const { Schema, model } = require('mongoose');
const slugify = require('slugify');

// Define food schema
const schema = new Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: [true, 'food name is required'],
        minlength: [6, 'food name must be at least 6 characters'],
        maxlength: [256, 'food name must be at most 256 characters']
    },
    description: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, 'please provide food description']
    },
    price: {
        type: Number,
        enum: [200, 300, 500],
        default: 200
    },
    misc: {
        type: [String],
    },
    photo: String,
    isAvailable: {
        type: Boolean,
        default: true
    },
    slug: String
});

// Document middlewares
schema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

schema.pre(/^find/, function (next) {
    this.select('-__v')
    this.find({ isAvailable: { $ne: false } });
    
    next();
})

// Static methods
schema.statics.findBySlug = function (slug) {
    return this.findOne({ slug });
}

// export model
module.exports = model('Food', schema);