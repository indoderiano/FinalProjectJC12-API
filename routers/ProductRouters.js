const express=require('express')
const {ProductControllers}=require('../controllers')

const Router=express.Router()

Router.get('/productseller',ProductControllers.productseller)               //get all products for seller page
Router.post('/',ProductControllers.add)
Router.get('/get/:idproduct',ProductControllers.get)            //???
Router.put('/image/:idproduct',ProductControllers.addcover)
Router.put('/image/:idproduct/:index',ProductControllers.deletecover)
Router.put('/:idproduct',ProductControllers.edit)
Router.get('/allproducts',ProductControllers.allproducts)
Router.get('/searchproduct',ProductControllers.searchrpoduct)
Router.put('/sold/:idproduct',ProductControllers.countSold)
Router.put('/rating/:idproduct',ProductControllers.countRating)

/////////////////////////////////////////////////////////
// NOTE IMPORTANT
// Router.get('/:idproduct',ProductControllers.get)
// NEVER USE REQ.PARAMS THIS WAY
// BECAUSE IT WILL NOT ALLOW THE CODE AFTER IT TO EXECUTE
/////////////////////////////////////////////////////////

// not being used
// Router.post('/add',ProductControllers.create)

// not being used
// Router.put('/edit/:id',ProductControllers.edit)

module.exports=Router