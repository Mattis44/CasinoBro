import { alpha, Box, Button, Card, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import Api from 'src/utils/api';
import ProfileAvatar from './Avatar';
import ModalEditProfile from './ModalEditProfile';

export default function ProfileHeader({
    user,
    id,
    setUser,
    setTab,
    tab
}) {
    const [openEditModal, setOpenEditModal] = useState(false);
    const { updateUser, user: selfUser } = useMockedUser();

    const handleFollow = async () => {
        try {
            const request = await Api.post(`/user/profile/follow`, {
                id_following: id
            })
            setUser((prev) => ({
                ...prev,
                is_following: request.is_following,
                int_followers: prev.int_followers + 1
            }));
        }
        catch (error) {
            console.error(error)
        }
    };

    const handleUnfollow = async () => {
        try {
            const request = await Api.post(`/user/profile/unfollow`, {
                id_following: id
            })
            setUser((prev) => ({
                ...prev,
                is_following: request.is_following,
                int_followers: prev.int_followers - 1
            }));
        }
        catch (error) {
            console.error(error)
        }
    };

    return (
        <Card sx={{ height: 250 }}>
            <ModalEditProfile user={user} open={openEditModal} onClose={(data) => {
                setOpenEditModal(false)
                setUser((prev) => ({
                    ...prev,
                    ...data
                }));
                updateUser(data);
            }
            }
            />
            <Box
                sx={{
                    position: "relative",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    height: "100%",
                    color: "white",
                    backgroundImage: `url(${user?.banner?.str_url})`,
                    backdropAttachment: 'fixed',
                    backgroundClip: 'border-box',
                    backgroundOrigin: 'border-box',
                    backgroundBlendMode: 'overlay',
                }}
            >
                {!id && (
                    <IconButton
                        sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            backgroundColor: (theme) => alpha(theme.palette.grey[900], 0.48),
                            "&:hover": { backgroundColor: (theme) => alpha(theme.palette.grey[900], 0.68) },
                        }}
                        onClick={() => setOpenEditModal(true)}
                    >
                        <Icon icon="tabler:edit" color="white" width={25} />
                    </IconButton>
                )}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack
                        spacing={1}
                        sx={{
                            position: "absolute",
                            zIndex: 10,
                            left: 24,
                            bottom: 30,
                            display: "flex",
                            flexDirection: "row",
                            gap: "2vw",
                            backgroundColor: (theme) => theme.palette.background.paper,
                            borderRadius: 8,
                            paddingRight: "1vw",
                        }}
                    >
                        <ProfileAvatar user={user} id={id} />
                        <div style={{
                            marginTop: user?.bl_admin ? 24 : 35
                        }}
                        >
                            <Typography variant='h3'>
                                {user?.str_username}
                            </Typography>
                            {!!user?.bl_admin && (
                                <Typography
                                    variant='subtitle2'
                                    color="error.main"
                                >
                                    Admin
                                </Typography>
                            )}
                        </div>
                    </Stack>
                </Stack>
                {id && selfUser?.id_user !== id && (
                    <Button
                        variant="contained"
                        color='primary'
                        sx={{
                            position: "absolute",
                            right: "1vw",
                            bottom: "8vh",
                        }}
                        onClick={user?.is_following ? handleUnfollow : handleFollow}
                    >
                        <Icon
                            icon={user?.is_following ? "mdi:heart-off" : "weui:like-filled"}
                            color="white"
                            width={25}
                            style={{
                                marginRight: "0.5rem"
                            }} />
                        {user?.is_following ? "Unfollow" : "Follow"}
                    </Button>
                )}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        backgroundColor: "background.paper",
                        display: "flex",
                        justifyContent: "flex-end",
                        zIndex: 1,
                        paddingRight: "1vw"
                    }}
                >
                    <Tabs
                        value={tab}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "2vw",
                        }}
                    >
                        <Tab
                            label="Posts"
                            icon={<Icon icon="mdi:post"
                                width={25}
                            />
                            }
                            value={0}
                            onClick={() => setTab(0)}
                        />
                        <Tab
                            label="Wallet"
                            icon={<Icon icon="solar:wallet-bold"
                                width={25}
                            />
                            }
                            value={1}
                            onClick={() => setTab(1)}
                        />
                    </Tabs>
                </Box>
            </Box>
        </Card>
    );
}

ProfileHeader.propTypes = {
    user: PropTypes.object.isRequired,
    id: PropTypes.string,
    setUser: PropTypes.func.isRequired,
    setTab: PropTypes.func.isRequired,
    tab: PropTypes.number.isRequired,
};
