module.exports.generateBoard = function (rows, cols, fill = null) {
    var board = {
        data: new Array(rows*cols),
        rows: rows,
        cols: cols,
    }
    board.data.fill(fill);
    return board;
}

module.exports.rowColToIndex = function (board, row, col) {
    if (row < 0 || row >= board.rows || col < 0 || col >= board.cols) {
        return -1;
    }
    return board.cols * row + col;
}

module.exports.indexToRowCol = function (board, i) {
    return { row: Math.floor(i / board.cols), col: i % board.cols }
}

module.exports.setCell = function (board, row, col, value) {
    var new_board = {
        data: board.data.slice(),
        rows: board.rows,
        cols: board.cols,
    }
    new_board.data[module.exports.rowColToIndex(board, row, col)] = value;
    return new_board;
}

module.exports.setCells = function (board, ...moves) {
    new_board = board;
    for (move of moves) {
        new_board = module.exports.setCell(new_board, move.row, move.col, move.val);
    }
    return new_board;
}

const wcwidth = require('wcwidth');

module.exports.boardToString = function (board) {
    var max_width = 1;
    for (symbol of board.data) {
        max_width = Math.max(wcwidth(symbol), max_width);
    }
    var string = "";
    for (var i = 0; i < board.data.length; i++) {
        var entry = board.data[i];
        var character = entry === null ? " " : entry;
        string += "| " + character + (" ").repeat(max_width - wcwidth(character)) + " ";
        if (i % board.cols == board.cols - 1)
            string += "|\n";
    }
    string += "|";
    for (var i = 0; i < board.cols; i ++) {
        var suffix = "-+";
        if (i == board.cols - 1) {
            suffix = "-|"
        }
        string += "-".repeat(max_width + 1) + suffix;
    }
    string += "\n";
    for (var i = 0; i < board.cols; i ++) {
        string += "| " + String.fromCodePoint(65 + i) + (" ").repeat(max_width - 1) + " ";
    }
    string += "|";
    return string;
}

module.exports.letterToCol = function (letter) {
    if (letter.length != 1)
        return null;
    var col = letter.charCodeAt(0) - 65;
    if (col < 0 || col > 25)
        return null;
    return col;
}

module.exports.getEmptyRowCol = function (board, letter, empty = null) {
    var col = module.exports.letterToCol(letter);
    if (col === null || col + 1 > board.cols)
        return null;
    var i;
    for (i = 0; i < board.rows; i++) {
        if (board.data[module.exports.rowColToIndex(board, i, col)] != empty)
            break;
    }
    if ( i == 0 )
        return null
    else 
        return {row: i - 1, col: col};
}

module.exports.getAvailableColumns = function (board) {
    var cols = new Array(0);
    for (var i = 0; i < board.cols; i++) {
        var letter = String.fromCodePoint(65 + i);
        if (module.exports.getEmptyRowCol(board, letter) != null) {
            cols.push(letter);
        }
    }
    return cols;
}

module.exports.hasConsecutiveValues = function (board, row, col, n) {
    var dirs = [[[1, 0], [-1, 0]], [[0, 1], [0, -1]], [[1, 1], [-1, -1]], [[1, -1], [-1, 1]]];
    var value = board.data[module.exports.rowColToIndex(board, row, col)];
    for (dir of dirs) {
        var count = 1;
        for(ray of dir) {
            var loc = [row, col];
            while (board.data[module.exports.rowColToIndex(board, loc[0] + ray[0], loc[1] + ray[1])] == value) {
                loc[0] += ray[0];
                loc[1] += ray[1];
                count++;
            }
            if (count >= n)
                return true;
        }
    }
    return false;
}

module.exports.autoplay = function (board, s, numConsecutive) {
    instructions = Array.from(s);
    var p = [instructions.shift(), instructions.shift()]
    var winner = undefined;

    var move = instructions.shift();
    if (move != undefined) {
        loc = module.exports.getEmptyRowCol(board, move);
        if (loc == null) {
            return {board: null, pieces: p, lastPieceMoved: p[0], error: {num: 1, col: move, val: p[0]}}
        }
        board = module.exports.setCell(board, loc.row, loc.col, p[0]);
        if (module.exports.hasConsecutiveValues(board, loc.row, loc.col, numConsecutive)) {
            if (instructions.length > 0) {
                return {board: null, pieces: p, lastPieceMoved: p[1], error: {num: 2, col: move, val: p[1]}}
            } else {
                return {board: board, pieces: p, lastPieceMoved: p[0], winner: p[0]};
            }
        }
    }
    if (instructions.length > 0) {
        var s2 = p[1] + p[0] + instructions.join('');
        var return_value = module.exports.autoplay(board, s2, numConsecutive);
        return_value.pieces = p;
        if (return_value.error != undefined) {
            return_value.error.num++;
        }
        return return_value;
    }

    return {board: board, pieces: p, lastPieceMoved: p[0]};
}
