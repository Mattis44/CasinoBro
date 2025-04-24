import { Box, Typography } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import BetPanel from "src/components/casino/blackjack/BetPanel";
import BlackjackGameInit from "src/components/casino/blackjack/GameInit";
import Ribbon from "src/components/casino/blackjack/Ribbon";
import Card from "src/components/casino/Card";
import useSound from "src/hooks/useSound";
import Api from "src/utils/api";

import BLACKJACK_CONSTANTS from "src/constants/BJ_CONSTS";

export default function Blackjack() {
    const [bet, setBet] = useState(1);
    const [gameInfos, setGameInfos] = useState({
        gameId: null,
        hash: null,
    });

    const [playerCards, setPlayerCards] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);
    const [playerHandValue, setPlayerHandValue] = useState(0);
    const [dealerHandValue, setDealerHandValue] = useState(0);

    const [gameStarted, setGameStarted] = useState(false);
    const [dealingCard, setDealingCard] = useState(null); // { to: "player" | "dealer", index: number, card: { suit: "hearts" | "diamonds" | "clubs" | "spades", value: string } }
    const [isCardAnimating, setIsCardAnimating] = useState(false);
    const [gameState, setGameState] = useState(BLACKJACK_CONSTANTS.GAME_STATES.WAITING);
    const [insuranceDeclined, setInsuranceDeclined] = useState(false);

    const cardSound = useSound(`/fx/card1.wav`, 0.8);
    const winSound = useSound(`/fx/win.mp3`, 0.8);
    const loseSound = useSound(`/fx/lose.mp3`, 0.8);


    const dealCard = (to, card, index) => {
        setDealingCard({ to, card, index });

        setIsCardAnimating(true);

        cardSound();
        setTimeout(() => {
            if (to === "player") {
                setPlayerCards((prev) => [...prev, card]);
            } else {
                setDealerCards((prev) => [...prev, card]);
            }
            setDealingCard(null);
            setIsCardAnimating(false);
        }, 600);
    };

    const resetGame = () => {
        setGameStarted(false);
        setPlayerCards([]);
        setDealerCards([]);
        setPlayerHandValue(0);
        setDealerHandValue(0);
        setGameInfos(null);
        setInsuranceDeclined(false);
    };
    const onBet = () => {
        if (bet < BLACKJACK_CONSTANTS.CONFIGS.MIN_BET_AMOUNT) {
            toast.error(`Minimum bet amount is ${BLACKJACK_CONSTANTS.CONFIGS.MIN_BET_AMOUNT}`);
            return;
        }
        if (bet > BLACKJACK_CONSTANTS.CONFIGS.MAX_BET_AMOUNT) {
            toast.error(`Maximum bet amount is ${BLACKJACK_CONSTANTS.CONFIGS.MAX_BET_AMOUNT}`);
            return;
        }
        if (gameState === BLACKJACK_CONSTANTS.GAME_STATES.IN_PROGRESS) {
            toast.error("Game is already in progress. Please wait for the current game to finish.");
            return;
        }
        setGameState(BLACKJACK_CONSTANTS.GAME_STATES.IN_PROGRESS);

        resetGame();
        Api.post(`/blackjack/bet`, {
            bet_amount: bet,
        }).then((res) => {
            const {
                gameId: gId,
                playerCards: pcInit,
                dealerCards: dcInit,
                playerHandValue: phValue,
                dealerHandValue: dhValue,
                gameStatus: s,
                hash,
            } = res;
            console.log(s);

            if (res.status !== 200) {
                toast.error("An error occurred while placing the bet.");
                console.error(res);
                return;
            }

            setGameStarted(true);
            setGameInfos({
                gameId: gId,
                hash,
            });
            // Store the game ID in local storage for later use
            window.localStorage.setItem("blackjack:gid", gId);


            if (!gId || !pcInit || !dcInit) {
                toast.error("An error occurred while starting the game.");
                return;
            }

            setTimeout(() => dealCard("dealer", dcInit[0], 0), 0);
            setTimeout(() => dealCard("player", pcInit[0], 0), 650);
            setTimeout(() => dealCard("dealer", dcInit[1], 1), 1300);
            setTimeout(() => dealCard("player", pcInit[1], 1), 1950);

            setPlayerHandValue(phValue);
            setDealerHandValue(dhValue);
            if (s === "blackjack") {
                toast.success("You won with a blackjack!");
                setGameState(BLACKJACK_CONSTANTS.GAME_STATES.WIN);
                winSound();
            }
        }).catch((err) => {
            toast.error("An error occurred while placing the bet.");
            console.error(err);
        });
    };

    const onHit = () => {
        if (gameState !== BLACKJACK_CONSTANTS.GAME_STATES.IN_PROGRESS) {
            toast.error("Game is not in progress. Please place a bet first.");
            return;
        }
        Api.post(`/blackjack`, {
            action: "hit"
        }).then((res) => {
            const { playerCards: pc, playerHandValue: phValue, gameStatus: s } = res;
            if (res.status !== 200) {
                toast.error("An error occurred while hitting.");
                console.error(res);
                return;
            }
            if (!pc) {
                toast.error("An error occurred while hitting.");
                return;
            }
            setPlayerHandValue(phValue);
            dealCard("player", pc[pc.length - 1], pc.length - 1);
            if (s === "bust") {
                toast.error("You busted!");
                setGameState(BLACKJACK_CONSTANTS.GAME_STATES.LOSE);
                loseSound();
            }
        }).catch((err) => {
            toast.error("An error occurred while hitting.");
            console.error(err);
        });
    }

    const onStand = () => {
        if (gameState !== BLACKJACK_CONSTANTS.GAME_STATES.IN_PROGRESS) {
            toast.error("Game is not in progress. Please place a bet first.");
            return;
        }
        Api.post(`/blackjack`, {
            action: "stand"
        }).then((res) => {
            const { dealerCards: dc, dealerHandValue: dhValue, gameStatus: s } = res;
            if (res.status !== 200) {
                toast.error("An error occurred while standing.");
                console.error(res);
                return;
            }
            if (!dc) {
                toast.error("An error occurred while standing.");
                return;
            }
            setDealerHandValue(dhValue);
            setTimeout(() => {
                const updatedDealerCards = [...dealerCards];
                updatedDealerCards[1].hidden = false;
                setDealerCards(updatedDealerCards);
            }, 1000);

            dc.slice(1).forEach((card, index) => {
                setTimeout(() => dealCard("dealer", card, index + 1), index * 650 + 1650);
            });
            switch (s) {
                case "win":
                    toast.success("You won!");
                    setGameState(BLACKJACK_CONSTANTS.GAME_STATES.WIN);
                    winSound();
                    break;
                case "lose":
                    toast.error("You lost!");
                    setGameState(BLACKJACK_CONSTANTS.GAME_STATES.LOSE);
                    loseSound();
                    break;
                case "push":
                    toast("It's a push!")
                    setGameState(BLACKJACK_CONSTANTS.GAME_STATES.WAITING);
                    setGameStarted(false);
                    break;
                case "dealer_bust":
                    toast.success("Dealer busted! You win!");
                    setGameState(BLACKJACK_CONSTANTS.GAME_STATES.WIN);
                    winSound();
                    break;
                default:
                    toast.error("An error occurred while standing.");
                    console.error(res);
                    break;
            }
        }).catch((err) => {
            toast.error("An error occurred while standing.");
            console.error(err);
        });
    }

    const renderGame = () => {
        if (!gameStarted) {
            return <BlackjackGameInit />;
        }
        return (
            <>
                {BLACKJACK_CONSTANTS.FUNCS.IS_INSURANCE(gameState, dealerCards, dealerHandValue) && !insuranceDeclined && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: (theme) => theme.palette.background.paper,
                            padding: 3,
                            borderRadius: "8px",
                            boxShadow: (theme) => `0px 4px 10px ${theme.palette.grey[800]}`,
                            zIndex: 100,
                        }}
                    >
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            Do you want to take insurance?
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                            <Box
                                onClick={() => {
                                    setInsuranceDeclined(true);
                                }}
                                sx={{
                                    padding: 1,
                                    backgroundColor: "green",
                                    color: "white",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                }}
                            >
                                Yes
                            </Box>
                            <Box
                                onClick={() => {
                                    setInsuranceDeclined(true);
                                }}
                                sx={{
                                    padding: 1,
                                    backgroundColor: "red",
                                    color: "white",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                }}
                            >
                                No
                            </Box>
                        </Box>
                    </Box>
                )}
                {dealingCard && isCardAnimating && (
                    <Card
                        returned={dealingCard?.card?.hidden}
                        sx={{
                            position: "absolute",
                            top: 20,
                            left: 20,
                            zIndex: 99,
                            animation: `fly-to-${dealingCard.to}-${dealingCard.index} 400ms ease-out forwards`,
                        }}
                        suit={dealingCard.card.suit}
                        value={dealingCard.card.value}
                    />
                )}
                <Box sx={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)" }}>
                    <Box
                        sx={{
                            display: "flex",
                            color: "white",
                            fontWeight: "bold",
                            marginBottom: "5px",
                            fontSize: "20px",
                            borderRadius: "16px",
                            backgroundColor: (theme) => theme.palette.background.paper,
                            justifyContent: "center",
                            alignItems: "center",
                            width: "40px",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                justifyContent: "center",
                            }}
                        >
                            {dealerHandValue}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                        {dealerCards.length === 0 ? (
                            <Card fakeCard returned />
                        ) : (
                            dealerCards.map((card, i) => (
                                <Card key={`dealer-${i}`} returned={card.hidden} suit={card.suit} value={card.value} />
                            ))
                        )}
                    </Box>
                </Box>

                <Box sx={{ position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)" }}>
                    <Box
                        sx={{
                            display: "flex",
                            color: "white",
                            fontWeight: "bold",
                            marginBottom: "5px",
                            fontSize: "20px",
                            borderRadius: "16px",
                            backgroundColor: (theme) => {
                                if (gameState === "win") {
                                    return "green";
                                } if (gameState === "lose") {
                                    return "red";
                                }
                                return theme.palette.background.paper;

                            },
                            justifyContent: "center",
                            alignItems: "center",
                            width: "40px",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                justifyContent: "center",
                            }}
                        >
                            {playerHandValue}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                        {playerCards.length === 0 ? (
                            <Card fakeCard returned />
                        ) : (
                            playerCards.map((card, i) => (
                                <Card key={`dealer-${i}`} returned={card.hidden} suit={card.suit} value={card.value} />
                            ))
                        )}
                    </Box>
                </Box>
            </>
        );
    }
    return (
        <Box sx={{
            height: '100%',
            width: '100%',
            border: (theme) => `solid 4px ${theme.palette.background.paper}`,
            display: 'flex',
            borderRadius: "8px",
        }}>
            <BetPanel
                bet={bet}
                onHit={onHit}
                onBet={onBet}
                onStand={onStand}
                onBetAmountChange={(value) => setBet(value)}
                playerCards={playerCards}
                dealerCards={dealerCards}
                gameState={gameState}
                infos={gameInfos}
            />
            <Box
                sx={{
                    padding: 3,
                    position: "relative",
                    flex: 1
                }}>
                <Box sx={{ position: "relative", height: "150px", width: "100px" }}>
                    <Card returned sx={{ position: "absolute", top: 0, left: 0 }} />
                    <Card returned sx={{ position: "absolute", top: "20px", left: "10px" }} />
                </Box>
                <Ribbon />
                {renderGame()}
            </Box>
        </Box>
    );
}