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

module.exports.boardToString = function (board) {
    for (var i = 0; i < board.data.length; i++) {
        var entry = board.data[i];
        var character = entry === null ? " " : entry;
        string += "| " + character + " ";
        if (i % board.cols)
            string += "|\n";
    }
    for (var i = 0; i < board.cols; i ++) {
        prefix = "+";
        suffix = "+";
        if (i == 0) {
            prefix = "|"
        }
        if (i == board.cols - 1) {
            suffix = "|"
        }
        string += prefix + "-" + suffix;
    }
    for (var i = 0; i < board.cols; i ++) {
        string += "| " + String.fromCodePoint(65 + i) + " ";
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
