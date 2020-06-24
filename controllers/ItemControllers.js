const {db}=require('../connections/mysql')
const {uploader}=require('../supports/uploader')
const fs=require('fs')


module.exports={
    add:async (req,res)=>{
        console.log('add items...')
        // console.log(req.body)
        const {types}=req.body

        console.log(types)


        // FOR ASYNC, USE FOR OF LOOP INSTEAD OF FOREACH

        // for (const type of types){
        //     var item={
        //         idproduct: req.body.idproduct,
        //         type: JSON.stringify(type)
        //     }
        //     var sql=`insert into items set ?`
        //     db.query(sql,item, async (err,created)=>{
        //         if(err) return res.status(500).send(err)

        //         iditems.push(await created.insertId)
        //     })
        // }


        var iditems=[]
        
        if(types.length){
            // HAS VARIETIES
            console.log('item has a variation')

            for (const type of types){
                var item={
                    idproduct: req.body.idproduct,
                    type: JSON.stringify(type)
                }
                var sql=`insert into items set ?`
    
                const query=new Promise((resolve,reject)=>{
                    db.query(sql,item,(err,created)=>{
                        if(err){
                            return res.status(500).send(err)
                            reject(err)
                        } 
                        // if (err) return reject(err)
    
                        // iditems.push(created.insertId)
                        resolve(created.insertId)
                    })
                })
                iditems.push(await query)
                // await query
            }
    
    
            console.log(iditems)
    
            res.status(200).send(iditems)

        }else{
            // HAS NO VARIETIES
            console.log('item has no variation')

            var item={
                idproduct: req.body.idproduct,
                type: null
            }

            var sql=`insert into items set ?`

            db.query(sql,item,(err,created)=>{
                if(err) return res.status(500).send(err)

                iditems=[created.insertId]
            })
    
            console.log(iditems)
    
            res.status(200).send(iditems)

        }

    },

    get:(req,res)=>{
        console.log('get items...')
        console.log(req.query)
        const {idproduct}=req.query

        var sql=`
        select * from items as i
        join products as p on i.idproduct=p.idproduct
        join seller as s on s.idseller=p.idseller
        where i.idproduct=${idproduct}
        `
        db.query(sql,(err,items)=>{
            if(err) return res.status(500).send(err)
            res.status(200).send(items)
        })
    },

    edit:(req,res)=>{
        console.log('update item details...')
        console.log(req.params)
        const{iditem}=req.params

        var edit=req.body
        edit.updateat=new Date()

        var sql=`update items set ? where iditem=${iditem}`

        db.query(sql,edit,(err,updated)=>{
            if(err) return res.status(500).send(err)
            console.log('update item berhasil')
            res.status(200).send(updated)
        })
        

    },

    addphoto:(req,res)=>{
        console.log('adding photo...')
        // console.log(req.params)
        const{iditem}=req.params

        const path='/products'
        const upload=uploader(path,'PRD').array('photo',5)

        upload(req,res,(err)=>{
            if(err) return res.status(500).send(err)

            // console.log('req.files')
            // console.log(req.files)

            console.log('reqbodydata')
            console.log(req.body)

            // check if oldimagepath is null or empty array


            // const parse=(data)=>{
            //     try{
            //         if(JSON.parse(data)==null){
            //             return []
            //         }
            //         return JSON.parse(data)
            //     }catch{
            //         return []
            //     }
            // }

            // const newImagePath=parse(req.body.data)

            const newImagePath=JSON.parse(req.body.data)==null?[]:JSON.parse(req.body.data)

            console.log(newImagePath)

            const imagePath=req.files.map((file)=>{
                newImagePath.push(path+'/'+file.filename)
                return path+'/'+file.filename
            })

            console.log(newImagePath)

            // newImagePath.push(imagePath)

            const data={
                image:JSON.stringify(newImagePath),
                updateat:new Date()
            }

            var sql=`update items set ? where iditem=${iditem}`
            db.query(sql,data,(err,updated)=>{
                if(err) return res.status(500).send(err)
                console.log('update item berhasil')
                res.status(200).send(updated)
            })


        })

    },

    deletephoto:(req,res)=>{
        console.log('deleting photo...')
        console.log(req.params)
        console.log(req.body)

        const {iditem,index}=req.params
        const imagePath=req.body

        imagePath[index]

        // delete image from folder
        if(fs.existsSync('./public' + imagePath[index])){   // check if file exists to prevent error
            fs.unlinkSync('./public' + imagePath[index]);
        }

        // delete path
        imagePath.splice(index,1)

        var edit={
            image: JSON.stringify(imagePath),
            updateat:new Date()
        }

        var sql=`update items set ? where iditem=${iditem}`
        db.query(sql,edit,(err,update)=>{
            if(err) return res.status(500).send(err)
            
            res.status(200).send(update)
        })
    },


    subtractStock:(req,res)=>{
        console.log('subtracting stock...')
        const {iditem}=req.params
        const {qty}=req.body
        
        var sql=`select stock from items where iditem=${iditem}`
        db.query(sql,(err,item)=>{
            if(err) return res.status(500).send(err)

            console.log('stock',item[0])
            var stock=item[0].stock-qty
            console.log('new stock',stock)
            sql=`update items set ? where iditem=${iditem}`
            db.query(sql,{stock},(err,subtracted)=>{
                if(err) return res.status(500).send(err)

                console.log(`substract stock of id${iditem} to ${stock}`)
                res.status(200).send({stock})
            })

        })

    },

    undoStock:(req,res)=>{
        console.log('Undo stock')

        const {iditem}=req.params
        const {qty}=req.body
        
        var sql=`select stock from items where iditem=${iditem}`
        db.query(sql,(err,item)=>{
            if(err) return res.status(500).send(err)

            var stock=item[0].stock+qty
            sql=`update items set ? where iditem=${iditem}`
            db.query(sql,{stock},(err,undo)=>{
                if(err) return res.status(500).send(err)

                console.log(`undo stock of id${iditem} to ${stock}`)
                res.status(200).send({stock})
            })

        })
    },

    checkStock:(req,res)=>{
        console.log('checking stock...')
        const {iditem}=req.params
        const {qty}=req.body
        
        var sql=`select stock from items where iditem=${iditem}`
        db.query(sql,(err,item)=>{
            if(err) return res.status(500).send(err)

            console.log('stock',item[0])
            var stock=item[0].stock-qty
            res.status(200).send({stock})

        })

    },


    restockCancelledTransaction:(req,res)=>{
        console.log('Put stock back in store...')

        const{idtransaction}=req.query
        
        var sql=`select iditem,qty from transactiondetails where idtransaction=${idtransaction}`
        db.query(sql,(err,orders)=>{
            if(err) return res.status(500).send(err)

            console.log(orders)

            // LOOP
            orders.forEach((order,index)=>{

                console.log('restock item ',order.iditem)
                let sqlitem=`select stock from items where iditem=${order.iditem}`
                db.query(sqlitem,(err,item)=>{
                    if(err) return res.status(500).send(err)

                    var stock=item[0].stock+order.qty
                    var undo={
                        stock,
                        updateat:new Date()
                    }
                    sqlitem=`update items set ? where iditem=${order.iditem}`
                    db.query(sqlitem,undo,(err,restock)=>{
                        if(err) return res.status(500).send(err)

                        console.log('items ',order.iditem,' is restocked')
                        // status 200 after cycle ends
                        if(index==orders.length-1){
                            res.status(200).send(restock)
                        }
                    })

                })

            })
        })

    }
}