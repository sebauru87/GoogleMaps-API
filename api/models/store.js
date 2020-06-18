const mongoose = require('mongoose');

const storesSchema = mongoose.Schema({
    name: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

storesSchema.index({location: '2dsphere'}, {sparse: true});

module.exports = mongoose.model('Store', storesSchema);