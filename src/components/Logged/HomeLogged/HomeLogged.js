import React, {useState,useEffect} from 'react';
import Expenses from './Expenses';


import {useHistory} from 'react-router-dom';


import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


import './style.css';

import user_icon from './user_icon.png';

import Header from '../Header/Header';
import Footer from '../../Footer/Footer';

import api from '../../../services/api';





export default function HomeLogged() {
    document.title = "Home";
    const history = useHistory();
    const [name, setName] = useState("");
    const [meta, setMeta] = useState("");
    const [total_income, setTotalIncome] = useState("");
    const [account, setAccount] = useState("");
    
    const [userImg, setUserImg] = useState();

    
    
    
    useEffect(()=>{
        api.get("/user",{
            headers:{
                authorization: "Bearer "+sessionStorage.getItem("token")
            }
        })
        .then((req)=>{
            if(req.data.router)
            {
                sessionStorage.clear();
                history.push(`/${req.data.router}`);
            }
            if(req.data)
            {
                if(req.data.total_income)
                {
                    setAccount(req.data);
                }
                setName(req.data.name);
            }
            api.get("/img",{
                headers:{
                    Authorization: sessionStorage.getItem("token")
                }
            })
            .then((res)=>{
                
                if(res.data.url)
                {
                    setUserImg(res.data.url);
                }
                else
                {
                    setUserImg(user_icon);
                }
                
            })
            .catch(e=>console.log(e))
        })
        .catch(e=>console.log(e));
    },[history]);


    
    function nameFormat(name)
    {
        if(name && (name.indexOf(" ")!==-1))
        {
            let [format,] =  name.split(" ");
            return format;
        }
        else
        {
            return name;
        }
    }



    async function redirect()
    {
        await history.push("/Profile");
    }
   
    async function handleCreateAccount(e)
    {
        e.preventDefault();
        if(!total_income || !meta || total_income<0 || meta<0)
        {
            alert("Digite os dados corretamente");
        }
        else
        {
            let data = {
                total_income: total_income,
                meta: meta
            };
            await api.post("/account",data,{
                headers:{
                    authorization: sessionStorage.getItem("token")
                }
            })
            .then((req)=>{
                setAccount(req.data);
            })
            .catch(e=>console.log(e));
        }
        
    }

    function getAccount()
    {
        if(account)
        {
            return(
                <Card id="todo_card">
                    
                    <img 
                        onClick={()=>redirect()} 
                        src={userImg} 
                        id="user_icon" 
                        style={{borderRadius:'50%'}} 
                        alt="profilePicture" 

                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Olá, {nameFormat(name)}
                        </Typography>
                            
                            <div className="title">
                                Renda Total:
                            </div>
                            <div className="val">
                            {"R$"+Number(account.total_income).toLocaleString("pt",{minimumFractionDigits: 2, 
                                    maximumFractionDigits: 2})}
                            </div>
                            
                            
                            <div className="title">
                                Meta mensal de gastos:
                            </div>
                            <div className="val">
                            {"R$"+Number(account.meta).toLocaleString("pt",{minimumFractionDigits: 2, 
                                maximumFractionDigits: 2})}
                            </div>
                    </CardContent>
                </Card>  
            );
        }
        else
        {
            return (
                <Card id="todo_card">
                    
                    <img 
                        onClick={()=>redirect()} 
                        src={userImg} id="user_icon" 
                        style={{borderRadius:'50%'}} 
                        alt="profilePicture" 
                        
                    />
                    
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Olá, {nameFormat(name)}
                        </Typography>
                            <div className="create_account">
                                <h2>Crie sua conta primeiro</h2>
                                <form onSubmit={handleCreateAccount}>
                                    <label>Sua renda total do mês:
                                        <input 
                                            type="text"
                                            placeholder="Sua renda" 
                                            required 
                                            value={total_income}
                                            onChange={(e)=>{setTotalIncome(e.target.value)}}
                                        />
                                    </label>
                                    <label>Sua meta mensal de gastos:
                                        <input 
                                            type="text"
                                            placeholder="Sua meta" 
                                            required 
                                            value={meta}
                                            onChange={(e)=>setMeta(e.target.value)}
                                        />
                                    </label>
                                    <input type="submit" value="Cadastrar"/>
                                </form>
                            </div>    
                    </CardContent>
                </Card>
            );
        }
        
    }

    
    
    return (
        <div className="todo-logged">
            <Header/>
            <div className="logged-container">
                <div className="user_details">
                        {getAccount()}
                </div>
                <div className="account_details">

                    <Expenses
                        account={account}
                    />
                </div>
            </div>
            <Footer/>
        </div>
    )
}
