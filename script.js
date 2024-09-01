document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById('game-board');
    const squares = [];
    const rows = 8;
    const cols = 8;
    let selectedPiece = null;
    let currentPlayer = 'red'; // 'red' starts the game
    let gameInProgress = true;

    function createBoard() {
        for (let row = 0; row < rows; row++) {
            squares[row] = [];
            for (let col = 0; col < cols; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
                square.dataset.row = row;
                square.dataset.col = col;
                square.addEventListener('click', () => handleSquareClick(square, row, col));
                board.appendChild(square);
                squares[row][col] = square;

                // Add pieces to the board
                if (row < 3 && (row + col) % 2 !== 0) {
                    const piece = createPiece('black');
                    square.appendChild(piece);
                } else if (row > 4 && (row + col) % 2 !== 0) {
                    const piece = createPiece('red');
                    square.appendChild(piece);
                }
            }
        }
    }

    function createPiece(color) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.classList.add(color);
        piece.dataset.color = color;
        piece.addEventListener('click', (e) => handlePieceClick(e, piece));
        return piece;
    }

    function handlePieceClick(event, piece) {
        event.stopPropagation(); // Prevent the square click event
        if (piece.dataset.color !== currentPlayer) return; // Not this player's turn

        if (selectedPiece) {
            selectedPiece.classList.remove('selected');
        }

        selectedPiece = piece;
        piece.classList.add('selected');
    }

    function handleSquareClick(square, row, col) {
        if (!selectedPiece || !gameInProgress) return;

        const startRow = parseInt(selectedPiece.parentElement.dataset.row);
        const startCol = parseInt(selectedPiece.parentElement.dataset.col);
        const targetRow = parseInt(square.dataset.row);
        const targetCol = parseInt(square.dataset.col);

        if (isValidMove(startRow, startCol, targetRow, targetCol, selectedPiece)) {
            movePiece(selectedPiece, square);
            if (checkForWin()) {
                gameInProgress = false;
                alert(`${currentPlayer} wins!`);
            } else {
                switchPlayer();
            }
        }
    }

    function isValidMove(startRow, startCol, targetRow, targetCol, piece) {
        const rowDiff = targetRow - startRow;
        const colDiff = Math.abs(targetCol - startCol);
        const direction = piece.dataset.color === 'red' ? -1 : 1;

        if (squares[targetRow][targetCol].children.length > 0) {
            return false; // Can't move to a square that already has a piece
        }

        // Simple move forward by one square
        if (rowDiff === direction && colDiff === 1) {
            return true;
        }

        // Capture move: must jump over an opponent piece
        if (rowDiff === 2 * direction && colDiff === 2) {
            const midRow = startRow + direction;
            const midCol = (startCol + targetCol) / 2;
            const midSquare = squares[midRow][midCol];
            if (midSquare.children.length > 0 && midSquare.children[0].dataset.color !== piece.dataset.color) {
                // Remove the opponent piece
                midSquare.removeChild(midSquare.children[0]);
                return true;
            }
        }

        return false;
    }

    function movePiece(piece, targetSquare) {
        const currentSquare = piece.parentElement;
        currentSquare.removeChild(piece);
        targetSquare.appendChild(piece);
        piece.classList.remove('selected');

        // Check if piece should be kinged
        const row = parseInt(targetSquare.dataset.row);
        if ((piece.dataset.color === 'red' && row === 0) || (piece.dataset.color === 'black' && row === rows - 1)) {
            piece.classList.add('king');
        }

        selectedPiece = null;
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
    }

    function checkForWin() {
        const pieces = Array.from(document.getElementsByClassName('piece'));
        const redPieces = pieces.filter(piece => piece.dataset.color === 'red');
        const blackPieces = pieces.filter(piece => piece.dataset.color === 'black');
        return redPieces.length === 0 || blackPieces.length === 0;
    }

    createBoard();
});