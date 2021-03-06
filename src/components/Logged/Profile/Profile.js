import React,{useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';

import Form from './Form';



import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';



import user_icon from './user_icon.png';


import api from '../../../services/api';

import Header from '../Header/Header';
import Footer from '../../Footer/Footer';


import './style.css';

export default function Profile()
{
    
    const history = useHistory();
    document.title = "Perfil";
    const [modalDisplay,setModalDisplay] = useState({'display': 'none'});
    const [userImg, setUserImg] = useState();
    const [previewImg,setPreviewImg] = useState();
    const [userData,setUserData] = useState([]);

    const [statusMessage, setStatusMessage] = useState("");

    const [disableButton, setDisableButton] = useState("");
   

    useEffect(()=>{
        const abortController = new AbortController();
        const signal = abortController.signal;
        try
        {
            api.get("/user",{
                headers:{
                    authorization:"Bearer "+sessionStorage.getItem("token")
                },
                signal:signal
            }).then((response)=>{
                if(typeof(response.data) !== "object" || response.status !== 200){
                    history.push("/");
                    sessionStorage.clear();
                }
                else
                {
                    setUserData(response.data);
                    api.get("/img",{
                        headers:{
                            Authorization: sessionStorage.getItem("token")
                        }
                    })
                    .then((response)=>{if(response.data.url)setUserImg(response.data.url)})
                    .catch(error=>console.error(error));
                    return function cleanup()
                    {
                        abortController.abort();
                    }
                }
            })
            .catch((error)=>{
                console.log(error);
                history.push("/");
                sessionStorage.clear();
            });
            return function cleanup()
            {
                abortController.abort();
            }
        }
        catch(error){console.error(error);}
        return function cleanup()
        {
            abortController.abort();
        }
        
    },[history]);

    useEffect(()=>{
        document.querySelector("div.profile-container").classList.add("profile-container","animating");
        
        const input = document.querySelector("div.profile-container").getElementsByTagName("input");
        for(let i=0;i<input.length;i++)
        {
            input[i].classList.add("animating");
        } 
        
    },[]); 
    

    async function handleAddImg(e)
    {
        e.preventDefault();
        setDisableButton("disabled");
        if(previewImg && previewImg.size<=2097152)
        {
            const formData = new FormData();
            formData.append("img",previewImg);
            
            await api.post("/img",formData, {
                headers: {
                    authorization: sessionStorage.getItem("token"),
                    "Content-Type": `multipart/form-data; boundary=${formData._boundary}`
                },
                onUploadProgress: (progressEvent)=>{
                    let progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    (progress < 100)?
                    setStatusMessage(`Progresso: ${progress}%`) : setStatusMessage("Aguarde...");
                }
            })
            .then((response)=>{
                api.get("/img",{
                    headers:{
                        Authorization: sessionStorage.getItem("token"),
                    }
                })
                .then((response)=>{
                    if(response.data.url)
                    {
                        setStatusMessage("Foto cadastrada!");
                        setTimeout(()=>setStatusMessage(""),2500);
                        setUserImg(response.data.url);
                        handleModal();
                    }
                })
                .catch((error)=>{
                    console.log(error);
                    setStatusMessage("Ops! Algo deu errado!")
                    setTimeout(()=>setStatusMessage(""),2000);
                    setDisableButton("");
                })
            })
            .catch(error=>{
                console.error(error);
                setStatusMessage("Ops! Algo deu errado!")
                setTimeout(()=>setStatusMessage(""),2000);
                setDisableButton("");
            });
        }
        else if(previewImg && previewImg.size>2097152)
        {
            setStatusMessage("A Imagem excedeu o tamanho máximo, que é de 2MB!");
            setTimeout(()=>setStatusMessage(""),3500);
            setDisableButton("");
        }
        else
        {
            setStatusMessage("Por favor escolha uma imagem na sua galeria!");
            setTimeout(()=>setStatusMessage(""),3500);
            setDisableButton("");
        }
    }
    
    
    function handleModal(e)
    {   
        if(e)
        {
            e.preventDefault();
        }
        if(modalDisplay.display === 'none')
        {
            setModalDisplay({'display':'flex'});
        }
        else
        {
            setModalDisplay({'display':'none'});
        }
    }

    function modalContainer()
    {
        if(previewImg)
        {
            let preview = new FileReader();
            preview.onload=function(e){
                document.querySelector("img[name=user_img]").src=e.target.result;
            }
            preview.readAsDataURL(previewImg);
        }
        if(previewImg===undefined)
        {
            return(
                <div className="modal-content" style={modalDisplay}>
                
                    <div className="form-modal">
                        
                        <div onClick={(e)=>handleModal(e)} id="close">x</div>
                        <Divider/>
                        <form onSubmit={(e)=>handleAddImg(e)} encType="multipart/form-data">
                            <input type="file" name="userImg" onChange={(e)=>setPreviewImg(e.target.files[0])} />
                            
                            <Divider/>
                            <button type="submit" disabled={disableButton}>Ok</button>
                            <button id="cancel" disabled={disableButton}  onClick={(e)=>handleModal(e)}>Cancelar</button>
                            <br/><h3 id="message_img">{statusMessage}</h3>
                        </form>
                    </div>
                </div>
            );
        }
        else
        {
            return(
                <div className="modal-content" style={modalDisplay}>    
                    <div className="form-modal">    
                        <div onClick={(e)=>handleModal(e)} id="close">x</div>
                        <Divider/>
                        <form onSubmit={(e)=>handleAddImg(e)} encType="multipart/form-data">
                            <input type="file" name="userImg" onChange={(e)=>setPreviewImg(e.target.files[0])} />
                            <img name="user_img" alt="user" id="user_img"/>
                            <Divider/>
                            <button type="submit" disabled={disableButton}>Ok</button>
                            <button id="cancel" disabled={disableButton}  onClick={(e)=>handleModal(e)}>Cancelar</button>
                            <br/><h3 id="message_img">{statusMessage}</h3>
                        </form>
                    </div>
                </div>
            );
        }
        
    }

    

    function containerImg()
    {
        if(userImg!==undefined)
        {
            return (
                <div className="todo_img">
                    <div  className="container-img">
                        <img 
                            src={userImg} 
                            id="user_icon" 
                            alt="userProfile"
                            title="Foto de perfil"
                        />
                    </div>
                    <CardContent className="user_name">
                        <Typography gutterBottom variant="h5" component="h2" >
                            Olá, {userData.name}
                        </Typography>
                    </CardContent>
                </div>
            );
        } 
        else
        {
            return (      
                <div className="todo_img">
                    <div className="container-img">
                        <CardMedia id="user_icon"                
                            title="Adicione uma imagem de perfil"
                            image={user_icon}
                            onClick={()=>handleModal()}
                        />
                    </div>
                    <CardContent className="user_name">
                        <Typography gutterBottom variant="h5" component="h2" >
                            Olá, {userData.name}
                        </Typography>
                    </CardContent>
                </div>
            );
        }
    }
   return(
    <div className="todo-profile">
        <Header/>
            {modalContainer()}
            <div className="profile-container" data-animation="top">
                {containerImg()}
                <Form/>
            </div>           
        <Footer/>
    </div>
    );
}