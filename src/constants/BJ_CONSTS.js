const BLACKJACK_CONSTANTS = {
    INSURANCE_EQUAL: 11,
    CONFIGS: {
        MIN_BET_AMOUNT: 1,
        MAX_BET_AMOUNT: 10000,
    },
    GAME_STATES: {
        WAITING: "waiting",
        IN_PROGRESS: "in_progress",
        WIN: "win",
        LOSE: "lose",
    },
    FUNCS: {
        CAN_HIT: (gameState, playerCards, dealerCards) => gameState === BLACKJACK_CONSTANTS.GAME_STATES.IN_PROGRESS && playerCards.length < 5 && dealerCards.length > 0,
        CAN_STAND: (gameState, playerCards, dealerCards) => gameState === BLACKJACK_CONSTANTS.GAME_STATES.IN_PROGRESS && playerCards.length > 0 && dealerCards.length > 0,
        CAN_DOUBLE: (gameState, playerCards, dealerCards) => gameState === BLACKJACK_CONSTANTS.GAME_STATES.IN_PROGRESS && playerCards.length === 2 && dealerCards.length > 0,
        CAN_SPLIT: (gameState, playerCards, dealerCards) => gameState === BLACKJACK_CONSTANTS.GAME_STATES.IN_PROGRESS && playerCards.length === 2 && dealerCards.length > 0 && playerCards[0].value === playerCards[1].value,
        IS_INSURANCE: (gameState, dealerCards, dealerHandValue) => {
            console.log("dealerCards", dealerCards, "dealerHandValue", dealerHandValue);

            return gameState === BLACKJACK_CONSTANTS.GAME_STATES.IN_PROGRESS && dealerCards.length === 2 && dealerHandValue === BLACKJACK_CONSTANTS.INSURANCE_EQUAL
        }
    }
}

export default BLACKJACK_CONSTANTS;