import { Box, Card, CardContent, Chip, Divider, Skeleton, Tooltip, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import Api from "src/utils/api";
import PropTypes from 'prop-types';
import ProfileHeader from "./components/Header";
import ModalFollow from "./components/ModalFollow";
import CardForum from "../forum/components/card";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalFollow, setModalFollow] = useState(null);
    const [forums, setForums] = useState([]);
    const [tab, setTab] = useState(0);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        setUser(null);
        setForums([]);
        Api.get(`/user/profile/${id ?? ""}`).then((response) => {
            setLoading(false);
            setUser(response);
        });
    }, [id]);

    useEffect(() => {
        if (!user || !user?.arr_forums || user?.arr_forums.length === 0) return;
        setForums(user.arr_forums?.list);
    }, [user]);

    if (loading) {
        return (
            <SkeletonProfile />
        )
    }
    return (
        <div style={{
            padding: "1vw"
        }}>
            {modalFollow && (
                <ModalFollow open={modalFollow !== null} setOpen={setModalFollow} user={user} type={modalFollow} />
            )}
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>
            <Divider sx={{ mb: 5 }} />
            <ProfileHeader user={user} setUser={setUser} id={id} setTab={setTab} tab={tab} />
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: '20px',
                gap: '1vw',
            }}>
                <div style={{
                    width: '40%',
                    alignSelf: "flex-start",
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1vw',
                }}>
                    <Card>
                        <CardContent sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: '1vw',
                            pl: "3vw",
                            pr: "3vw",
                        }}>
                            <Box style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                textAlign: 'center',
                                cursor: 'pointer'
                            }}
                                onClick={() => setModalFollow(1)}
                            >
                                <Typography
                                    variant="h6"
                                >
                                    {user?.int_followers}
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                >
                                    Followers
                                </Typography>
                            </Box>
                            <Box style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                textAlign: 'center',
                                cursor: 'pointer'
                            }}
                                onClick={() => setModalFollow(2)}
                            >
                                <Typography
                                    variant="h6"
                                >
                                    {user?.int_following}
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                >
                                    Following
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1vw',
                        }}>
                            <Typography variant="h6">
                                About
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    whiteSpace: 'pre-line'
                                }}
                            >
                                {user?.str_bio}
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
                <div style={{
                    width: '60%',
                    alignSelf: "flex-start",
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1vw',
                }} >
                    {tab === 0 ? (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Latest Forums
                            </Typography>
                            <Divider />
                            <RenderForums forums={forums} />
                        </>
                    ) : (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Wallet
                            </Typography>
                            <Divider />
                            <RenderWallet user={user} />
                        </>
                    )}
                </div>
                {/* <Card sx={{
                    width: '100%',
                    alignSelf: "flex-start",
                }}>
                    <CardForum 
                </Card> */}
            </div>
        </div >
    )
}

const SkeletonProfile = () => (
    <div style={{
        padding: "1vw"
    }}>
        <Typography variant="h4" gutterBottom>
            Profile
        </Typography>
        <Divider sx={{ mb: 5 }} />
        <Skeleton
            variant="rectangular"
            width="100%"
            height="20vh"
            sx={{
                marginTop: "5vh",
                borderRadius: "1vw"
            }} />
        <div style={{
            display: 'flex',
            gap: '1vw',
        }}>
            <Skeleton
                variant="rectangular"
                width="100%"
                height="10vh"
                sx={{
                    marginTop: "2vh",
                    borderRadius: "1vw"
                }} />
            <Skeleton
                variant="rectangular"
                width="100%"
                height="10vh"
                sx={{
                    marginTop: "2vh",
                    borderRadius: "1vw"
                }} />
        </div>
        <Skeleton
            variant="rectangular"
            width="100%"
            height="50vh"
            sx={{
                marginTop: "2vh",
                borderRadius: "1vw"
            }}
        />
    </div>
);

const RenderForums = ({ forums }) => {
    if (forums.length === 0) {
        return (
            <Card sx={{
                width: '100%',
                alignSelf: "flex-start",
            }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        This user has no forums yet
                    </Typography>
                </CardContent>
            </Card>
        )
    }
    return (
        forums.map((forum) => (
            <CardForum
                key={forum.id_forum}
                id={forum.id_forum}
                title={forum.str_title}
                content={forum.str_content}
                date={forum.date_creation}
                user={forum.user}
                category={forum.category}
                likes={forum.likes.count}
                comments={forum.reply.count}
                views={forum.views.count}
                formation={forum.bl_formation}
                starred={forum.bl_starred}
                profile
            />
        ))
    )
}

const RenderWallet = ({ user }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [privateWallet, setPrivateWallet] = useState(false);


    useEffect(() => {
        if (!user) return;
        if (!user.bl_wallet) {
            setPrivateWallet(true);
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            setLoading(true);
            const responseWallet = await Api.get(`/user/profile/wallet/${user.id_user}`);
            const withPrices = await Api.post("/user/action/price", {
                symbols: responseWallet.map((item) => item.str_symbol),
            });
            setData(responseWallet.map((item) => {
                const position = withPrices.symbols.find((pos) => pos.symbol === item.str_symbol);
                return {
                    ...item,
                    price: position?.price || 0,
                    changePercent: position?.changePercent || 0,
                };
            }).sort((a, b) => b.double_amount * b.price - a.double_amount * a.price));
            setLoading(false);
        };

        fetchData();
    }, [user]);

    if (privateWallet) {
        return (
            <Card sx={{
                width: '100%',
                alignSelf: "flex-start",
            }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        This user has a private wallet
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    if (loading) {
        return (
            <Skeleton
                variant="rectangular"
                width="100%"
                height="50vh"
                sx={{
                    marginTop: "2vh",
                    borderRadius: "1vw"
                }}
            />
        )
    }

    if (data.length === 0) {
        return (
            <Card sx={{
                width: '100%',
                alignSelf: "flex-start",
            }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        This user has no assets yet
                    </Typography>
                </CardContent>
            </Card>
        )
    }


    return (
        <Box sx={{
            width: '100%',
            alignSelf: "flex-start",
            display: 'flex',
            flexDirection: 'column',
            gap: '1vw',
        }}>
            {data
                .map((item) => (
                    <Card key={item.id_action} sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        gap: '1vw',
                    }}>
                        <CardContent sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '0.5vw',
                            }}>
                                <img
                                    src={item?.str_logo}
                                    alt="logo"
                                    width={50}
                                    height={50}
                                    style={{ borderRadius: '10%' }}
                                />

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: '0.5vw',
                                    }}>
                                        <Typography variant="h6">
                                            {item.str_name}
                                        </Typography>
                                        <Chip
                                            label={item.id_category === 1 ? "Stock" : "Crypto"}
                                            color={item.id_category === 1 ? "primary" : "secondary"}
                                            variant="soft"
                                        />
                                    </div>
                                    <Typography variant="caption" sx={{
                                        color: "text.secondary"
                                    }}>
                                        {item.str_symbol}
                                    </Typography>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5vw',
                                textAlign: 'right',
                            }}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "0.5vw",
                                    justifyContent: "flex-end",
                                }}>
                                    <Tooltip title="Amount" placement="top" arrow>
                                        <Typography variant="">
                                            {item.double_amount.toFixed(2)}
                                        </Typography>
                                    </Tooltip>
                                    <Tooltip title="Avg. Buy" placement="top" arrow>
                                        <Typography variant="caption" sx={{
                                            color: "text.secondary"
                                        }}>
                                            / {Number(item.double_pru || 0).toFixed(2)}$
                                        </Typography>
                                    </Tooltip>
                                </div>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "0.5vw",
                                }}>
                                    <Tooltip title="Position" placement="top" arrow>
                                        <Typography variant="caption">
                                            {Number(item.double_amount * item.price)?.toFixed(2)}$
                                        </Typography>
                                    </Tooltip>
                                    <Tooltip title="Profit (24h)" placement="top" arrow>
                                        <Typography variant="caption" sx={{
                                            color: item.changePercent > 0 ? 'success.main' : 'error.main',
                                        }}>
                                            {Number(item.changePercent).toFixed(2)}%
                                        </Typography>
                                    </Tooltip>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            }
        </Box >
    )
}

RenderForums.propTypes = {
    forums: PropTypes.array.isRequired
}

RenderWallet.propTypes = {
    user: PropTypes.object.isRequired
}

export default Profile;