import  express from "express";
import morgan from "morgan";
import { Server as ScoketServer} from "socket.io";
import http from "http";
import cors from "cors";

import memory_cards from "./utils/cards.js";
import { 
    getRoomUsers, userJoin, userLeave, setUserCards, setDeckCards, throwCard, getCurrentUser, removeUserCard, setPlayersOrder
} 
from './utils/users.js';

const app = express();
// SOCKET
const server = http.createServer(app);
const io = new ScoketServer(server, {
    cors: { origin: '*' }
});

const PORT = 4000

app.use(cors());
app.use(morgan("dev"));

const keyDefined = "askjdkad132*123"

io.use((socket, next)=>{
    var keyFronend = socket.handshake.query.key;
    if(keyFronend !== keyDefined) {
        console.log('Error: invalid connection');
        next(new Error('Invalid'));
    }
    else next();
})

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room })=> {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        // Welcome current user
        socket.emit('message', {username: 'Sistem', text: 'Welcome to UNO'})
        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit('message', {username: 'Sistem',text:`${user.username} joined chat the chat`})
        
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
    // Starts the game
    socket.on('startGame', ({username, room})=> {
        const user = getCurrentUser(socket.id);
        const users = getRoomUsers(user.room);

        const n_cards = 7;
        const chunk = users.length * n_cards;

        const cards = memory_cards;

        var sort_cards = cards.sort(() => {return Math.random() - 0.5});
        let cardsOfUsers = sort_cards.slice(0, chunk);

        let deckCards = sort_cards.slice(chunk, cards.length);

        // Send first card to users
        io.to(user.room).emit('throwedCards', {
            room: user.room,
            cards: throwCard(user.room, deckCards.filter(card => card.type === 'number')[0])
        });
        // Send deck cards to users
        io.to(user.room).emit('deckCards', {
            room: user.room,
            cards: setDeckCards(deckCards)
        })

        // Set users cards
        let u = 0;
        for (let i = 0; i < cardsOfUsers.length; i += n_cards) {
            let piece = cardsOfUsers.slice(i, i + n_cards);
            let player = setUserCards(users[u].id, piece); 
            // Send player cards
            io.to(player.id).emit('cards', {
                username: player.username,
                cards: player.cards
            });
            u++;
        }

        // Set order of the game
        setPlayersOrder()
    });

    socket.on('throwCard', (card) => {
        const user = getCurrentUser(socket.id);
        // Send throwed cards
        io.to(user.room).emit('throwedCards', {
            room: user.room,
            cards: throwCard(user.room, card)
        });
        var player = removeUserCard(socket.id, card.key);
        // Send player cards
        io.to(player.id).emit('cards', {
            username: player.username,
            cards: player.cards
        });
        // Send player turn
    })

    // Runs when client disconnects
    socket.on('disconnect', ()=> {
        const user = userLeave(socket.id);
        console.log('Disconnect', socket.id)
    })
})


server.listen(PORT);

console.log('Server on port '+PORT);