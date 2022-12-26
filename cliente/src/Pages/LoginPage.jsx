import React from 'react';
import io from 'socket.io-client';
import PlayScene from './PlaySceme';
import '../assets/css/modal.css';
import '../assets/css/uno-btn.css';
import Card from "../components/Card";

const socket = io('http://localhost:4000', {
    query: {"key": "askjdkad132*123"}
});
/* const socket = io('http://10.193.129.24:4000/', {
    query: {"key": "askjdkad132*123"}
});
 */

export const throwCard = (card) => {
    socket.emit("throwCard", card);
}

export const skiptTurn = () => {
    socket.emit("skiptTurn");
}

export const deckCard = () => {
    socket.emit('deckCard')
}



export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            username: 'david',
            room: '123',

            users: [],
            order: [],

            player1: false,
            player2: false,
            player3: false,
            player4: false,

            deck: [],
            throwed: [],

            decide: false,
            winner: false,
        }
    }
    resetRoom(){
        this.setState({
            playing: false,
            username: '',
            room: '',
            player1: false,
            player2: false,
            player3: false,
            player4: false,
            deck: [],
            throwed: [],
            decide: false,
            winner: false,

            users: []
        })
    }

    Decide = ({card}) => {
        return <div className='wrapper'>
            <div className='content'>
                <Card 
                    key={card.key + new Date() }
                    visible={true}
                    number={card.value}
                    color={card.color}
                />
                <div className="buttons">
                    <button onClick={()=>{
                        this.setState({decide: false})
                        skiptTurn()
                    }}>Conservar</button>
                    <button onClick={()=>{
                        this.setState({decide: false})
                        throwCard(card)
                    }}>Jugar</button>
                </div>
            </div>
        </div>
    }

    UsersList = ({users})=> {
        return <div>
            <h1>Usuarios</h1>
            { users.map(user => (
                <div key={user.id}>{user.username}</div>
            )) }
        </div>
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
        socket.on('decide', ({card})=> {
            this.setState({decide: card})
        })
        socket.on('cards', ({username, cards})=> {
            this.setState({player1: {username, cards}})
        });
        
        socket.on('winner', ({username}) => {
            console.log(username);
            this.setState({winner: username});
        })

        socket.on('error', (msg)=> {
            console.log(msg);
        });

        socket.on('order', ({order}) => {
            console.log(order);
            if(order.length >= 2) this.setState({player2: {username: order[1].username, cards: order[1].cards}})
            if(order.length >= 3) this.setState({player3: {username: order[2].username, cards: order[2].cards}})
            if(order.length >= 4) this.setState({player4: {username: order[3].username, cards: order[3].cards}})
        })
        
        socket.on('roomUsers', ({users})=>{
            //console.log(users)
            this.setState({users: users})
        });
    }
    render() {
        var { playing, users, decide, winner } = this.state;
        return <div>
            { winner ? <div className='wrapper'>
                <div className='content'>
                    <p>!{winner} ha sido el ganador!</p>
                    <button onClick={()=>this.resetRoom()}>Ir al menú</button>
                </div>
            </div> : ''}
            { decide ? <this.Decide card={decide}/> : ''}
            {
                playing ? <>
                    <PlayScene 
                        player1={this.state.player1}
                        player2={this.state.player2}
                        player3={this.state.player3}
                        player4={this.state.player4}
                        throwed={this.state.throwed}
                        deck={this.state.deck}
                    />
                </>
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
                <hr />
                <this.UsersList users={users} />
            </div> 
            }
            
            
        </div>
    }
}

