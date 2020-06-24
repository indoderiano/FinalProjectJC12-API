const jwt=require('jsonwebtoken')
const nodemailer=require('nodemailer')
const fs=require('fs')

var transporter=nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mde50526@gmail.com',
        pass: 'vfpnnmqzyowxabag'
    },
    tls: {
        rejectUnauthorized: false
    }
})
var token=jwt.sign({id:'test'},"shifu",{expiresIn:'24h'})
var verificationlink=`http://localhost:3000/verification/${token}`
// var unyu=fs.readFileSync('unyu.html','utf8')
var maildata={
    from: 'Hokage <mde50526@gmail.com>',
    to: 'mde50526@gmail.com',
    subject: 'E-Trainer Verification Account',
    // html: unyu
    html: `klik untuk verifikasi account, link ini kadaluarsa dalam 24 jam: 
    <a href=${verificationlink}>verify</a>`
}
transporter.sendMail(maildata,(err,result3)=>{
    if(err){
        console.log('send email gagal')
    }
    console.log('send email berhasil')
    // return res.status(200).send({status:true,message:'email verifikasi sudah dikirim'})
})