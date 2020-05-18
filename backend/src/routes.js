const express = require("express");

const multer = require("multer");
const configMulter = require("./services/multer");




const ControllerUser = require('./Controllers/ControllerUser');
const ControllerImg = require("./Controllers/ControllerImg");
const ControllerAccount = require("./Controllers/ControllerAccount");
const ControllerExpense = require("./Controllers/ControllerExpense");
const { celebrate, Joi, Segments } = require("celebrate");
const routes = express.Router();



//##CONTROLE DE USUÁRIOS


routes.get("/user",celebrate({
    [Segments.HEADERS]:Joi.object().keys({
        authorization : Joi.string().required()
    }).unknown()
}),ControllerUser.find);


routes.get("/login",celebrate({
    [Segments.HEADERS]:Joi.object().keys({
        auth: 
            [
                {
                    username: Joi.string().required(),
                    password: Joi.string().required(),
                }
            ]
    }).unknown()
}), ControllerUser.index);

routes.post("/register",celebrate({
    [Segments.BODY]:Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        password: Joi.string().required()
    }).unknown()
}), ControllerUser.create);


routes.put("/update",celebrate({
    [Segments.BODY]:Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        password: Joi.string()
    }).unknown()
}), ControllerUser.update);




//##FOTO DE PERFIL DO USUÁRIO

routes.post("/img",multer(configMulter).single("img"),celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}),ControllerImg.create);

routes.get("/img",celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}),ControllerImg.index);






//##CONTROLE DAS CONTAS FINANCEIRAS DOS USUÁRIOS

routes.get("/account",celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}),ControllerAccount.index);

routes.post("/account",celebrate({
    [Segments.BODY]: Joi.object({
        
        total_income: Joi.number().required(),
        meta: Joi.number().required()
    }).unknown(),
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}),ControllerAccount.create);



//##CONTROLE DE DESPESAS DOS USUÁRIOS


routes.get("/expense",celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}),ControllerExpense.index);



routes.get("/filter",celebrate({
    [Segments.QUERY]: Joi.object({
        initDate: Joi.string().required(),
        finalDate: Joi.string().required()
    }).unknown(),
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}),ControllerExpense.findByDate);

routes.post("/expense",celebrate({
    [Segments.BODY]: Joi.object({
        value: Joi.number().required(),
        description: Joi.string().required(),
        date_expense: Joi.string().required()
    }).unknown(),
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}),ControllerExpense.create);



routes.delete("/expense",celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required(),
        id_expense: Joi.number().required()
    }).unknown()
}),ControllerExpense.delete)


/*routes.put("/update",celebrate({
    [Segments.BODY]:Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        password: Joi.string().required()
    }).unknown()
}), ControllerUser.update);

routes.delete("/delete",celebrate({
    [Segments.BODY]:Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        password: Joi.string().required()
    }).unknown()
}), ControllerUser.delete);*/

module.exports = routes;