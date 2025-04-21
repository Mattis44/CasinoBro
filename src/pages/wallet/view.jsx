import { Divider, Typography } from '@mui/material';

import { useEffect, useState } from 'react';
import Api from 'src/utils/api';
import TableWallet from './components/table';
import HeaderWallet from './components/header';

export default function Wallet() {
  const [data, setData] = useState([]);
  const [totalWalletValue, setTotalWalletValue] = useState(0);

  useEffect(() => {
    Promise.all([Api.get('/user/action'), Api.get('/user/crypto')])
      .then(([actionResponse, cryptoResponse]) => {
        setData([...actionResponse, ...cryptoResponse]);
      });
  }, []);
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Wallet
      </Typography>
      <Divider sx={{ mb: 5 }} />
      <HeaderWallet totalWalletValue={totalWalletValue} />
      <TableWallet
        sx={{
          mt: 3,
        }}
        data={data}
        setTotalWalletValue={setTotalWalletValue}
      />
    </>
  );
}
