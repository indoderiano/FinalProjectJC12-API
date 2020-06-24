const nodemailer=require('nodemailer')

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

module.exports=transporter