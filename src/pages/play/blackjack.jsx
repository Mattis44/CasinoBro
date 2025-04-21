import { Box } from "@mui/material";
import BetPanel from "src/components/casino/blackjack/BetPanel";
import Card from "src/components/casino/Card";

export default function Blackjack() {
    return (
        <Box sx={{
            height: '100%',
            border: (theme) => `solid 4px ${theme.palette.background.paper}`,
            display: 'flex',
            borderRadius: "8px",
        }}>
            <BetPanel />
            <Box sx={{
                padding: 3
            }}>

                <Card rank="A" suit="clubs" />
            </Box>
        </Box>
    );
}