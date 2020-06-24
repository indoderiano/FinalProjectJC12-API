const express=require('express')
const {TransactionDetailsControllers}=require('../controllers')

const Router=express.Router()


Router.post('/',TransactionDetailsControllers.add)
Router.get('/item/product/seller',TransactionDetailsControllers.onCartDetails)
Router.post('/:idtransactiondetail',TransactionDetailsControllers.edit)
Router.get('/order/:idtransactiondetail',TransactionDetailsControllers.get)
Router.put('/:idtransactiondetail',TransactionDetailsControllers.update)
Router.get('/admin',TransactionDetailsControllers.adminGetStatus)

module.exports=Router