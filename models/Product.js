//  created by : اصيل الزهراني 


// This Model Same As Table In SQL

const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    /* Column Name: 
    { 
        type: column data type , 
        required: is this filed accept null or not 
    }*/
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
})

// Create Model as Create Table in Sql 
let Product = mongoose.model('Product', productSchema, 'products')

// Export Model To Use it in another models
module.exports = Product