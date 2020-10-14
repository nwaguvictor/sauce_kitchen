const { Schema, model } = require('mongoose');

const schema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'please provide customer ID']
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Food',
        required: [true, 'please provide food details']
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    location: String
});

// Query middlewares
schema.pre(/^find/, function (next) {
    this.populate('user', 'name')
    next();
})

module.exports = model('Order', schema);