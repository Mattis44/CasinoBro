import { Box, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import CoinflipBetPanel from "src/components/casino/coinflip/BetPanel";
import { domAnimation, LazyMotion, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Api from "src/utils/api";

export default function CoinFlip() {
    const [flipping, setFlipping] = useState(false);
    const [finalSide, setFinalSide] = useState("heads");
    const [rotation, setRotation] = useState(0);
    const theme = useTheme();

    const handleFlip = async (side) => {
        if (flipping) return;
        setFlipping(true);

        try {
            const result = await Api.post(`/coinflip/${side}`);
            const apiSide = result.side;

            const extraRotation = 3600;
            const targetRotation = apiSide === "heads" ? 0 : 180;
            const finalRotation = extraRotation + targetRotation;

            setRotation(0);

            setTimeout(() => {
                setFinalSide(apiSide);
                setRotation(finalRotation);
                setTimeout(() => {
                    setFlipping(false);
                }
                    , 2050);
            }, 2050);

        } catch (error) {
            console.error("Erreur API coinflip:", error);
            setFlipping(false);
        }
    };

    useEffect(() => {
        console.log(`Coinflip final side: ${finalSide}`);
    }, [finalSide]);

    return (
        <Box sx={{
            height: '100%',
            width: '100%',
            border: `solid 4px ${theme.palette.background.paper}`,
            display: 'flex',
            borderRadius: "8px",
        }}>
            <CoinflipBetPanel bet={1} onBet={handleFlip} />
            <Box sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
            }}>
                <LazyMotion features={domAnimation}>
                    <Box
                        sx={{
                            width: 300,
                            height: 300,
                            perspective: 1000,
                        }}
                    >
                        <motion.div
                            animate={{
                                rotateY: rotation,
                            }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut",
                            }}
                            style={{
                                width: 300,
                                height: 300,
                                position: 'relative',
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '50%',
                                    backgroundColor: theme.palette.primary.main,
                                    border: '8px solid white',
                                    backfaceVisibility: 'hidden',
                                }}
                            >
                                <Icon icon="teenyicons:up-solid" width={150} height={150} color="#B7F2B7" />
                            </motion.div>

                            <motion.div
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    transform: 'rotateY(180deg)',
                                    borderRadius: '50%',
                                    backgroundColor: theme.palette.primary.main,
                                    border: '8px solid white',
                                    backfaceVisibility: 'hidden',
                                }}
                            >
                                <Icon icon="teenyicons:down-solid" width={150} height={150} color="#B7B1F2" />
                            </motion.div>
                        </motion.div>
                        <Box sx={{
                            marginTop: 2,
                            textAlign: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: theme.palette.text.primary,
                        }}>
                            {flipping ? "Flipping..." : `You ${finalSide === "heads" ? "Win!" : "Lose!"}`}
                        </Box>
                    </Box>
                </LazyMotion>
            </Box>
        </Box>
    );
}
