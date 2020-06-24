const express=require('express')
const {TransactionSellerControllers}=require('../controllers')

const Router=express.Router()

Router.put('/:idtransactionseller',TransactionSellerControllers.update)
Router.get('/user',TransactionSellerControllers.userGetStatus)
Router.get('/admin',TransactionSellerControllers.adminGetStatus)

module.exports=Router