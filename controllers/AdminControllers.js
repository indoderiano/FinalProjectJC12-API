const {db}=require('../connections/mysql')
const transporter=require('../supports/mailer')

module.exports={
    ////////// GET SELLER ////////
    AllSeller:(req,res)=>{
        var sql=`select s.*, u.username,u.email,u.lastlogin from seller s join users u on s.iduser = u.iduser;`
        db.query(sql,(err,result)=>{
            if (err) res.status(500).send(err,{message:'error in line 9'})
            res.status(200).send(result)
        })
    },

    getSalesCount:(req,res)=>{
        var sql=`
        select m.merk_name
        ,count(c.category_name) as total
        from transactiondetails td
        join items i on i.iditem=td.iditem
        join products p on p.idproduct=i.idproduct
        join merk m on m.idmerk=p.idmerk
        join categories c on c.idcategory=p.idcategory
        join transactionsellers ts on ts.idtransactionseller=td.idtransactionseller
        join transactions t on t.idtransaction=ts.idtransaction
        -- where td.idorderstatus=4
        -- group by p.product_name
        -- group by c.category_name
        group by m.merk_name
        -- order by p.idproduct
        `
        db.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)

            res.status(200).send(result)
        })
    }
}