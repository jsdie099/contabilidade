const jwt = require("./jwt");
const connection = require("../database/connection");


module.exports={
    async index(req,res)
    {
        try
        {
            const token = req.headers.authorization;
            const payload = await jwt.verify(token);
            const id = await connection("user_account").select("id").where("id_user",payload.user_id).first();
            
            
            if(id)
            {
                const id_user_account = id.id;
                if(id_user_account)
                {
                    const data = await connection("user_expenses").select("*")
                    .where("id_user_account",id_user_account)
                    .orderBy("date_expense","desc");
                    data.map(d=>{
                        return d.id_user_account = undefined;
                    });
                    res.json(data);
                }
                else
                {
                    res.json("Sem conta cadastrada");
                }
            }
            else
            {
                res.json("Sem conta cadastrada");
            }
        }
        catch(e)
        {
            res.status(401).send(e,{message:"Conta já cadastrada"});
        }
    },
    async create(req,res)
    {      
        try
        {
            const {value, description,date_expense} = req.body;
            let id = Number(Math.floor(Math.random()*100000+1)+""+Math.floor(Math.random()*100+1));   
            const token = req.headers.authorization;
            const payload = await jwt.verify(token);
            const [data] = await connection("user_account").select("*").where("id_user",payload.user_id);
            const id_user_account = data.id; 
            
            if(id_user_account && value>0)
            {
                await connection("user_expenses").insert({
                    id,
                    id_user_account,
                    value,
                    description,
                    date_expense
                })
                return res.status(201).json({id,value,description,date_expense});
            }
            else{
                return res.json("Algo deu errado!");
            }
            
        }
        catch(e)
        {
            res.status(401).send(e);
        }
    },

    async delete(req,res)
    {
        try
        {
            const id_expense = req.headers.id_expense;
            const token = req.headers.authorization;
            const payload = await jwt.verify(token);
            const id_account = await connection("user_account").select("*").where("id_user",payload.user_id).first();
            const id_user_account = id_account.id;

            if(id_user_account)
            {
                const data = await connection("user_expenses")
                .where("id_user_account",id_user_account)
                .where("id",id_expense)
                .del();
                return res.status(204).json(data);
            }
        }
        catch(e)
        {
            let router = "Home";
            return res.status(401).send({e,router});
        }
    },
    async findByDate(req,res)
    {
        try
        {
            const {initDate,finalDate} = req.query;
            const token = req.headers.authorization;
            const payload = jwt.verify(token);
            if(payload.user_id)
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
                        return res.status(200).send(data);
                    }
                    return res.status(400);
                }
                return res.status(400); 
            }
            return res.status(400);
             
            
            
        }
        catch(e)
        {
            return res.send(e);
        }
    }
}