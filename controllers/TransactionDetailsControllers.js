const {db}=require('../connections/mysql')
const {uploader}=require('../supports/uploader')
const fs=require('fs')


module.exports={
    add:(req,res)=>{
        console.log('creating transaction details...')

        console.log(req.body)

        const {iduser,iditem}=req.body

        // CHECK IF TRANSACTION DETAILS WITH IDUSER ALREADY EXIST
        var sql=`select * from transactiondetails where iduser=${iduser} and iditem=${iditem} and idorderstatus=1`
        db.query(sql,(err,check)=>{
            if(err) return res.status(500).send(err)

            console.log(check)
            if(check.length){
                // ALREADY EXIST
                // JUST ADD QTY and MESSAGE, also isdeleted=1
                var newqty=check[0].qty+req.body.qty

                // CHECK IF STOCK IS GOOD
                sql=`select * from items where iditem=${iditem}`
                db.query(sql,(err,item)=>{
                    if(err) return res.status(500).send(err)

                    console.log(item)
                    if(newqty>item[0].stock){
                        // STOCK IS NOT ENOUGH
                        console.log('stock is not enough')
                        return res.status(200).send({status:false,message:'Stock is not enough'})
                    }else{
                        // STOCK IS GOOD
                        var edit={
                            qty: newqty,
                            message: req.body.message,
                            isdeleted: 0,
                        }
                        sql=`update transactiondetails set ? where idtransactiondetail=${check[0].idtransactiondetail}`
                        db.query(sql,edit,(err,updated)=>{
                            if(err) return res.status(500).send(err)

                            console.log('qty added')
                            res.status(200).send({status:true,message:'qty added'})
                        })
                        
                    }
                })

            }else{
                // TRANSACTION DETAILS DONT EXIST
                // CREATE...
                var td={
                    ...req.body,
                    idorderstatus: 1
                }
                // CHECK IF STOCK IS GOOD
                sql=`select * from items where iditem=${iditem}`
                db.query(sql,(err,item)=>{
                    if(err) return res.status(500).send(err)

                    if(req.body.qty>item[0].stock){
                        // STOCK IS NOT ENOUGH
                        console.log('stock is not enough')
                        res.status(200).send({status:false,message:'Stock is not enough'})
                    }else{
                        // STOCK IS GOOD
                        sql=`insert into transactiondetails set ?`
                        db.query(sql,td,(err,created)=>{
                            if(err) return res.status(500).send(err)
        
                            console.log('transaction details created')
                            res.status(200).send({status:true,message:'transaction details created'})
                        })

                    }
                })

            }
        })





        // PREVIOUS STRUCTURE
        
        // const {idtransaction,iditem}=req.body

        // // CHECK IF TRANSACTION DETAILS WITH IDTRANSACTION ALREADY EXIST
        // var sql=`select * from transactiondetails where idtransaction=${idtransaction} and iditem=${iditem}`
        // db.query(sql,(err,check)=>{
        //     if(err) return res.status(500).send(err)

        //     if(check.length){
        //         // ALREADY EXIST
        //         // JUST ADD QTY and MESSAGE, also isdeleted=1
        //         var newqty=check[0].qty+req.body.qty

        //         // CHECK IF STOCK IS GOOD
        //         sql=`select * from items where iditem=${iditem}`
        //         db.query(sql,(err,item)=>{
        //             if(err) return res.status(500).send(err)

        //             console.log(item)
        //             if(newqty>item[0].stock){
        //                 // STOCK IS NOT ENOUGH
        //                 console.log('stock is not enough')
        //                 return res.status(200).send({status:false,message:'Stock is not enough'})
        //             }else{
        //                 // STOCK IS GOOD
        //                 var edit={
        //                     qty: newqty,
        //                     message: req.body.message,
        //                     isdeleted: 0,
        //                 }
        //                 sql=`update transactiondetails set ? where idtransactiondetail=${check[0].idtransactiondetail}`
        //                 db.query(sql,edit,(err,updated)=>{
        //                     if(err) return res.status(500).send(err)

        //                     console.log('qty added')
        //                     res.status(200).send({status:true,message:'qty added'})
        //                 })
                        
        //             }
        //         })

        //     }else{
        //         // TRANSACTION DETAILS DONT EXIST
        //         // CREATE...
        //         var td={
        //             ...req.body
        //         }
        //         // CHECK IF STOCK IS GOOD
        //         sql=`select * from items where iditem=${iditem}`
        //         db.query(sql,(err,item)=>{
        //             if(err) return res.status(500).send(err)

        //             if(req.body.qty>item[0].stock){
        //                 // STOCK IS NOT ENOUGH
        //                 console.log('stock is not enough')
        //                 res.status(200).send({status:false,message:'Stock is not enough'})
        //             }else{
        //                 // STOCK IS GOOD
        //                 sql=`insert into transactiondetails set ?`
        //                 db.query(sql,td,(err,created)=>{
        //                     if(err) return res.status(500).send(err)
        
        //                     console.log('transaction details created')
        //                     res.status(200).send({status:true,message:'transaction details created'})
        //                 })

        //             }
        //         })

        //     }
        // })
    },

    ///////////////////
    // GET ITEMS ONCART
    ///////////////////
    onCartDetails:(req,res)=>{
        console.log('finding items on cart...')

        console.log(req.query)

        const {iduser}=req.query

        var sql=`select * from transactiondetails td
        join items i on i.iditem=td.iditem
        join products p on p.idproduct=i.idproduct
        join seller s on s.idseller=p.idseller
        where td.isdeleted=0 and td.iduser=${iduser} and idorderstatus=1`
        db.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)

            console.log('sending data back')
            res.status(200).send(result)
        })
    },

    edit:(req,res)=>{
        console.log('editing transaction details...')

        console.log(req.params)
        const {idtransactiondetail} = req.params

        console.log(req.body)

        // CHECK ORDER IF IT IS ON CART
        // IN NOT ON CART, CANNOT EDIT

        var sql=`select idorderstatus from transactiondetails where idtransactiondetail=${idtransactiondetail}`
        db.query(sql,(err,order)=>{
            if(err) return res.status(500).send(err)

            if(order[0].idorderstatus==1){
                // ORDER IS ON CART
                
                var edit=req.body
                edit.order_updateat=new Date()
                
                if(edit.qty==0){
                    edit.isdeleted=1
                }
                
                sql=`update transactiondetails set ? where idtransactiondetail=${idtransactiondetail}`
                db.query(sql,edit,(err,updated)=>{
                    if(err) return res.status(500).send(err)
                    
                    console.log('updated')
                    res.status(200).send({status:true,message:'item is edited'})
                })
                
            }else{
                console.log('unable to edit, item is not on cart')
                res.status(200).send({status:false,message:'Item is not on cart'})
            }
        })

    },

    get:(req,res)=>{
        console.log('getting transaction details...')

        const{idtransactiondetail}=req.params

        var sql=`select * from transactiondetails where idtransactiondetail=${idtransactiondetail}`
        db.query(sql,(err,data)=>{
            if(err) return res.status(500).send(err)

            res.status(200).send(data[0])
        })
    },

    update:(req,res)=>{
        console.log('updating transaction details...')

        console.log(req.params)
        const {idtransactiondetail} = req.params

        console.log(req.body)


        var edit=req.body
        edit.order_updateat=new Date()

        if(edit.qty==0){
            edit.isdeleted=1
        }

        var sql=`update transactiondetails set ? where idtransactiondetail=${idtransactiondetail}`
        db.query(sql,edit,(err,updated)=>{
            if(err) return res.status(500).send(err)

            console.log('updated')
            res.status(200).send(updated)
        })
    },

    adminGetStatus:(req,res)=>{
        console.log('get all orders with status')

        const {idorderstatus}=req.query
        var sql=`select * from transactiondetails td
        join orderstatus os on os.idorderstatus=td.idorderstatus
        join items i on i.iditem=td.iditem
        join products prod on prod.idproduct=i.idproduct
        join transactionsellers ts on ts.idtransactionseller=td.idtransactionseller
        join seller sel on sel.idseller=ts.idseller
        join delivery d on d.iddelivery=ts.iddelivery
        join transactions t on t.idtransaction=ts.idtransaction
        join payment p on p.idpayment=t.idpayment
        join status s on s.idstatus=t.idstatus
        join users u on u.iduser=t.iduser
        where td.idorderstatus=${idorderstatus}`

        db.query(sql,(err,list)=>{
            if(err) return res.status(500).send(err)

            res.status(200).send(list)
        })
    }

}