var users = [];

var deckCards   = [];
var throwedCards = [];

// Join user to room
export function userJoin(id, username, room) {
    const user = { id, username, room, throw: false };
    users.push(user);
    return user;
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
    console.log(users);
    return users;
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
    console.log(users[index]);
    return users[index];
}

// Set the deck cards
export function setDeckCards(cards){
    deckCards = cards;
    return deckCards;
}

// Throw a card
export function throwCard(room, card) {
    const throwed = {...card, room}
    throwedCards.push(throwed);
    return throwedCards.filter(card => card.room === room);
}



// User leaves chat
export function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    if(index != -1) {
        return users.splice(index, 1)[0];
    }
}
