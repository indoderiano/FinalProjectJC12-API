const express=require('express')
const {UserControllers}=require('../controllers')
const {Auth}=require('./../supports/Auth')

const Router=express.Router()

Router.get('/allusers/:username',UserControllers.allusers)
Router.get('/login',UserControllers.login)
Router.get('/keeplogin', Auth, UserControllers.keeplogin)
Router.post('/',UserControllers.create)
Router.put('/verify',UserControllers.verify)
Router.post('/resendmail',UserControllers.resendmail)
Router.post('/forgotpassword',UserControllers.forgotpassverify)
Router.put('/changepassword',UserControllers.changepassword)
Router.get('/profile',UserControllers.showProfile)
Router.put('/editprofile',UserControllers.editProfile)
Router.get('/seller',UserControllers.getSeller) // supposed to be in seller router
module.exports=Router