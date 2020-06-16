const mongoose = require('mongoose');

const storesSchema = mongoose.Schema({
    name: String,
    latitude: Number,
    longitude: Number
});

module.exports = mongoose.model('Store', storesSchema);