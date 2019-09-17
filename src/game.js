const c = require('./connectmoji.js');
const readlineSync = require('readline-sync');
const clear = require('clear');

var board;
var players;
var human;
var num_consecutive;

if (process.argv[2] != undefined) {
    readlineSync.question('Press <ENTER> to start your game.');

    const args = process.argv[2].split(',');
    human = args[0];
    num_consecutive = args[4];
    var board = c.generateBoard(args[2], args[3]);
    var result = c.autoplay(board, args[1], args[4]);

    if (result.error != undefined) {
        console.log(`Autoplay error on move ${result.error.num} at column ${result.error.col}`)
        return;
    }

    clear();
    console.log(c.boardToString(result.board));

    if (result.winner != undefined) {
        console.log(`Winner is ${result.winner}`);
        return;
    }

    board = result.board;
    instructions = Array.from(args[1]);
    players = [instructions.shift(), instructions.shift()];
    if (players[0] == result.lastPieceMoved) {
        players.reverse();
    }
} else {
    var setup = readlineSync.question(`Enter the number of rows, columns, and consecutive "pieces" for win (all separated by commas... for example: 6,7,4)\n`).split(",");
    if (setup.length > 1) {
        board = c.generateBoard(setup[0], setup[1]);
        num_consecutive = setup[2];
    } else {
        board = c.generateBoard(6, 7);
        num_consecutive = 4;
    }
    console.log(`Using row, col and consecutive: ${board.rows} ${board.cols} ${num_consecutive}`);
    players = readlineSync.question("Enter two characters that represent the player and computer (separated by a comma... for example: P,C)\n").split(",");
    if (players.length != 2) {
        players = ["😎 ", "💻"];
    }
    human = players[0];
    console.log(`Using player and computer characters: ${players[0]} ${players[1]}`);
    var first = readlineSync.question("Who goes first, (P)layer or (C)omputer?\n");
    if (first == "C") {
        console.log("Computer is going first");
        players.reverse();
    } else {
        console.log("Player is going first");
    }

    readlineSync.question('Press <ENTER> to start your game.');
    clear();
    console.log(c.boardToString(board));
}

while (true) {
    var column;
    var loc = null;
    while (loc == null) {
        if (c.getAvailableColumns(board).length == 0) {
            console.log("No winner. So sad 😭");
            return;
        }
        if (players[0] == human) {
            column = readlineSync.question('Choose a column letter to drop your piece in.\n');
        } else {
            readlineSync.question('Press <ENTER> to see computer move');
            var columns = c.getAvailableColumns(board);
            column = columns[Math.floor(Math.random() * columns.length)];
        }
        loc = c.getEmptyRowCol(board, column);
        if (loc == null) {
            console.log("Oops, that is not a valid move, try again!");
        }
    }
    clear();
    console.log(`...dropping in column ${column}`);
    board = c.setCell(board, loc.row, loc.col, players[0]);
    console.log(c.boardToString(board));
    if (c.hasConsecutiveValues(board, loc.row, loc.col, num_consecutive)) {
        console.log(`Winner is ${players[0]}`);
        return; 
    }
    players.reverse();
}