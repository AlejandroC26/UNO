var users = [];

var deckCards   = [];
var throwedCards = [];

// Join user to room
export function userJoin(id, username, room) {
    const user = { id, username, room, throw: false };
    users.push(user);
    return user;
}
// Find players
export function findUserById(id){
    return users.find(user => user.id === id);;
}

export function findUserByName(name, room) {
    return users.find(user => (user.username === name && user.room === room));;
}


// Get current user
export function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// Get room users
export function getRoomUsers(room) {
    return users.filter(user => user.room === room)
}

// Set players order
export function setPlayersOrder(){
    users = users.sort(() => {return Math.random() - 0.5});
    users[0].throw = true;
    return users;
}

// Get players order
export function getPlayersOrder(id){
    const index = users.findIndex(user => user.id === id);
    var order1 = users.slice(0, index);
    var order2 = users.slice(index, users.length);
    return order2.concat(order1);
}

// Set user cards
export function setUserCards(id, cards) {
    const index = users.findIndex(user => user.id === id);
    users[index] = {...users[index], cards};
    return users[index];
}

// Remove a user card
export function removeUserCard(id, key) {
    const index = users.findIndex(user => user.id === id);
    let cards = users[index].cards.filter(card => card.key !== key);
    
    users[index] = {...users[index], throw: false, cards};
    
    if(users[index+1]) users[index+1].throw = true;
    else users[0].throw = true;

    return users[index];
}

// Set the deck cards
export function setDeckCards(room, cards){
    for (let i = 0; i < cards.length; i++) { cards[i].room = room }
    deckCards = cards;
    return deckCards;
}


export function nextTurn(id){
    const index = users.findIndex(user => user.id === id);
    
    users[index].throw = false;

    if(users[index+1]) users[index+1].throw = true;
    else users[0].throw = true;
    return users[index];
}

// Throw a card
export function throwCard(room, card) {
    delete card.angulo;
    delete card.style;
    const throwed = {...card, room}
    deckCards.push(throwed);
    throwedCards.push(throwed);
    return throwedCards.filter(card => card.room === room);
}
// Get a card of the deck
export function getDeckCard(id, room) {
    const index = users.findIndex(user => user.id === id);
    let deckCard = deckCards.filter(card => card.room === room)[0];
    // Set new deck cards
    deckCards = deckCards.filter(card => !(card.key === deckCard.key && card.room === room));
    // Add the new card to user
    users[index].cards.push(deckCard);
    return deckCard;
}

// Get throwed cards
export function getThrowedCards(room){
    return throwedCards.filter(card => card.room === room)
}

// User leaves chat
export function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    if(index != -1) {
        return users.splice(index, 1)[0];
    }
}

export function finishedGame(room){
    users = users.filter(user => user.room !== room);
    deckCards = deckCards.filter(card => card.room !== room);
    throwedCards = throwedCards.filter(card => card.room !== room);
    return {users, deckCards, throwedCards}
}
