import Card from "../components/Card";
import '../assets/css/play-scene.css';

import { Component, useState, useEffect } from "react";

import { throwCard } from "./LoginPage";

function Player1 (props) {
    var { username, cards } = props;

    return <div className="bottom">
        <div className="player">
            <div className="photo"></div>
            <div className="name">{username}</div>
        </div>
        <div className="cards">
            {
                cards.map(card => (
                    <Card 
                        clickEvent={()=>throwCard(card)}
                        key={card.key}
                        visible={true}
                        angulo={card.angulo}
                        style={card.style}
                        number={card.value}
                        color={card.color}
                    />
                ))
            }
        </div>
    </div>
}

function Throwed (props) {
    var { cards } = props;
    return <div className="center">
        <div className="table">
            {
                cards.map(card => (
                    <Card 
                        key = {card.key}
                        visible={true}
                        angulo={card.angulo}
                        style={card.style}
                        number={card.value}
                        color={card.color}
                    />
                ))
            }
        </div>
    </div>
}

export default class PlaySceme extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            username: '',
            room: '',
            // CARDS
            cards1: [],
            cards2: [],
            cards3: [],
            cards4: [],
            
            deck: [],
            throwed: [],
        }
    }

    random = (min, max)=>{ 
        return Math.floor((Math.random() * (max - min + 1)) + min);
    }

    loadFirstUserCards({cards}){
        if(!cards) return;
        let left = 0;
        // SI 5 ES EL 100% CUANTO ES 1
        for (let i = 0; i < cards.length; i++) {
            let porcentajeCartas = (100 * i) / cards.length;
            let sumarAngulo = (16 * porcentajeCartas) / 100;
            let anguloFinal = (352 + sumarAngulo) - 360;

            cards[i] = {
                ...cards[i], 
                angulo: anguloFinal+'deg', 
                style: {left: left+'px'}
            };

            left = left + 45;
        }
        if(this.state.cards1.length !== cards.length) this.setState({cards1: cards});
    }


    loadDeckCards({cards}){
        
    }
    loadThrowedCards(cards){
        let t = 0;
        let bottom = 0;
        // SI 5 ES EL 100% CUANTO ES 1
        for (let i = 0; i < cards.length; i++) {
            bottom =  t * 1.5;
            let deg = this.random(1, 360);
            cards[i] = {
                ...cards[i],
                style: {
                    bottom: '-'+bottom+'px',
                    transform: `rotateZ(${deg}deg)`
                }
            }
            if(i >= (cards.length/2)) t--;
            else t++;
        }
        if(this.state.throwed.length != cards.length) {
            this.setState({throwed: cards});
        }
    }

    componentDidMount(){
        var { player1, player2, player3, player4, deck, throwed } = this.props;
        this.loadFirstUserCards(player1);
        this.loadDeckCards(deck);
        this.loadThrowedCards(throwed);
    }
    componentDidUpdate() {
        var { player1, player2, player3, player4, deck, throwed } = this.props;
        this.loadFirstUserCards(player1);
        this.loadDeckCards(deck);
        console.log(throwed)
        this.loadThrowedCards(throwed);
    }
    render(){
        var { player1, player2, player3, player4 } = this.props;
        var { cards1,  cards2,  cards3,  cards4, deck, throwed } = this.state;
        return (
            <div className="play-scene">
                { player1 ? <Player1 username = {player1.username} cards = {cards1}  /> : ''}
                { throwed ? <Throwed cards = {throwed} /> : '' }
                <div className="center">
                    <div className="table">
                        {
                            deck.map(card => (
                                <Card 
                                    visible={true}
                                    angulo={card.angulo}
                                    style={card.style}
                                    number={card.number}
                                    color={card.color}
                                />
                            ))
                        }
                    </div>
                </div>

            </div>
        )
    }
}