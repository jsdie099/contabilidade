const jwt = require('./jwt');
const connection = require("../database/connection");


module.exports = {
    async index(req,res)
    {
        try
        {
            const token = req.headers.authorization;  
            const payload = jwt.verify(token);
            const id_expense = Number(req.query.id);
            if(Number.isInteger(payload.user_id))
            {
                const id_account = await connection("user_account")
                    .select("id")
                    .where("id_user",payload.user_id)
                    .first();
                const data = await connection("user_expenses")
                    .select("*")
                    .where("id",id_expense)
                    .where("id_user_account",id_account.id)
                    .first();
                if(data)
                {
                    data.id_user_account = undefined;
                    return res.status(200).send(data);
                }
                return res.status(204).send("Despesa não encontrada!"); 
            }
            return res.status(401).send(payload); 
        }
        catch(error)
        {
            res.status(400).send(error);
        }
    },
    async findByDate(req,res)
    {
        try
        {
            const {initDate,finalDate} = req.query;
            const token = req.headers.authorization;
            const payload = jwt.verify(token);
            if(Number.isInteger(payload.user_id))
            {
                const id_account = await connection("user_account")
                    .select("id")
                    .where("id_user",payload.user_id)
                    .first();
                if(Number.isInteger(id_account.id))
                {
                    const data = await connection("user_expenses")
                        .select("*")
                        .where("id_user_account",id_account.id) 
                        .whereBetween("date_expense",
                            [initDate.replace(/-/g,"/","/"),finalDate.replace(/-/g,"/","/")]
                        );
                    if(data.length>0)
                    {
                        return res.status(200).json(data);
                    }
                    return res.status(204).json({message:"Nenhuma despesa encontrada!"});
                }
                return res.status(203).json({message:"Conta não encontrada!"});
            }
            return res.status(401).send(payload); 
        }
        catch(error)
        {
            return res.status(400).send(error);
        }
    }
}