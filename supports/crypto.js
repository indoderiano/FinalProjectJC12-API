const crypto=require('crypto')

module.exports=(password)=>{
    return crypto.createHmac('sha256','indoselyjames').update(password).digest('hex')
}