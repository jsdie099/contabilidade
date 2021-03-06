import React, {useState,useEffect} from 'react';

import {useHistory} from 'react-router-dom';


import Header from '../Header/Header';
import Footer from '../../Footer/Footer';

import api from '../../../services/api';

import './style.css';

document.title="Edição de Despesa";
export default function Edit()
{
    const history = useHistory();

    const [description, setDescription] = useState(null);
    const [value, setValue] = useState(null);
    const [dateExpense, setDateExpense] = useState(null);
    const [statusMessage,setStatusMessage] = useState("");
    
    
    
    useEffect(()=>{
        try
        {
            api.get("/user",{
                headers:{
                    authorization: "Bearer "+sessionStorage.getItem("token")
                }
            })
            .then((response)=>{
                if(response.status !== 200){
                    history.push("/");
                    sessionStorage.clear();
                }
                let get_string_url = window.location.href; 
                let url = new URL(get_string_url);
                let id_expense = Number(url.searchParams.get("id"));
                if(id_expense)
                {
                    api.get(`/edit?id=${id_expense}`,{
                        headers:{
                            authorization: sessionStorage.getItem("token")
                        }
                    })
                    .then((response)=>{
                        if(typeof(response.data) === "object")
                        {
                            setDescription(response.data.description);
                            setDateExpense(response.data.date_expense.replace(/\//g,"-"));
                            setValue(response.data.value);
                        }
                        else history.push("/Logged");                     
                    })
                    .catch(error=>console.log(error))
                }
            })
            .catch(error=>{
                console.error(error);
                history.push("/");
                sessionStorage.clear();
            })
        }
        catch(error)
        {
            console.error(error);
        }
    },[history]);
    useEffect(()=>{
        document.querySelector("div.update_expense").classList.add("update_expense","animating");
        const label = document.querySelector("div.update_expense").getElementsByTagName("label");
        const input = document.querySelector("div.update_expense").querySelectorAll("input");
        for(let i=0;i<label.length;i++)
        {
            label[i].classList.add("animating");
            if(input[i]!==undefined)input[i].classList.add("animating");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[[],history]); 

    async function handleSubmit(e)
    {
        e.preventDefault();
        if(description === "" || value === "" || dateExpense === "")
        {
            setStatusMessage("Nenhum campo pode ficar vazio!");
        }
        else
        {
            let data = {
                "description":description,
                "value":value,
                "date_expense":dateExpense
            }
            let get_string_url = window.location.href; 
            let url = new URL(get_string_url);
            let expense_id = Number(url.searchParams.get("id"));
            setStatusMessage("Aguarde...");
            api.put("/expense",data,{
                headers:{
                    authorization: sessionStorage.getItem("token"),
                    id_expense: expense_id
                }
            })
            .then((response)=>{
                if(response.data.message)
                {
                    setStatusMessage(response.data.message);
                    setTimeout(()=>history.push("/Logged"),1000);
                }
            })
            .catch(error=>{
                console.error(error);
                setStatusMessage("Ops, algo deu errado! Recarregue e tente novamente.");
                setTimeout(()=>setStatusMessage(""),2000);
            });
        }
    }
    
    return (
        <div className="todo-edit">
            <Header/>
            <div className="update_expense" data-animation="top">            
                <form onSubmit={(e)=>handleSubmit(e)}>
                    <label data-animation="left"  htmlFor="date">Data</label>
                    <input 
                        type="date" 
                        defaultValue={dateExpense} 
                        name="date"
                        onKeyUp={(e)=>setDateExpense(e.target.value)} 
                        onChange={(e)=>{setDateExpense(e.target.value)}}
                        data-animation="left"
                        
                    />                       
                    <br/>
                    <label data-animation="left" htmlFor="description">Descrição</label>
                    <input 
                        name="description"
                        type="text" 
                        defaultValue={description} 
                        onKeyUp={(e)=>setDescription(e.target.value)} 
                        data-animation="left"
                    />
                    <br/>
                    <label data-animation="left" htmlFor="value">Valor</label>
                    <input 
                        name="value"
                        type="text" 
                        defaultValue={value} 
                        onKeyUp={(e)=>setValue(e.target.value)}
                        data-animation="left"
                    />
                    <br/>
                    <label data-animation="left"  style={{display:"flex", flexDirection:"row", margin:"0"}}>
                    <button type="submit">Alterar</button>
                    <button type="button" onClick={()=>history.push("/Logged")}>Cancelar</button>
                    </label>
                    <br/><h4 id="message">{statusMessage}</h4>
                </form>
            </div>
            <Footer/>
        </div>
        
    );
}