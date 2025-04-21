import PropTypes from 'prop-types';

import {
  Paper,
  Table,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  Link,
  Skeleton,
  Typography,
  IconButton,
  MenuList,
  ListItemIcon,
  MenuItem,
  Menu,
  ListItemText,
} from '@mui/material';

import { useEffect, useState } from 'react';
import Api from 'src/utils/api';
import { Icon } from '@iconify/react';

export default function TableWallet({ sx, endpoint, data = [], setTotalWalletValue }) {
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    if (data.length === 0) {
      return;
    }
    setPositions(data);

    Api.post("/user/action/price", {
      symbols: data.map((item) => item.str_symbol),
    }).then((response) => {
      setPositions(data.map((item) => {
        const position = response.symbols.find((pos) => pos.symbol === item.str_symbol);
        return {
          ...item,
          price: position?.price || 0,
          changePercent: position?.changePercent || 0,
        };
      }).sort((a, b) => b.double_amount * b.price - a.double_amount * a.price));
      if (setTotalWalletValue) {
        setTotalWalletValue(data.reduce((acc, item) => acc + item.double_amount * response.symbols.find((pos) => pos.symbol === item.str_symbol).price, 0));
      }
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (data.length === 0) {
    return (
      <Typography variant="h4" gutterBottom sx={{
        textAlign: 'center',
        mt: 5,
      }}>
        No assets in your wallet
      </Typography>
    );
  }
  return (
    <TableContainer component={Paper} sx={{ ...sx }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Asset</TableCell>
            <TableCell align="right">ISIN</TableCell>
            <TableCell align="right">Ticker</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">
              <Tooltip title="Last price traded">Last price (24h)</Tooltip>
            </TableCell>
            <TableCell align="right">Position</TableCell>
            <TableCell align="right">Avg. Price</TableCell>
            <TableCell align='right'>
              Sync
            </TableCell>
            <TableCell align='right'>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {positions.length !== 0 ? (
            positions.map((row) => (
              <TableRow key={row.str_name}>

                <TableCell>
                  <img
                    src={row?.str_logo}
                    alt="logo"
                    width={30}
                    height={30}
                    style={{ borderRadius: '10%' }}
                  />
                </TableCell>
                <TableCell scope="row">
                  <Link>
                    {row.str_name}
                  </Link>
                </TableCell>
                <TableCell align="right">{row?.str_isin || "-"}</TableCell>
                <TableCell align="right">{row?.str_symbol || "-"}</TableCell>
                <TableCell align="right">{row?.id_category === 1 ? "Stock" : "Crypto"}</TableCell>
                <TableCell align="right">{row?.double_amount?.toFixed(2)}</TableCell>
                <TableCell align="right">
                  {loading ? (
                    <Skeleton variant="text" width={50} sx={{ display: 'inline-block' }} />
                  ) : (
                    <>
                      <Typography variant='subtitle2'>
                        {Number(row.price)?.toFixed(2)}$
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          color: row.changePercent > 0 ? 'success.main' : 'error.main',
                        }}
                      >
                        {Number(row.changePercent).toFixed(2)}%
                      </Typography>
                    </>
                  )}
                </TableCell>
                <TableCell align="right">
                  {loading ? (
                    <Skeleton variant="text" width={50} sx={{ display: 'inline-block' }} />
                  ) : (
                    <>
                      <Typography variant='subtitle2'>
                        {Number(row.double_amount * row.price)?.toFixed(2)}$
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          color: row.changePercent > 0 ? 'success.main' : 'error.main',
                        }}
                      >
                        {(Number(row.double_amount * row.price - row.double_amount * row.price / (1 + row.changePercent / 100)))?.toFixed(2)}$
                      </Typography>
                    </>
                  )}
                </TableCell>
                <TableCell align="right">
                  <>
                    <Typography variant='subtitle2'>
                      {Number(row.double_pru)?.toFixed(2)}{row.id_method === 1 ? "€" : "$"}
                    </Typography>
                    <Typography
                      variant='caption'
                      sx={{
                        color: row.double_pru < row.price ? 'success.main' : 'error.main',
                      }}
                    >
                      {Number((row.price - row.double_pru) / row.double_pru * 100).toFixed(2)}%
                    </Typography>
                  </>
                </TableCell>
                {row.id_method === 1 ? (
                  <TableCell align="right">
                    <Tooltip title="Synced with Trade Republic">
                      <img
                        src="https://mattis.ovh/svg/trade-republic.svg"
                        alt="sync"
                        width={25}
                        height={25}
                        style={{ borderRadius: '10%' }}
                      />
                    </Tooltip>
                  </TableCell>
                ) : (
                  <TableCell align="right">
                    <Tooltip title="Synced manually">
                      <Icon icon="mdi:user" style={{
                        fontSize: 30,
                        display: 'inline-block',
                      }} />
                    </Tooltip>
                  </TableCell>
                )}
                <TableCell align="right">
                  <>
                    <IconButton onClick={(event) => {
                      if (openMenu?.id === row.str_name) {
                        setOpenMenu(null);
                      } else {
                        setOpenMenu({ id: row.str_name, anchorEl: event.currentTarget });
                      }
                    }}>
                      <Icon icon="mage:dots" style={{ fontSize: 30, display: 'inline-block' }} />
                    </IconButton>
                    <Menu
                      anchorEl={openMenu?.anchorEl}
                      open={openMenu?.id === row.str_name}
                      onClose={() => setOpenMenu(null)}
                    >
                      <MenuList>
                        <MenuItem>
                          <ListItemIcon>
                            <Icon icon="mdi:delete" style={{ fontSize: 20, display: 'inline-block' }} />
                          </ListItemIcon>
                          <ListItemText primary="Delete" />
                        </MenuItem>
                        {Number(row.id_method) === 2 && (
                          <MenuItem>
                            <ListItemIcon>
                              <Icon icon="mdi:account-edit" style={{ fontSize: 20, display: 'inline-block' }} />
                            </ListItemIcon>
                            <ListItemText primary="Edit" />
                          </MenuItem>
                        )}
                      </MenuList>
                    </Menu>
                  </>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8}>
                <Skeleton variant="rectangular" height={50} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

TableWallet.propTypes = {
  sx: PropTypes.object,
  endpoint: PropTypes.string,
  data: PropTypes.array,
  setTotalWalletValue: PropTypes.func,
};
