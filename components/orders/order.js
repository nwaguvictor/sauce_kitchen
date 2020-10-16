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
    address: String
});

// Query middlewares
schema.pre(/^find/, function (next) {
    this.populate({
        path: 'customer',
        select: 'name address phone -_id',
        model: 'User'
    });
    this.populate({
        path: 'item',
        select: 'name price -_id',
        model: 'Food'
    });
    this.select('customer item address');
    
    next();
})

module.exports = model('Order', schema);