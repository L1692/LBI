const playerA = {state: "idle", score: 0};
const playerB = {state: "idle", score: 0};

const game = {players: [], connect: function(pl) {
    console.log("Connecting players...");
    this.players.push(pl);
}, disconnect: function(pl) {
    console.log("Disconnecting players...");
    this.players = this.players.splice(this.players.indexOf(pl), 1);
}};

console.log("Game initialized. Player A and Player B are ready to play.");

game.connect(playerA);
game.connect(playerB);

playerB.state = "active";

console.log("Player A state:", playerA.state);
console.log("Player B state:", playerB.state);

game.disconnect(playerA);

console.log("Player A state:", playerA.state);
console.log("Player B state:", playerB.state);