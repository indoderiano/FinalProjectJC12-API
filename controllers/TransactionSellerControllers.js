const {db}=require('../connections/mysql')
const {uploader}=require('../supports/uploader')
const fs=require('fs')


module.exports={

    update:(req,res)=>{
        console.log('updating transaction seller...')
        const{idtransactionseller}=req.params
        var update={
            ...req.body,
            package_updateat: new Date()
        }
        var sql=`update transactionsellers set ? where idtransactionseller=${idtransactionseller}`
        db.query(sql,update,(err,updated)=>{
            if(err) return res.status(500).send(err)

            console.log('transaction seller updated')
            res.status(200).send(updated)
        })
    },

    userGetStatus:(req,res)=>{
        console.log('get user transaction seller list')

        const {iduser,idpackagestatus}=req.query

        // var sql=`select * from transactions t
        // join transactionsellers ts on ts.idtransaction=t.idtransaction
        // join transactiondetails td on td.idtransactionseller=ts.idtransactionseller
        // where t.iduser=${iduser} and t.idstatus=1`
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
        where t.iduser=${iduser} and ts.idpackagestatus in (${idpackagestatus})`
        db.query(sql,(err,payment)=>{
            if(err) return res.status(500).send(err)

            
            res.status(200).send(payment)
        })
    },

    adminGetStatus:(req,res)=>{
        console.log('get all transaction seller list')

        const {idpackagestatus}=req.query

        // var sql=`select * from transactions t
        // join transactionsellers ts on ts.idtransaction=t.idtransaction
        // join transactiondetails td on td.idtransactionseller=ts.idtransactionseller
        // where t.iduser=${iduser} and t.idstatus=1`
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
        where ts.idpackagestatus in (${idpackagestatus})`
        db.query(sql,(err,payment)=>{
            if(err) return res.status(500).send(err)

            
            res.status(200).send(payment)
        })
    },

}