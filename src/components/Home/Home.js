import React, {useEffect} from 'react';
import {Carousel} from 'react-responsive-carousel';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './style.css';
const img1 = require("../assets/images/img1.jpg");
const img2 = require("../assets/images/img2.jpg");
const img3 = require("../assets/images/img3.jpg");


export default function Home()
{
    useEffect(()=>{
        document.querySelector("div.presentation").classList.add("presentation","animating");
        document.querySelector("div.title").classList.add("title","animating");
        document.querySelector("div.subtitle").classList.add("subtitle","animating");
    },[]);
    document.title = "Home";
    return(
        <div className="todo-home">
            <Header/>
            <div className="home-container" >
                <div className="presentation" data-animation="top">
                    <div className="title" data-animation="left">
                        Quando gerenciar seus 
                        gastos for um problema, 
                        conte conosco.
                    </div>
                    <div className="subtitle" data-animation="left"> 
                        Estamos  aqui para te ajudar a ter um controle 
                        maior sobre os seus gastos do dia a dia, sem
                        ter surpresas ao final do mês.
                    </div>
                </div>
                <Carousel>
                    <div>
                        <img src={img1} alt="1° imagem" />
                        <div className="legend">
                            <h3>Cuidando das finanças</h3>
                            Administre suas rendas e seus gastos de forma organizada e segura.
                        </div>
                    </div>
                    <div>
                        <img src={img2} alt="2° imagem" />
                        <div className="legend">
                            <h3>Evite gastos</h3>
                            Crie metas de gastos durante o seu mês para poupar mais.
                        </div>
                    </div>
                    <div>
                        <img src={img3} alt="3° imagem" />
                        <div className="legend">
                            <h3>Veja seu progresso</h3>
                            Veja todo o seu histórico  desde quando começou.
                        </div>
                    </div>
                </Carousel>
            </div>
            <Footer/>
        </div>
    );
    
}