import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, CardContent, Stack, Typography, TextField, Button, Switch, FormControlLabel } from '@mui/material';
import PropTypes from 'prop-types';
import Api from 'src/utils/api';
import ProfileAvatar from './Avatar';
import ProfileBanner from './Banner';

const ModalEditProfile = ({ user, open, onClose }) => {
    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            str_username: user?.str_username || '',
            str_email: user?.str_email || '',
            str_bio: user?.str_bio || '',
            bool_private_wallet: !user?.bl_wallet
        }
    });
    const [userAvatar, setUserAvatar] = useState(user?.avatar || null);
    const [userBanner, setUserBanner] = useState(user?.banner || null);
    const onSubmit = async (data) => {
        const updatedData = {
            ...data,
            avatar: userAvatar,
            banner: userBanner,
            bl_wallet: !data.bool_private_wallet
        };
        try {
            await Api.post('/user/profile', updatedData);
            onClose(updatedData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        reset({
            str_username: user?.str_username || '',
            str_email: user?.str_email || '',
            str_bio: user?.str_bio || '',
            bool_private_wallet: !user?.bl_wallet
        });
    }, [user, reset]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                    <Stack spacing={2}>
                        <Typography variant="h6">Edit Profile</Typography>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                            <ProfileAvatar
                                user={user}
                                setAvatar={setUserAvatar}
                                editable
                            />
                            <ProfileBanner
                                user={user}
                                setBanner={setUserBanner}
                                editable
                            />
                        </div>
                        <Controller
                            name="str_username"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Username"
                                    variant="outlined"
                                />
                            )}
                        />

                        <Controller
                            name="str_email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    disabled
                                />
                            )}
                        />

                        <Controller
                            name="str_bio"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Bio"
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                />
                            )}
                        />

                        <Controller
                            name="bool_private_wallet"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel label="Set your wallet private" control={
                                    <Switch
                                        {...field}
                                        color="primary"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                } />
                            )}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                        >
                            Save
                        </Button>
                    </Stack>
                </CardContent>
            </form>
        </Dialog>
    );
};

export default ModalEditProfile;

ModalEditProfile.propTypes = {
    user: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
