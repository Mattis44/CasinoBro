import { Icon } from "@iconify/react";
import { Box, Button, Grid, InputBase, lighten, Paper, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

export default function BetPanel({
    bet,
    onBet,
    onHit,
    onStand,
    onSplit,
    onDouble,
    onBetAmountChange,
    playerCards,
    dealerCards,
    gameState,
}) {
    const gameStarted = playerCards.length > 0 && dealerCards.length > 0;
    return (
        <Box sx={{
            width: 350,
            height: '100%',
            backgroundColor: (theme) => theme.palette.background.paper,
        }}>
            <Box>
                <BettingInput
                    onChange={(value) => {
                        if (onBetAmountChange) {
                            onBetAmountChange(value);
                        }
                    }}
                    bet={bet}
                />

                <Grid container spacing={1} sx={{ padding: 2 }}>
                    <Grid item xs={6}>
                        <ButtonBet
                            value="Hit"
                            onClick={() => {
                                if (onHit) {
                                    onHit();
                                }
                            }}
                            icon={{ name: "fluent:slide-add-28-filled", color: "#B7B1F2" }}
                            disabled={!gameStarted}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ButtonBet
                            value="Stand"
                            onClick={() => { }}
                            icon={{ name: "mingcute:hand-fill", color: "#FBF3B9" }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ButtonBet
                            value="Split"
                            onClick={() => { }}
                            icon={{ name: "fluent:split-vertical-12-filled", color: "#F2B7B7" }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ButtonBet
                            value="Double"
                            onClick={() => { }}
                            icon={{ name: "healthicons:coins", color: "#B7F2B7" }}
                        />
                    </Grid>
                    <Button
                        variant="contained"
                        sx={{
                            width: '100%',
                            height: '6vh',
                            backgroundColor: "green",
                            "&:hover": {
                                backgroundColor: "#4CAF50"
                            },
                            color: (theme) => theme.palette.text.primary,
                            display: 'flex',
                            marginTop: 2,
                            ml: 1
                        }}
                        onClick={() => {
                            if (onBet) {
                                onBet();
                            }
                        }}
                    >
                        Bet
                    </Button>
                </Grid>
            </Box>
        </Box>
    )
}

const ButtonBet = ({ icon, value, onClick, disabled }) => (
    <Button
        variant="contained"
        onClick={onClick}
        sx={{
            width: '100%',
            height: '6vh',
            backgroundColor: (theme) => lighten(theme.palette.background.paper, 0.1),
            "&:hover": {
                backgroundColor: (theme) => lighten(theme.palette.background.paper, 0.2),
            },
            color: (theme) => theme.palette.text.primary,
            display: 'flex',
            gap: 1,
        }}
        disabled={disabled}
    >
        <Typography>
            {value}
        </Typography>
        <Icon icon={icon.name} width="1.2rem" height="1.2rem" color={icon.color} />
    </Button>
)

const BettingInput = ({
    bet = 1,
    onChange
}) => {
    const [value, setValue] = useState(bet);

    return (
        <Box sx={{ mt: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2 }}>
                <Typography variant="caption" sx={{ marginLeft: 2 }}>
                    Bet Amount
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Typography variant="caption">
                        125
                    </Typography>
                    <Icon icon="ph:coins" width="1.2rem" height="1.2rem" style={{ marginRight: 15 }} />
                </div>
            </div>
            <Paper component="form" sx={{ display: 'flex', alignItems: 'center', backgroundColor: (theme) => theme.palette.background.default, padding: 1, marginX: 2, marginTop: 1 }}>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    value={value}
                    onChange={(e) => {
                        const newValue = parseInt(e.target.value, 10);
                        if (!Number.isNaN(newValue)) {
                            setValue(newValue);
                            if (onChange) {
                                onChange(newValue);
                            }
                        } else {
                            setValue(0);
                        }
                    }}
                    endAdornment={<Icon icon="ph:coins" width="1.2rem" height="1.2rem" style={{ marginRight: 8 }} />}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Button
                        sx={{
                            backgroundColor: (theme) => theme.palette.background.paper,
                            "&:hover": {
                                backgroundColor: (theme) => lighten(theme.palette.background.paper, 0.2),
                            },
                            color: (theme) => theme.palette.text.primary,
                            width: '2rem',
                            height: '2rem',
                            fontSize: '0.7em',
                        }}
                        onClick={() => {
                            setValue(value / 2);
                            if (onChange) {
                                onChange(value / 2);
                            }
                        }}
                    >
                        1/2
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: (theme) => theme.palette.background.paper,
                            "&:hover": {
                                backgroundColor: (theme) => lighten(theme.palette.background.paper, 0.2),
                            },
                            color: (theme) => theme.palette.text.primary,
                            width: '2rem',
                            height: '2rem',
                            fontSize: '0.7em',
                        }}
                        onClick={() => {
                            setValue(value * 2);
                            if (onChange) {
                                onChange(value * 2);
                            }
                        }}
                    >
                        2X
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

BetPanel.propTypes = {
    bet: PropTypes.number.isRequired,
    onBet: PropTypes.func,
    onHit: PropTypes.func,
    onStand: PropTypes.func,
    onSplit: PropTypes.func,
    onDouble: PropTypes.func,
    onBetAmountChange: PropTypes.func,
    playerCards: PropTypes.arrayOf(PropTypes.shape({
        suit: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        hidden: PropTypes.bool,
    })).isRequired,
    dealerCards: PropTypes.arrayOf(PropTypes.shape({
        suit: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        hidden: PropTypes.bool,
    })).isRequired,
    gameState: PropTypes.string.isRequired,
};

ButtonBet.propTypes = {
    icon: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

BettingInput.propTypes = {
    bet: PropTypes.number,
    onChange: PropTypes.func,
};