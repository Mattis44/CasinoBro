import PropTypes from 'prop-types'
import { Avatar, Badge, Box, Dialog, IconButton, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import Api from 'src/utils/api';
import { useNavigate } from 'react-router';

const ProfileAvatar = ({ user, editable, setAvatar, size, showUsername, linkTo }) => {

    const getAvatarWidth = (s) => {
        switch (s) {
            case 'small':
                return 40;
            case 'medium':
                return 64;
            default:
                return 128;
        }
    };
    const getAvatarHeight = (s) => {
        switch (s) {
            case 'small':
                return 40;
            case 'medium':
                return 64;
            default:
                return 128;
        }
    };
    // const [discordUser, setDiscordUser] = useState(null);
    const [openEditAvatar, setOpenEditAvatar] = useState(false);
    const [userAvatar, setUserAvatar] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        setUserAvatar(user.avatar);
    }, [user]);

    useEffect(() => {
        if (!setAvatar) return;
        setAvatar(userAvatar);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userAvatar]);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     const getDiscordProfile = async () => {
    //         try {
    //             const response = await fetch('https://discord.com/api/users/@me', {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem('discord_access_token')}`,
    //                 },
    //             });
    //             const data = await response.json();
    //             setDiscordUser(data);
    //         } catch (error) {
    //             navigate('/auth/login');
    //         }
    //     };

    //     if (localStorage.getItem('connection_type') === 'discord') {
    //         getDiscordProfile();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    // const gifAvatarUrl = discordUser?.avatar
    //     ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.gif`
    //     : null;

    // const pngAvatarUrl = discordUser?.avatar
    //     ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
    //     : null;

    const avatarUrl = userAvatar?.str_url || null;


    return (
        <Box style={{
            display: 'flex',
            flexDirection: 'fow',
            cursor: linkTo ? 'pointer' : 'default',
        }}
            onClick={() => {
                if (linkTo) {
                    navigate(`/app/profile/${user.id_user}`);
                }
            }}
        >
            <DialogEditAvatar open={openEditAvatar} onClose={() => setOpenEditAvatar(false)} setUserAvatar={setUserAvatar} user={user} />
            <Badge
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                overlap='circular'
                badgeContent={
                    editable && (
                        <IconButton
                            onClick={() => setOpenEditAvatar(true)}
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
                <Avatar
                    alt={user?.str_username.charAt(0).toUpperCase()}
                    src={avatarUrl}
                    sx={{
                        width: getAvatarWidth(size),
                        height: getAvatarHeight(size),
                        border: (theme) => `solid 2px ${theme.palette.background.default}`,
                        backgroundColor: 'background.paper',
                    }}
                >
                    {userAvatar ? (
                        <img
                            src={avatarUrl}
                            alt={user?.str_username}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <Typography variant={size === "small" ? 'h4' : 'h2'}>
                            {user?.str_username?.charAt(0).toUpperCase()}
                        </Typography>
                    )}
                </Avatar>
            </Badge>
            {showUsername && (
                <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 1 }}>
                    {user?.str_username}
                </Typography>
            )}
        </Box>

    )
}

const DialogEditAvatar = ({
    open,
    onClose,
    setUserAvatar,
    user
}) => {
    const [avatars, setAvatars] = useState([]);

    const handleChangeAvatar = async (avatar) => {
        setUserAvatar(avatar || null);
        onClose();
    };

    useEffect(() => {
        const getAvatars = async () => {
            try {
                const response = await Api.get('/user/profile/avatars');
                setAvatars(response);
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
                <Typography variant="h6">Choose a new Avatar</Typography>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}
                >
                    <Avatar
                        alt={user?.str_username}
                        sx={{
                            width: 64,
                            height: 64,
                            cursor: 'pointer',
                            "&:hover": {
                                border: (theme) => `solid 2px ${theme.palette.primary.main}`,
                            },
                        }}
                        onClick={() => {
                            handleChangeAvatar(null);
                        }}
                    >
                        <Typography variant="h3">
                            {user?.str_username?.charAt(0).toUpperCase()}
                        </Typography>
                    </Avatar>

                    {/* Options pour les avatars personnalisés */}
                    {avatars.map((avatar) => (
                        <Avatar
                            key={avatar.id_avatar}
                            src={avatar.str_url}
                            sx={{
                                width: 64,
                                height: 64,
                                cursor: 'pointer',
                                "&:hover": {
                                    border: (theme) => `solid 2px ${theme.palette.primary.main}`,
                                },
                                backgroundColor: 'background.paper',
                            }}
                            onClick={() => {
                                handleChangeAvatar(avatar);
                            }}
                        />
                    ))}
                </Stack>
            </Stack>
        </Dialog>
    )
}

export default ProfileAvatar

ProfileAvatar.propTypes = {
    user: PropTypes.object,
    editable: PropTypes.bool,
    size: PropTypes.string,
    setAvatar: PropTypes.func,
    showUsername: PropTypes.bool,
    linkTo: PropTypes.bool,
}

DialogEditAvatar.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    setUserAvatar: PropTypes.func,
    user: PropTypes.object.isRequired,
}
