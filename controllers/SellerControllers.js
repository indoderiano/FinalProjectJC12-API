const {db}=require('../connections/mysql')

module.exports={
/////////////////// CREATE NEW SELLER //////////////
    createSeller:(req,res)=>{
        const {namatoko,alamattoko,iduser}=req.body
        var newseller={
            namatoko,
            alamattoko,
            iduser,
            isverified:false
        }
        var sql=`select s.*,u.isseller from seller s 
                 join users u on s.iduser = u.iduser
                 where s.iduser=${iduser};`
                
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err,{message:'error in line 16'})
            if(result.length) {
                res.status(200).send({message:'You have been registered as a seller'})
                }else{
                    // INPUT USER AS A SELLER
                    console.log('line 22');
                    
                    var sql1=`insert into seller set ?`
                    db.query(sql1,newseller,(err,result1)=>{
                        if(err) res.status(500).send(err,{message:'error in line 23'})
                        console.log('line 28');
                    
                        var sql2=`update users set ? where iduser=${iduser}`
                        db.query(sql2,{isseller:1},(err,result2)=>{
                            if(err) res.status(500).send(err,{message:'error in line 32'})
                            var sql3=`select * from seller where idseller=${result1.insertId}`
                            db.query(sql3,(err,result3)=>{
                                if(err)res.status(500).send(err,{message:'error in line 31'})
                                res.status(200).send({...result3[0],message:'Registered as a Seller'})
                            })
                        })
                    })
                }
        }) 
    },
    /////////////////// GET SELLER //////////////
    getSeller:(req,res)=>{
        const {iduser}=req.query
        var sql=`select * from seller where iduser=${iduser}`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            res.status(200).send(result)
        })
    }
}