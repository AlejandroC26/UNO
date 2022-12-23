import React from 'react';
import io from 'socket.io-client';
import PlayScene from './PlaySceme';

const socket = io('http://localhost:4000', {
    query: {"key": "askjdkad132*123"}
});


export const throwCard = (card) => {
    socket.emit("throwCard", card);
}

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            username: 'david',
            room: '123',

            player1: false,
            player2: false,
            player3: false,
            player4: false,

            deck: [],
            throwed: [],
        }
    }

    joinRoom = () => {
        var { username, room } = this.state;
        socket.emit('joinRoom', { username, room });
    }

    startGame = () => {
        var { username, room } = this.state;
        socket.emit('startGame', {username, room});
    }

    componentDidMount() {
        socket.on('message', (msg)=>{});
        socket.on('deckCards', ({cards})=> {
            this.setState({ playing: true });
            this.setState({ deck: cards});
        });
        socket.on('throwedCards', ({cards})=> {
            this.setState({ throwed: cards });
        });
        socket.on('cards', ({username, cards})=> {
            this.setState({player1: {username, cards}})
        });
        socket.on('error', (msg)=> {
            console.log(msg);
        })
        socket.on('roomUsers', (users)=>console.log(users));
    }
    render() {
        var { playing } = this.state;
        return <div>
            {/* FORMULARIO DE INGRESO */}
            {
                playing ? <PlayScene 
                    player1={this.state.player1}
                    player2={this.state.player2}
                    player3={this.state.player3}
                    player4={this.state.player4}
                    throwed={this.state.throwed}
                    deck={this.state.deck}
                />
            : 
            <div>
                <h1>Registro</h1>
                <div>
                    <p>Nombre de usuario</p>
                    <input type="text" value={this.state.username} onChange={(e)=>this.setState({username: e.target.value})} />
                </div>
                <div>
                    <p>Código de Sala</p>
                    <input type="text" value={this.state.room} onChange={(e)=>this.setState({room: e.target.value})} />
                </div>
                <button onClick={()=>this.joinRoom()}>Confirmar</button>
                <button onClick={()=>this.startGame()}>INICIAR JUEGO</button>
            </div> 
            }
            
            
        </div>
    }
}

