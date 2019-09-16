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