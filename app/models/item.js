var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// item schema
var ItemSchema = new Schema({
    name: {type: String, index: true, required: true},
    desc: String,
    price: Number,
    qty: Number,
    category: {type: String, index: true, required: true},
    img: {type: Buffer, contentType: String},
    imgPath: {type: String, default: '/img/default-item.png'},
    userId: {type: String, idex: true},
    created: {type: Date, default: Date.now, index: true}
});

module.exports = mongoose.model('Item', ItemSchema);
