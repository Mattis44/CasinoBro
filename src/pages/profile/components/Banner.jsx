import PropTypes from 'prop-types'
import { Badge, Box, darken, Dialog, IconButton, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import Api from 'src/utils/api';

const ProfileBanner = ({ user, editable, setBanner, size }) => {
    const [openEditBanner, setOpenEditBanner] = useState(false);
    const [userBanner, setUserBanner] = useState(null);

    useEffect(() => {
        if (!user) return;
        setUserBanner(user.banner);
    }, [user]);

    useEffect(() => {
        if (!setBanner) return;
        setBanner(userBanner);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userBanner]);

    return (
        <div>
            <DialogEditBanner open={openEditBanner} onClose={() => setOpenEditBanner(false)} setUserBanner={setUserBanner} user={user} />
            <Badge
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                    editable && (
                        <IconButton
                            onClick={() => setOpenEditBanner(true)}
                            sx={{
                                backgroundColor: 'background.paper',
                                "&:hover": {
                                    backgroundColor: 'background.paper',
                                }
                            }}
                        >
                            <Icon icon="tabler:edit" width={20} color='white' />
                        </IconButton>
                    )
                }
                invisible={!editable}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: "20vw",
                        height: "13vh",
                        borderRadius: '5px',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                        backgroundImage: `url(${userBanner?.str_url})`,
                        backgroundColor: (theme) => userBanner?.str_url ? 'transparent' : darken(theme.palette.background.paper, 0.25),
                        backdropAttachment: 'fixed',
                        backgroundClip: 'border-box',
                        backgroundOrigin: 'border-box',
                        backgroundBlendMode: 'overlay',
                    }}
                />
            </Badge>
        </div>

    )
}

const DialogEditBanner = ({
    open,
    onClose,
    setUserBanner
}) => {
    const [banners, setBanners] = useState([]);

    const handleChangeBanner = async (banner) => {
        setUserBanner(banner || null);
        onClose();
    };

    useEffect(() => {
        const getAvatars = async () => {
            try {
                const response = await Api.get('/user/profile/banners');
                setBanners(response);
            }
            catch (error) {
                console.error(error);
            }
        };
        getAvatars();
    }, []);
    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <Stack spacing={2} sx={{ p: 2 }}>
                <Typography variant="h6">Choose a new Banner</Typography>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: "25vw",
                            height: "13vh",
                            borderRadius: '5px',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (theme) => darken(theme.palette.background.paper, 0.25),
                            backdropAttachment: 'fixed',
                            backgroundClip: 'border-box',
                            backgroundOrigin: 'border-box',
                            backgroundBlendMode: 'overlay',
                            cursor: 'pointer',
                            "&:hover": {
                                border: (theme) => `solid 2px ${theme.palette.primary.main}`,
                            }
                        }}
                        onClick={() => {
                            handleChangeBanner(null);
                        }}
                    />
                    {banners.map((banner) => (
                        <Box
                            key={banner.id_banner}
                            sx={{
                                width: "25vw",
                                height: "13vh",
                                borderRadius: '5px',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center center',
                                backgroundRepeat: 'no-repeat',
                                backgroundImage: `url(${banner?.str_url})`,
                                backdropAttachment: 'fixed',
                                backgroundClip: 'border-box',
                                backgroundOrigin: 'border-box',
                                backgroundBlendMode: 'overlay',
                                cursor: 'pointer',
                                "&:hover": {
                                    border: (theme) => `solid 2px ${theme.palette.primary.main}`,
                                },
                            }}
                            onClick={() => {
                                handleChangeBanner(banner);
                            }}
                        />
                    ))}
                </Stack>
            </Stack>
        </Dialog>
    )
}

export default ProfileBanner

ProfileBanner.propTypes = {
    user: PropTypes.object.isRequired,
    editable: PropTypes.bool,
    size: PropTypes.string,
    setBanner: PropTypes.func,
}

DialogEditBanner.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    setUserBanner: PropTypes.func.isRequired,
}
