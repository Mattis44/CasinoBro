import { Box, Typography } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import BetPanel from "src/components/casino/blackjack/BetPanel";
import BlackjackGameInit from "src/components/casino/blackjack/GameInit";
import Ribbon from "src/components/casino/blackjack/Ribbon";
import Card from "src/components/casino/Card";
import useSound from "src/hooks/useSound";
import Api from "src/utils/api";

const config = {
    minBetAmount: 1,
    maxBetAmount: 10000,
}

export default function Blackjack() {
    const [bet, setBet] = useState(1);
    const [gameId, setGameId] = useState(null);

    const [playerCards, setPlayerCards] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);
    const [playerHandValue, setPlayerHandValue] = useState(0);
    const [dealerHandValue, setDealerHandValue] = useState(0);

    const [gameStarted, setGameStarted] = useState(false);
    const [dealingCard, setDealingCard] = useState(null); // { to: "player" | "dealer", index: number, card: { suit: "hearts" | "diamonds" | "clubs" | "spades", value: string } }
    const [isCardAnimating, setIsCardAnimating] = useState(false);
    const [gameState, setGameState] = useState("waiting"); // "in_progress" | "win" | "lose" | "waiting"

    const cardSound = useSound(`/fx/card1.wav`, 0.8);
    const winSound = useSound(`/fx/win.mp3`, 0.8);


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
        setGameState("waiting");
        setGameStarted(false);
        setPlayerCards([]);
        setDealerCards([]);
        setPlayerHandValue(0);
        setDealerHandValue(0);
        setGameId(null);
    };
    const onBet = () => {
        if (bet < config.minBetAmount) {
            toast.error(`Minimum bet amount is ${config.minBetAmount}`);
            return;
        }
        if (bet > config.maxBetAmount) {
            toast.error(`Maximum bet amount is ${config.maxBetAmount}`);
            return;
        }
        if (gameState === "in_progress") {
            toast.error("Game is already in progress. Please wait for the current game to finish.");
            return;
        }
        setGameState("in_progress");

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
            } = res;
            console.log(s);

            if (res.status !== 200) {
                toast.error("An error occurred while placing the bet.");
                console.error(res);
                return;
            }

            setGameStarted(true);
            setGameId(gId);
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
                setGameState("win");
                winSound();
            }
        }).catch((err) => {
            toast.error("An error occurred while placing the bet.");
            console.error(err);
        });
    };

    const onHit = () => {
        Api.post(`/blackjack/${gameId}`, {
            action: "hit"
        }).then((res) => {
            const { playerCards: pc, playerHandValue: phValue } = res.data;
            if (res.status !== 200) {
                toast.error("An error occurred while hitting.");
                console.error(res);
                return;
            }
            setPlayerHandValue(phValue);
            setTimeout(() => dealCard("player", pc[pc.length - 1], pc.length - 1), 0);
        }).catch((err) => {
            toast.error("An error occurred while hitting.");
            console.error(err);
        });
    }

    const renderGame = () => {
        if (!gameStarted) {
            return <BlackjackGameInit />;
        }
        return (
            <>
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
                            backgroundColor: (theme) => gameState === "win" ? "green" : theme.palette.background.paper,
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
                onBetAmountChange={(value) => setBet(value)}
                onBet={onBet}
                playerCards={playerCards}
                dealerCards={dealerCards}
                onHit={onHit}
                gameState={gameState}
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