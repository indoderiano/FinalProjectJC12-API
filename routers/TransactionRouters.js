const express=require('express')
const {TransactionControllers}=require('../controllers')

const Router=express.Router()


// Router.post('/',TransactionControllers.add)
// Router.get('/get',TransactionControllers.get)
Router.post('/secured',TransactionControllers.secureCreate)
Router.post('/',TransactionControllers.create)
Router.post('/seller',TransactionControllers.createtransactionseller)
Router.get('/user',TransactionControllers.userGetStatus)
Router.post('/paymentproof/:idtransaction',TransactionControllers.uploadPaymentProof)
Router.put('/:idtransaction',TransactionControllers.update)

Router.get('/seller',TransactionControllers.sellerGetStatus)
Router.get('/admin',TransactionControllers.adminGetStatus)


module.exports=Router