//  created by : ابراهيم المحمدي

// ---------- Import Models ---------------
const express = require("express")
const router = express.Router()
const Product = require('../models/Product')
const { check, validationResult } = require('express-validator/check')
const moment = require('moment');
moment().format();

// ----------------------------------------

// --------------- middleware to check if user is loogged in

isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/users/login')
}


//--------------- create new products
router.get('/create', isAuthenticated, (req, res) => {

    res.render('product/create', {
        // return error message
        errors: req.flash('errors')
    })
})


// --------------- route to home products
// used with a pagination to show 5 products per page 
router.get('/:pageNo?', (req, res) => {
    let pageNo = 1

    if (req.params.pageNo) {
        pageNo = parseInt(req.params.pageNo)
    }
    if (req.params.pageNo == 0) {
        pageNo = 1
    }

    let q = {
            skip: 5 * (pageNo - 1),
            limit: 5
        }
        //find totoal documents
    let totalDocs = 0

    Product.countDocuments({}, (err, total) => {

    }).then((response) => {
        totalDocs = parseInt(response)
        Product.find({}, {}, q, (err, products) => {
            //     res.json(products)
            let chunk = []
            let chunkSize = 3
            for (let i = 0; i < products.length; i += chunkSize) {
                chunk.push(products.slice(i, chunkSize + i))
            }
            //res.json(chunk)
            res.render('product/index', {
                chunk: chunk,
                message: req.flash('info'),
                total: parseInt(totalDocs),
                pageNo: pageNo
            })
        })
    })


})


// --------------- save product to db

router.post('/create', [
    check('title').isLength({ min: 5 }).withMessage('Product name should be more than 5 char'),
    check('type').isLength({ min: 5 }).withMessage('Product type should be more than 5 char'),
    check('price').isNumeric().withMessage('Product price should be numric'),
    check('date').isLength({ min: 5 }).withMessage('Product Expire Date should valid Date'),

], (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {

        req.flash('errors', errors.array())
        res.redirect('/products/create')
    } else {

        let newProduct = new Product({
            title: req.body.title,
            type: req.body.type,
            date: req.body.date,
            price: req.body.price,
            user_id: req.user.id,
            created_at: Date.now()
        })

        newProduct.save((err) => {
            if (!err) {
                console.log('product was added')
                req.flash('info', ' The product was created successfuly')
                res.redirect('/products')
            } else {
                console.log(err)
            }
        })
    }

})

// --------------- show single product
router.get('/show/:id', (req, res) => {
    Product.findOne({ _id: req.params.id }, (err, product) => {

        if (!err) {

            res.render('product/show', {
                product: product
            })

        } else {
            console.log(err)
        }

    })

})

// --------------- show edit product page

router.get('/edit/:id', isAuthenticated, (req, res) => {

    Product.findOne({ _id: req.params.id }, (err, product) => {

        if (!err) {

            res.render('product/edit', {
                product: product,
                productDate: moment(product.date).format('YYYY-MM-DD'),
                errors: req.flash('errors'),
                message: req.flash('info')
            })

        } else {
            console.log(err)
        }

    })

})

// --------------- update the product

router.post('/update', [
    check('title').isLength({ min: 5 }).withMessage('Product name should be more than 5 char'),
    check('type').isLength({ min: 5 }).withMessage('Product type should be more than 5 char'),
    check('price').isNumeric().withMessage('Product price should be numric'),
    check('date').isLength({ min: 5 }).withMessage('Product Expire Date should valid Date'),

], isAuthenticated, (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        req.flash('errors', errors.array())
        res.redirect('/products/edit/' + req.body.id)
    } else {
        // crete obj
        let newfeilds = {
            title: req.body.title,
            type: req.body.type,
            price: req.body.price,
            date: req.body.date
        }
        let query = { _id: req.body.id }

        Product.updateOne(query, newfeilds, (err) => {
            if (!err) {
                req.flash('info', " The product was updated successfuly"),
                    res.redirect('/products/edit/' + req.body.id)
            } else {
                console.log(err)
            }
        })
    }

})

// --------------- delete product

router.delete('/delete/:id', isAuthenticated, (req, res) => {

    let query = { _id: req.params.id }

    Product.deleteOne(query, (err) => {

        if (!err) {
            res.status(200).json('deleted')
        } else {
            res.status(404).json('There was an error .product was not deleted')
        }
    })
})

module.exports = router