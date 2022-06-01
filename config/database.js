// <!-- created by : ابراهيم العبدالسلام -->

// Connect to Mongo DB the same as connect to sql DB
const mongoose = require('mongoose')

let db = mongoose.connect('mongodb://localhost:27017/productsDB', { useNewUrlParser: true }, (err) => {

    if (err) {
        console.log(err)
    } else {
        console.log('connected to db succcesfuly...')
    }
})