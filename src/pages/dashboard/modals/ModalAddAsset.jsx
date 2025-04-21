import { Icon } from "@iconify/react";
import { Autocomplete, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Api from "src/utils/api";


const ModalAddAsset = ({ isOpen, onClose }) => {
    const [isTrSync, setIsTrSync] = useState(false);
    const [isAutoSync, setIsAutoSync] = useState(false);
    const [isBinanceSync, setIsBinanceSync] = useState(false);
    const [isManualSync, setIsManualSync] = useState(false);
    const [isFirstStepDone, setIsFirstStepDone] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [manualAssets, setManualAssets] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [assetsSearch, setAssetsSearch] = useState([]);

    const handleSearch = (value) => {
        if (value === '') return;
        Api.get(`/user/action/${value}?limit=5`).then((response) => {
            setAssetsSearch(response.map((asset) => ({
                id: asset.str_isin,
                label: asset.str_name,
                logo: asset.str_logo,
                value: asset.str_name,
                type: asset.type,
                symbol: asset.str_symbol,
                name: asset.str_name,
                category: asset.id_category
            })));
        });
    };

    const handleSubmitManualActions = () => {
        setIsLoading(true);
        Api.post("/user/action", {
            actions: manualAssets.map(asset => ({
                id: asset.id,
                purchasePrice: asset.purchasePrice,
                quantity: asset.quantity,
                symbol: asset.symbol,
                name: asset.name,
                category: asset.category
            }))
        }).then(response => {
            console.log(response);

            if (response.status === "success") {
                window.location.href = "/app/wallet";
                onClose();
            }
        }).catch(error => {
            console.log(error);
            setIsLoading(false);
            setIsError(true);
        });
    };


    const handleChange = (index, field, value) => {
        const updatedAssets = manualAssets.map((asset, i) => {
            if (i === index) {
                return {
                    ...asset,
                    [field]: value
                }
            }
            return asset;
        });
        setManualAssets(updatedAssets);
    };



    const onSubmitA2F = (data) => {
        setIsLoading(true);
        Api.post("/user/sync/tr/a2f", {
            a2f: data.a2fCode,
            phoneNumber
        }).then(response => {
            if (response.status === "success") {
                window.location.href = "/app/wallet";
                onClose();
            }
        }).catch(error => {
            console.log(error);
            setIsLoading(false);
            setIsError(true);
        });
    }

    const onSubmit = (data) => {
        const phone = `+${data.phonePrefix}${data.phoneNumber}`;
        setIsLoading(true);
        Api.post("/user/sync/tr", {
            phoneNumber: phone,
            pin: data.pin
        }).then(response => {
            if (response.countdown) {
                setIsFirstStepDone(true);
                setPhoneNumber(phone);
                setIsLoading(false);
            }
        }).catch(error => {
            console.log(error);
            setIsLoading(false);
            setIsError(true);
        });
    }

    const onSubmitBinance = (data) => {
        setIsLoading(true);
        Api.post("/user/sync/binance", {
            apiKey: data.apiKey,
            apiSecret: data.apiSecret
        }).then(response => {
            if (response.status === "success") {
                window.location.href = "/app/wallet";
                onClose();
            }
        }).catch(error => {
            console.log(error);
            setIsLoading(false);
            setIsError(true);
        });
    }

    const handlePhoneNumberChange = (event) => {
        let { value } = event.target;
        value = value.replace(/[^0-9]/g, '');

        if (value.length === 0 || (value.length === 1 && value === '0')) {
            setValue('phoneNumber', '');
        } else if (value.length > 0 && value[0] === '0') {
            setValue('phoneNumber', value.substring(1));
        } else if (value.length > 9) {
            setValue('phoneNumber', value.substring(0, 9));
        } else {
            setValue('phoneNumber', value);
        }
    };

    const handlePinChange = (event) => {
        let { value } = event.target;
        value = value.replace(/[^0-9]/g, '');

        if (value.length > 4) {
            setValue('pin', value.substring(0, 4));
        } else {
            setValue('pin', value);
        }
    }

    if (isError) {
        return (
            <Dialog open={isOpen} onClose={onClose}>
                <DialogTitle>Add Trade Republic Account</DialogTitle>
                <DialogContent>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '20px'
                    }}>
                        <h3>Error</h3>
                        <p>Something went wrong</p>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setIsTrSync(false);
                            setIsManualSync(false);
                            setIsFirstStepDone(false);
                            setIsLoading(false);
                            setIsError(false);
                        }}
                        variant="contained"
                        color="primary"
                    >
                        Try again
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        color="error"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    if (isLoading) {
        return (
            <Dialog open={isOpen} onClose={onClose}>
                <DialogTitle>Add assets to your account</DialogTitle>
                <DialogContent>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '20px'
                    }}>
                        <CircularProgress />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setIsTrSync(false);
                            setIsManualSync(false);
                            setIsFirstStepDone(false);
                            setIsLoading(false);
                        }}
                        variant="contained"
                        color="primary"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    if (isBinanceSync) {
        return (
            <Dialog open={isOpen} onClose={onClose}>
                <DialogTitle>Add Binance Account</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmitBinance)}>
                        <TextField
                            label="API Key"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            {...register("apiKey", { required: true })}
                            error={!!errors.apiKey}
                            helperText={errors.api
                                ? "Enter valid API Key"
                                : ""}
                            autoFocus
                        />
                        <TextField
                            label="API Secret"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            {...register("apiSecret", { required: true })}
                            error={!!errors.api}
                            helperText={errors.api}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{
                                mt: 2,
                                width: '100%'
                            }}
                        >
                            Add Account
                        </Button>
                    </form>
                </DialogContent>
                <DialogActions sx={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <Button
                        onClick={() => {
                            setIsTrSync(false);
                            setIsManualSync(false);
                            setIsAutoSync(false);
                            setIsBinanceSync(false);
                        }}
                        variant="contained"
                        color="primary"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        color="error"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    if (isFirstStepDone) {
        return (
            <Dialog open={isOpen} onClose={onClose}>
                <DialogTitle>Add Trade Republic Account</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmitA2F)}>
                        <TextField
                            label="A2F code"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            {...register("a2fCode", { required: true, pattern: /^[0-9]{4}$/ })}
                            error={!!errors.a2fCode}
                            helperText={errors.a2fCode ? "Enter valid 2FA code" : ""}
                            autoFocus
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{
                                mt: 2,
                                width: '100%'
                            }}
                        >
                            Add Account
                        </Button>
                    </form>
                </DialogContent>
                <DialogActions sx={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <Button
                        onClick={() => {
                            setIsTrSync(false);
                            setIsManualSync(false);
                            setIsFirstStepDone(false);
                        }}
                        variant="contained"
                        color="primary"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        color="error"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    if (isTrSync) {
        return (
            <Dialog open={isOpen} onClose={onClose}>
                <DialogTitle>Add Trade Republic Account</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '10px'
                        }}>
                            <FormControl margin="normal" sx={{
                                minWidth: 64
                            }}>
                                <InputLabel id="prefix-select-label">
                                    Prefix
                                </InputLabel>
                                <Select
                                    labelId="prefix-select-label"
                                    defaultValue="33"
                                    {...register("phonePrefix", { required: true })}
                                    error={!!errors.phonePrefix}
                                >
                                    <MenuItem value="33">+33</MenuItem>
                                    <MenuItem value="1">+1</MenuItem>
                                    <MenuItem value="44">+44</MenuItem>
                                </Select>
                                {errors.phonePrefix && <span>Required field</span>}
                            </FormControl>
                            <TextField
                                label="Phone number"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                {...register("phoneNumber", {
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^[1-9][0-9]{8,9}$/,
                                        message: "Enter a valid phone number (should not start with 0)"
                                    }
                                })}
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber ? errors.phoneNumber.message : ""}
                                onChange={handlePhoneNumberChange}
                                autoFocus
                            />
                        </div>
                        <TextField
                            label="Pin"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            {...register("pin", { required: true, pattern: /^[0-9]{4}$/ })}
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber ? "Enter valid PIN" : ""}
                            onChange={handlePinChange}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{
                                mt: 2,
                                width: '100%'
                            }}
                        >
                            Request 2FA code
                        </Button>
                    </form>
                </DialogContent>
                <DialogActions sx={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <Button
                        onClick={() => {
                            setIsTrSync(false);
                            setIsManualSync(false);
                        }}
                        variant="contained"
                        color="primary"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        color="error"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    if (isAutoSync) {
        return (
            <Dialog open={isOpen} onClose={onClose}>
                <DialogTitle>Add assets to your account</DialogTitle>
                <DialogContent>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '20px'
                    }}>
                        <Box
                            onClick={() => setIsBinanceSync(true)}
                            sx={{
                                display: 'flex',
                                gap: '20px',
                                backgroundColor: (theme) => `${theme.palette.primary.main}33`,
                                borderRadius: '5px',
                                padding: '20px',
                                width: "100%",
                                "&:hover": {
                                    cursor: "pointer",
                                    backgroundColor: (theme) => `${theme.palette.primary.main}66`,
                                }
                            }}
                        >
                            <Icon icon="simple-icons:binance" style={{
                                color: "#fff",
                                fontSize: "3rem"
                            }} />
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px'
                            }}>
                                <Typography variant="h6">Binance</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Connect your Binance account to sync your assets
                                </Typography>
                            </div>
                        </Box>

                    </div>
                </DialogContent>
                <DialogActions sx={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <Button
                        onClick={() => {
                            setIsTrSync(false);
                            setIsManualSync(false);
                            setIsAutoSync(false);
                        }}
                        variant="contained"
                        color="primary"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        color="error"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }


    if (isManualSync) {
        return (
            <Dialog open={isOpen} onClose={onClose} fullWidth>
                <DialogTitle>Add manual assets</DialogTitle>
                <DialogContent>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '20px'
                    }}>
                        <Autocomplete
                            freeSolo
                            filterOptions={(x) => x}
                            options={assetsSearch}
                            getOptionLabel={(option) => option.label || ''}
                            inputValue={inputValue}
                            onChange={(e, value) => {
                                if (value) {
                                    setManualAssets([...manualAssets, value]);
                                    setInputValue('');
                                }
                            }}
                            renderOption={(props, option) => (
                                <Box
                                    component="li"
                                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                    {...props}
                                >
                                    <img loading="lazy" width="20" src={option.logo} alt="" style={{
                                        borderRadius: '5px',
                                        marginRight: '10px'
                                    }} />
                                    {option.label}
                                    <Chip
                                        label={option.type}
                                        color="primary"
                                        size="small"
                                        variant="soft"
                                        sx={{
                                            ml: 1
                                        }}

                                    />
                                </Box>
                            )}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="Search asset"
                                    variant="outlined"
                                    color="primary"
                                    onChange={(e) => {
                                        handleSearch(e.target.value)
                                        setInputValue(e.target.value);
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Icon icon="material-symbols:search" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        width: '100%',
                                    }}
                                />
                            }
                            sx={{
                                width: '100%',
                            }}
                        />
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '10px',
                            flexWrap: 'wrap',
                            width: '100%',
                        }}>
                            {manualAssets.map((asset, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '10px',
                                        margin: '5px',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        width: '100%',
                                        backgroundColor: (theme) => `${theme.palette.primary.main}33`
                                    }}
                                >
                                    <Chip
                                        label={asset.label}
                                        onDelete={() => {
                                            setManualAssets(manualAssets.filter((_, i) => i !== index));
                                        }}
                                        color="primary"
                                        icon={
                                            <img
                                                src={asset.logo}
                                                alt={asset.label}
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '5px',
                                                }}
                                            />
                                        }
                                    />

                                    <TextField
                                        label="Buying price"
                                        variant="outlined"
                                        size="small"
                                        value={asset.purchasePrice || ''}
                                        onChange={(e) => handleChange(index, 'purchasePrice', e.target.value)}
                                        type="number"
                                        style={{ width: '120px' }}
                                    />

                                    <TextField
                                        label="Quantity"
                                        variant="outlined"
                                        size="small"
                                        value={asset.quantity || ''}
                                        onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                                        type="number"
                                        style={{ width: '120px' }}
                                    />
                                </Box>
                            ))}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions sx={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <Button
                        onClick={() => {
                            setIsTrSync(false);
                            setIsManualSync(false);
                        }}
                        variant="contained"
                        color="primary"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        color="error"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            handleSubmitManualActions();
                        }}
                    >
                        Add assets
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }




    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth>
            <DialogTitle>Add assets to your account</DialogTitle>
            <DialogContent>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '20px'
                }}>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '20px',
                            backgroundColor: (theme) => `${theme.palette.primary.main}33`,
                            borderRadius: '5px',
                            padding: '20px',
                            width: "100%",
                            "&:hover": {
                                cursor: "pointer",
                                backgroundColor: (theme) => `${theme.palette.primary.main}66`,
                            }
                        }}
                        onClick={() => setIsTrSync(true)}
                    >
                        <img src="https://mattis.ovh/svg/trade-republic.svg" alt="TR" style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '10%'
                        }} />
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px'
                        }}>
                            <Typography variant="h6">Featured</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Connect your Trade Republic account to sync your assets
                            </Typography>
                        </div>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '20px',
                            backgroundColor: (theme) => `${theme.palette.primary.main}33`,
                            borderRadius: '5px',
                            padding: '20px',
                            width: "100%",
                            "&:hover": {
                                cursor: "pointer",
                                backgroundColor: (theme) => `${theme.palette.primary.main}66`,
                            }
                        }}
                        onClick={() => setIsAutoSync(true)}
                    >
                        <Icon icon="ic:baseline-auto-awesome" style={{
                            color: "#fff",
                            fontSize: "3rem"
                        }} />
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px'
                        }}>
                            <Typography variant="h6">Auto Sync</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Connect your account to sync your assets
                            </Typography>
                        </div>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '20px',
                            backgroundColor: (theme) => `${theme.palette.primary.main}33`,
                            borderRadius: '5px',
                            padding: '20px',
                            width: "100%",
                            "&:hover": {
                                cursor: "pointer",
                                backgroundColor: (theme) => `${theme.palette.primary.main}66`,
                            }
                        }}
                        onClick={() => setIsManualSync(true)}
                    >
                        <Icon icon="mingcute:stock-fill" style={{
                            color: "#fff",
                            fontSize: "3rem"
                        }} />
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px'
                        }}>
                            <Typography variant="h6">Manual Sync</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Add your assets manually from a large list of supported assets

                            </Typography>
                        </div>
                    </Box>
                </div>
            </DialogContent>
            <DialogActions sx={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    color="error"
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalAddAsset;

ModalAddAsset.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func
};