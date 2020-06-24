const {db}=require('../connections/mysql')
const encrypt=require('../supports/crypto')
const transporter=require('../supports/mailer')
const {createJWTToken}=require('../supports/jwt')
const jwt=require('jsonwebtoken')


module.exports={
                   ////////// CREATE NEW USER ////////////////
    create:(req,res)=>{
        console.log('creating new user...')
        const {username,email,password,address} = req.body
        var userdata={
            username,
            email,
            password: encrypt(password),
            address
        }
        console.log(req.body)
        console.log(userdata)
        // var sql=''
        // CHECK AVAILABILITY
        // for developing, duplicate email is let through
        // var sql=`select * from users where email='${email}' or username='${username}'`
        var sql=`select * from users where username='${username}'`
        db.query(sql,(err,checkuser)=>{
            if(err) return res.status(500).send(err)
            console.log('selecting user existing passed')
            console.log(checkuser)
            if(checkuser.length){
                console.log('username/email sudah terpakai')
                res.status(200).send({status:false,message:'username atau email sudah terpakai'})
            }else{
                // CREATE NEW USER
                console.log('masuk bagian else dari register')
                sql=`insert into users set ?`
                db.query(sql,userdata,(err,created)=>{
                    console.log(created)
                    console.log(userdata)
                    if(err) return res.status(500).send(err)
                    console.log(`account ${username} berhasil dibuat`)
                    console.log('sending email verification...')
                    // SEND EMAIL VERIFICATION
                    var token=createJWTToken({iduser:created.insertId})
                    var VerificationLink=`http://localhost:3000/verification/${token}`
                    var maildata={
                        from: 'Admin <mde50526@gmail.com>',
                        to: email,
                        subject: 'E-Commerce Verification Account',
                        html: `Hai ${username}, klik link berikut untuk verifikasi account kamu,link ini kadaluarsa dalam 24 jam
                        <a href=${VerificationLink}>verify</a>`
                    }
                    transporter.sendMail(maildata,(err,sent)=>{
                        if(err) return res.status(500).send(err)

                        console.log('email sent')
                        console.log('')
                        res.status(200).send({status:true})
                    })
                })
            }
        })
    },
                   ////////// VERIFICATION NEW USER ////////////////
    verify:(req,res)=>{
        console.log('verifying account...')
        console.log(req.body)
        const {token}=req.body
        jwt.verify(token,"puripuriprisoner",(err,decoded)=>{
            if(err) return res.status(200).send({status:false,message:'Token kadaluarsa'})
            console.log(decoded)
            var sql=`update users set ? where iduser=${decoded.iduser}`
            db.query(sql,{isverified:true},(err,updated)=>{
                if(err) res.status(500).send(err)
                console.log('email is verified')
                console.log('')
                sql=`select * from users where iduser=${decoded.iduser}`
                db.query(sql,(err,userdata)=>{
                    if(err) return res.status(500).send(err)
                    
                    var newtoken=createJWTToken({id:userdata[0].iduser,username:userdata[0].username})
                    var update={
                        // isverified:userdata[0].isverified,
                        ...userdata[0],
                        token:newtoken
                    }
                    res.status(200).send({status:true,update})
                })
            })
        })
    },
                   ////////// RESEND VERIFICATION ////////////////
    resendmail:(req,res)=>{
        console.log('resend email verification...')
        // const {username,email,password,address} = req.body
        const {iduser,username,email}=req.body
        var token=createJWTToken({iduser:iduser})
        var VerificationLink=`http://localhost:3000/verification/${token}`
        var maildata={
            from: 'Admin <mde50526@gmail.com>',
            to: email,
            subject: 'E-Commerce Verification Account',
            html: `Hai ${username}, klik link berikut untuk verifikasi account kamu,link ini kadaluarsa dalam 24 jam
            <a href=${VerificationLink}>verify</a>`
        }
        transporter.sendMail(maildata,(err,sent)=>{
            if(err) return res.status(500).send(err)

            console.log('email sent')
            console.log('')
            res.status(200).send({status:true})
        })
    },
                   ////////// FORGOT PASSWORD VERIFICATION ////////////////
    forgotpassverify:(req,res)=>{
        const {email,username}=req.body
        var token=createJWTToken({username:username})
        var recoveryLink=`http://localhost:3000/forgotpassword/${token}`
        var maildata={
            from: 'Admin <jamestjahjadi@gmail.com>',
            to: email,
            subject: 'E-Commerce Recovery Password',
            html: `Hi ${username}, Please kindly click the link below before 24 hours to change your password
            <a href=${recoveryLink}>verify</a>`
        }
        transporter.sendMail(maildata,(err,sent)=>{
            if(err) return res.status(500).send(err)
            res.status(200).send({Message:'Recovery Email sent'})
        }) 
    },
                   ////////// USER CHANGE PASSWORD ////////////////
    changepassword:(req,res)=>{
        const {email,password}=req.body
        console.log(email)
        var sql=`select * from users where email='${email}'`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            console.log(result[0])
            
            if(result.length){
                var newpass={password:password}
                console.log('nyampe line 130')
                
                var sql1=`update users set ? where iduser=${result[0].iduser}`
                db.query(sql1,newpass,(err,result1)=>{
                    console.log(result1)
                    if(err) res.status(500).send(err)
                    console.log('LINE 136')
                    var sql2=`select * from users where iduser=${result[0].iduser}`
                    db.query(sql2,(err,result2)=>{
                        if (err) res.status(500).send(err)
                        res.status(200).send({...result2[0]})
                    })
                })
            }else{
                res.status(200).send({message:'emai is not available'})
            }
        })
    },
                   ////////// GET ALL USER ////////////////
    allusers:(req,res)=>{
        console.log('all users data')
        var sql='select * from users'
        db.query(sql,(err,alluser)=>{
            if(err) return res.status(500).send(err)
            res.status(200).send(alluser)
        })
        // res.status(200).send({data:'test'})
        console.log('ini setelah db')
        // console.log(allusers)
    },


    empty:(req,res)=>{
        // nothing
        res.status(500).send({data:'empty2'})
        res.status(200).send({data:'empty'})

    },
                       ////////// LOGIN ENTER ////////////////
    login:(req,res)=>{
        const {password,username}=req.query
        console.log(req.query)
        const hashpass=encrypt(password)
        var sql=`select * from users where username='${username}'`
        db.query(sql,(err,result)=>{
            if(err){
                return res.status(500).send(err)
            }
            console.log(result)
            if(result.length){
                var obj={
                    lastlogin:new Date()
                }
                var sql=`update users set ? where iduser=${result[0].iduser}`
                db.query(sql,obj,(err,result2)=>{
                    console.log(result2)
                    if(err){
                        return res.status(500).send(err)
                    }
                    const token=createJWTToken({id:result[0].iduser,username:result[0].username})
                    console.log('result.length login lewat')
                    return res.status(200).send({...result[0],token:token, status:true})     //jika user ada, pertama objek result[0] dibuuka dengan ... untuk menambahkan objek token ke dalamnya
                })
            }else{
                return res.status(200).send({message:'user nggak ada', status:false})     //jika user nggak ada
            }
        })
    },

                       ////////// KEEP LOGIN USER ////////////////
    keeplogin:(req,res)=>{
        console.log('keeplogin')
        console.log(req.user)
        var sql=`select * from users where iduser=${req.user.id}`
        db.query(sql,(err,result)=>{
            console.log('ini keeplogin')
            if(err){
                return res.status(500).send(err)
            }
            const token=createJWTToken({id:result[0].iduser,username:result[0].username})
            return res.status(200).send({...result[0],token})
        })
    },
    forgotpassverify:(req,res)=>{
        const {email,username}=req.body
        var token=createJWTToken({username:username})
        var recoveryLink=`http://localhost:3000/forgotpassword/${token}`
        var maildata={
            from: 'Admin <jamestjahjadi@gmail.com>',
            to: email,
            subject: 'E-Commerce Recovery Password',
            html: `Hi ${username}, Please kindly click the link below before 24 hours to change your password
            <a href=${recoveryLink}>verify</a>`
        }
        transporter.sendMail(maildata,(err,sent)=>{
            if(err) return res.status(500).send(err)
            res.status(200).send({Message:'Recovery Email sent'})
        }) 
    },
    changepassword:(req,res)=>{
        const {email,password}=req.body
        console.log(email)
        var sql=`select * from users where email='${email}'`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            console.log(result[0])
            
            if(result.length){
                var newpass={password:password}
                console.log('nyampe line 130')
                
                var sql1=`update users set ? where iduser=${result[0].iduser}`
                db.query(sql1,newpass,(err,result1)=>{
                    console.log(result1)
                    if(err) res.status(500).send(err)
                    console.log('LINE 136')
                    var sql2=`select * from users where iduser=${result[0].iduser}`
                    db.query(sql2,(err,result2)=>{
                        if (err) res.status(500).send(err)
                        res.status(200).send({...result2[0]})
                    })
                })
            }else{
                res.status(200).send({message:'emai is not available'})
            }
        })
    },
        ////////// SHOW PROFILE USER DATA ////////////////
        showProfile:(req,res)=>{
            const {iduser}=req.query
            var sql=`select * from users where iduser=${iduser}`
            console.log(iduser)
            db.query(sql,(err,result)=>{
                console.log(result)
                if(err) res.status(500).send(err)
                res.status(200).send({...result[0]})
            })
        },
                           ////////// EDIT USERDATA ////////////////
        editProfile:(req,res)=>{
            const {username,address,iduser}=req.body
            var obj={
                username,
                address
            }
            var sql=`update users set ? where iduser=${iduser}`
            db.query(sql, obj, (err,result)=>{
                if(err) res.status(500).send(err)
                res.status(200).send({message:'Profile Updated'})
            })
        },

    getSeller:(req,res)=>{
        console.log('get data seller')
        const {iduser}=req.query

        var sql=`select * from seller where iduser=${iduser}`
        db.query(sql,(err,sellers)=>{
            if(err) return res.status(500).send(err)
            res.status(200).send(sellers[0])
        })
    },
}
                   



       
