import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';

import { Icon } from '@iconify/react';
import { Autocomplete, Box, InputAdornment, TextField, Tooltip } from '@mui/material';
import { useState } from 'react';
import Api from 'src/utils/api';
import { useNavigate } from 'react-router';
import { NAV, HEADER } from '../config-layout';
import AccountPopover from '../common/account-popover';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const theme = useTheme();
  const settings = useSettingsContext();
  const [usersSearch, setUsersSearch] = useState([]);
  const isNavHorizontal = settings.themeLayout === 'horizontal';
  const isNavMini = settings.themeLayout === 'mini';
  const lgUp = useResponsive('up', 'lg');
  const offset = useOffSetTop(HEADER.H_DESKTOP);
  const offsetTop = offset && !isNavHorizontal;
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (value) => {
    if (value === '') return;
    Api.get(`/user/search?search=${value}&limit=5`).then((response) => {
      setUsersSearch(response.map((user) => ({
        id: user.id_user,
        label: user.str_username,
        value: user.str_username,
      })));
    });
  };


  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >
        <Autocomplete
          freeSolo
          options={usersSearch}
          filterOptions={(x) => x}
          inputValue={inputValue}
          getOptionLabel={(option) => option.label || ''}
          onChange={(e, value) => {
            if (value) {
              navigate(`/app/profile/${value.id}`);
            }
            setInputValue('');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search an user"
              variant="outlined"
              size="small"
              color='primary'
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
                width: '300px',
              }}
            />
          )}
        />
        {/* <Typography sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '5px',
          alignItems: 'center',
          padding: '5px 10px',
          borderRadius: '10px',
          border: '2px solid transparent',
          backgroundImage: `linear-gradient(
        90deg,
        rgba(255, 154, 0, 1) 10%,
        rgba(63, 218, 216, 1) 40%,
        rgba(186, 12, 248, 1) 80%,
        rgba(255, 0, 0, 1) 100%
    )`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          backgroundColor: theme.palette.background.paper,
        }}>
          <Icon icon="ph:star-four-fill" />
          Upgrade to Pro
        </Typography> */}
        <Tooltip title="SOON ^^" arrow>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '5px 10px',
            borderRadius: '10px',
            border: '1px solid',
            borderColor: 'primary.main',
            gap: '5px',
          }}>
            <div>
              0
            </div>
            <Icon icon="ph:coins" />
          </Box>
        </Tooltip>
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
