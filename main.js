// OBJECTIVES:
// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if user has won
// 6. Give the user winnings if user wins
// 7. Play again

//----------LIBRARIES----------//
//prompt-sync function gets user input
const prompt = require("prompt-sync")();

//-------GLOBAL VARIABLES-------//
const ROWS = 3;
const COLS = 3;

const SYMBOL_COUNT = {
    "Circle": 2,
    "Square": 4,
    "Triangle": 6,
    "Heart": 8
}

//Multiplier Value
const SYMBOL_VALUES = {
    "Circle": 5,
    "Square": 4,
    "Triangle": 3,
    "Heart": 2
}

//-----CLASSES AND FUNCTIONS-----//
//1ST OBJECTIVE
const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter an amount to deposit: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid Amount: Please try again.");
        } else {
            return numberDepositAmount;
        }
    }
}

//2ND OBJECTIVE
const getNumberOflines = () => {
    while (true) {
        const lines  = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines: Please try again.");
        } else {
            return numberOfLines;
        }
    }
}

//3RD OBJECTIVE
const getBet = (balance, lines) => {
    while (true) {
        const bet  = prompt("Enter the bet per line: ");
        const betAmount = parseFloat(bet);

        if (isNaN(betAmount) || betAmount <= 0) {
            console.log("Invalid Amount: Please try again.");
        } if (betAmount > (balance / lines)) {
            console.log("Invalid Amount: Your bet is greater than your balance. Please try again.");
        } else {
            return betAmount;
        }
    }
}

//4TH OBJECTIVE
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};

//5TH OBJECTIVE
//Changing the position of the array from a horizontal to a vertical like manner.
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i])
        }
    }
    return rows;
};
//Checking if the same 3 symbols are line up.
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol
            if (i != row.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString);
    }
};

//6TH OBJECTIVE
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]]
        }
    }
    return winnings;
};

const game = () => {
    let balance = deposit();

    while (true) {
        console.log("Current Balance: $" + balance);
        // The 'let' variable type can be added, subtracted, etc.
        // while the 'const' variable type cannot be changed or altered.
        const numberOfLines = getNumberOflines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won, $" + winnings.toString() + "!");

        if (balance <= 0) {
            console.log("You ran out of money!");
            break;
        }

        const playAgain = prompt("Do you want to play again? (y/n): ");
        if (playAgain != "y") break;
    }
};
game();