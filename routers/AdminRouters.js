const express=require('express')
const {AdminControllers}=require('../controllers')

const Router=express.Router()

Router.get('/allseller', AdminControllers.AllSeller)


// INDO
Router.get('/sales/count',AdminControllers.getSalesCount)

module.exports=Router

