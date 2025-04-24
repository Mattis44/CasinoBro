import { Icon } from "@iconify/react";
import { alpha, Box, Button, Grid, InputBase, lighten, Paper, Tooltip, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import BLACKJACK_CONSTANTS from "src/constants/BJ_CONSTS";

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
    infos = {},
}) {

    return (
        <Box sx={{
            width: 350,
            height: '100%',
            backgroundColor: (theme) => theme.palette.background.paper,
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Box sx={{ width: '100%' }}>
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
                            disabled={!BLACKJACK_CONSTANTS.FUNCS.CAN_HIT(gameState, playerCards, dealerCards)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ButtonBet
                            value="Stand"
                            onClick={() => {
                                if (onStand) {
                                    onStand();
                                }
                            }}
                            disabled={!BLACKJACK_CONSTANTS.FUNCS.CAN_STAND(gameState, playerCards, dealerCards)}
                            icon={{ name: "mingcute:hand-fill", color: "#FBF3B9" }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ButtonBet
                            value="Split"
                            onClick={() => {
                                if (onSplit) {
                                    onSplit();
                                }
                            }}
                            disabled={!BLACKJACK_CONSTANTS.FUNCS.CAN_SPLIT(gameState, playerCards, dealerCards)}
                            icon={{ name: "fluent:split-vertical-12-filled", color: "#F2B7B7" }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ButtonBet
                            value="Double"
                            onClick={() => {
                                if (onDouble) {
                                    onDouble();
                                }
                            }}
                            disabled={!BLACKJACK_CONSTANTS.FUNCS.CAN_DOUBLE(gameState, playerCards, dealerCards)}
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
            {infos && infos.gameId && infos.hash && (
                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                    padding: 2,
                    border: "1px solid",
                    borderColor: (theme) => theme.palette.divider,
                    margin: 2,
                    alignItems: "center",
                    borderRadius: 2,
                    position: "relative",
                }}>
                    <Tooltip title="GID is the Game ID, a unique identifier for the game session. HASH is a cryptographic hash that ensures the integrity and the proof of equity of the game data.">
                        <Icon
                            icon="mdi:information-outline"
                            width="1rem"
                            height="1rem"
                            style={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                color: "gray",
                            }}
                        />
                    </Tooltip>
                    <Box sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                    }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Typography variant="caption" sx={{ color: (theme) => theme.palette.text.secondary }}>
                                GID
                            </Typography>
                            <Typography variant="caption" sx={{ color: (theme) => theme.palette.text.secondary, wordBreak: "break-word", textAlign: "center" }}>
                                {infos?.gameId}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                    }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{
                                display: "flex",
                                gap: 2,
                            }}>
                                <Typography variant="caption" sx={{ color: (theme) => theme.palette.text.secondary }}>
                                    HASH
                                </Typography>
                            </div>
                            <Typography variant="caption" sx={{ color: (theme) => theme.palette.text.secondary, wordBreak: "break-word", textAlign: "center" }}>
                                {infos?.hash}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )}
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
            backgroundColor: alpha(icon.color, 0.2),
            "&:hover": {
                backgroundColor: alpha(icon.color, 0.5),
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
    infos: PropTypes.shape({
        gameId: PropTypes.string.isRequired,
        hash: PropTypes.string.isRequired,
    }),
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