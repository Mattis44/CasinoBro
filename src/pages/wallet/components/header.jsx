import PropTypes from 'prop-types';

import { Card, Button, Select, MenuItem, TextField, Typography, CardContent, Skeleton } from '@mui/material';

import Iconify from 'src/components/iconify';
import ModalAddAsset from 'src/pages/dashboard/modals/ModalAddAsset';
import { useState } from 'react';

export default function HeaderWallet({
  totalWalletValue,
  setSearch,
  setAction,
  onAdd,
}) {
  const [modalAddAsset, setModalAddAsset] = useState(false);
  return (
    <Card>
      <ModalAddAsset isOpen={modalAddAsset} onClose={() => setModalAddAsset(false)} />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {totalWalletValue === 0 ? (
          <Skeleton variant="text" width={200} />
        ) : (
          <Typography
            sx={{
              paddingTop: '15px',
            }}
          >
            My wallet : {totalWalletValue?.toFixed(2)} $
          </Typography>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            sx={{
              width: '200px',
              marginRight: '20px',
            }}
          />
          <Select value="stock" variant="outlined" sx={{ width: '200px', marginRight: '20px' }}>
            <MenuItem value="stock">Stock</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="bx:bxs-plus-circle" />}
            sx={{ width: '100px' }}
            onClick={() => setModalAddAsset(true)}
          >
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

HeaderWallet.propTypes = {
  totalWalletValue: PropTypes.number,
  setSearch: PropTypes.func,
  setAction: PropTypes.func,
  onAdd: PropTypes.func,
};
