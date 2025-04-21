import { Box } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import BetPanel from "src/components/casino/blackjack/BetPanel";
import BlackjackGameInit from "src/components/casino/blackjack/GameInit";
import Ribbon from "src/components/casino/blackjack/Ribbon";
import Card from "src/components/casino/Card";

const config = {
    minBetAmount: 1,
    maxBetAmount: 10000,
}

export default function Blackjack() {
    const [bet, setBet] = useState(1);

    const [playerCards, setPlayerCards] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);

    const [gameStarted, setGameStarted] = useState(false);
    const [dealingCard, setDealingCard] = useState(null); // { to: "player" | "dealer", index: number }

    const dealCard = (to, index) => {
        setDealingCard({ to, index });

        setTimeout(() => {
            if (to === "player") {
                setPlayerCards((prev) => [...prev, {}]);
            } else {
                setDealerCards((prev) => [...prev, {}]);
            }
            setDealingCard(null);
        }, 600);
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

        setPlayerCards([]);
        setDealerCards([]);
        setGameStarted(true);

        setTimeout(() => dealCard("dealer", 0), 0);
        setTimeout(() => dealCard("player", 0), 650);
        setTimeout(() => dealCard("dealer", 1), 1300);
        setTimeout(() => dealCard("player", 1), 1950);
    };

    const renderGame = () => {
        if (!gameStarted) {
            return <BlackjackGameInit />;
        }
        return (
            <>
                {dealingCard && (
                    <Card
                        returned
                        sx={{
                            position: "absolute",
                            top: 20,
                            left: 20,
                            zIndex: 99,
                            animation: `${dealingCard.to === "dealer"
                                ? `fly-to-dealer-${dealingCard.index}`
                                : `fly-to-player-${dealingCard.index}`
                                } 400ms ease-out forwards`
                        }}
                    />
                )}

                <Box sx={{
                    position: "absolute",
                    top: "10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "10px",
                }}>
                    {dealerCards.map((_, i) => (
                        <Card key={`dealer-${i}`} returned />
                    ))}
                </Box>

                <Box sx={{
                    position: "absolute",
                    bottom: "10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "10px",
                }}>
                    {playerCards.map((_, i) => (
                        <Card key={`player-${i}`} returned />
                    ))}
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