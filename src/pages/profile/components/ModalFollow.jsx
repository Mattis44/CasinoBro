import { Box, CardContent, Dialog, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Api from "src/utils/api";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import ProfileAvatar from "./Avatar";

const cache = {};

const ModalFollow = ({ open, setOpen, user, type }) => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !type) return;

        const cacheKey = `${user.id_user}_${type}`;

        if (cache[cacheKey]) {
            setData(cache[cacheKey]);
        } else {
            Api.get(`/user/profile/${type === 1 ? "follower" : "following"}/${user.id_user}`)
                .then((response) => {
                    if (response.length === 0) return;
                    cache[cacheKey] = response;
                    setData(response);
                }).catch((error) => {
                    console.error(error);
                });
        }
    }, [type, user]);

    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1vw',
            }}>
                <Typography variant="h4" gutterBottom>
                    {type === 1 ? "Followers" : "Followings"} of {user.str_username}
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1vw',
                    marginTop: '1vw',
                }}>
                    {data.length === 0 ? (
                        <Typography>
                            This user has no {type === 1 ? "followers" : "following"}
                        </Typography>
                    ) : (
                        data.map((item) => (
                            <CardContent
                                key={item.id_user}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: '100%',
                                    cursor: "pointer",
                                    backgroundColor: (theme) => theme.palette.background.default,
                                    borderRadius: 1,
                                }}
                                onClick={() => {
                                    setOpen(false);
                                    navigate(`/app/profile/${item.id_user}`);
                                }}

                            >

                                <ProfileAvatar user={item} id={item.id_user} size="medium" />
                                <Box sx={{ display: "flex", flexDirection: "column", marginLeft: "1vw" }}>
                                    <Typography variant="h6">
                                        {item.str_username}
                                    </Typography>
                                    {!!item.bl_admin && (
                                        <Typography
                                            variant="subtitle2"
                                            color="error.main"
                                        >
                                            Admin
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        ))
                    )}
                </Box>
            </div>
        </Dialog>
    );
}

ModalFollow.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    user: PropTypes.object,
    type: PropTypes.number
};

export default ModalFollow;
