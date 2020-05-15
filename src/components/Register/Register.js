import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import InputMask from 'react-input-mask';


import api from '../../services/api';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import './style.css';

export default function Register() {
    document.title="Cadastrar";
    const history = useHistory();
    const [message,setMessage] = useState("");
    const [name,setName] = useState();
    const [email,setEmail] = useState("");
    const [phone,setPhone] = useState("");
    const [pass,setPass] = useState("");

    async function redirect()
    {
        await history.push("/Login");
    }

    async function register(e)
    {
        if(!name || !email || !phone || !pass)
        {
            e.preventDefault();
            setMessage("Digite todos os campos do formulário!");
        }
        else
        {
            e.preventDefault();
            const data = {
                name: name,
                email: email,
                phone: phone,
                password: pass
            }
            /*const data = new FormData();
            data.append("name",name);
            data.append("email",email);
            data.append("phone",phone);
            data.append("pass",pass);*/
            
            await api.post("register",data)
            .then((response)=>{
                setMessage(response.data.message);
                history.push(`/${response.data.router}`);
            })
            .catch((error)=>{
                console.log(error);
                setMessage(error.message);
                history.push(`/${error.router}`);
            });
        }
    }

    return (
        <div className="todo">
            <Header/>
            <div className="register-container center">
                <div>
                    <p>
                        Começe agora mesmo a administrar o seu dinheiro
                    </p>
                    <form className="form-register" onSubmit={(e)=>register(e)}>
                        <label>
                            <input 
                                onChange={(e)=>setName(e.target.value)} 
                                type="text" 
                                name="name" 
                                placeholder="Seu nome"
                            />
                        </label>

                        <label>
                            <input 
                                onChange={(e)=>setEmail(e.target.value)} 
                                type="email" 
                                name="email" 
                                placeholder="Seu E-mail"
                                autoComplete="username"
                            />
                        </label>

                        <label>
                            <InputMask 
                                mask="(99) 9 9999-9999" 
                                placeholder="Seu celular" 
                                onChange={(e)=>setPhone(e.target.value)} 
                                name="phone"  />
                        </label>

                        <label>
                            <input 
                                onChange={(e)=>setPass(e.target.value)} 
                                type="password" 
                                name="password" 
                                placeholder="Crie Sua Senha"
                                autoComplete="current-password"
                            />
                        </label>
                        <button type="submit">Cadastrar</button>
                    </form>
                    <div className="question" onClick={()=>redirect()}> 
                        Já tem uma conta?
                    </div>
                    <h2 className="message">{message}</h2>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
