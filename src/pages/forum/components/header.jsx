import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  CardContent,
  FormControl,
} from '@mui/material';

import Api from 'src/utils/api';

import Iconify from 'src/components/iconify';
import { useMockedUser } from 'src/hooks/use-mocked-user';

const HeaderForum = ({ setForums, size, setSize, setCategory, category }) => {
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const { user } = useMockedUser();

  const handleChange = (event) => {
    setSize(6)
    if (event.target.value === '') {
      setCategory('');
      Api.get(`/forum?size=${size}`).then((response) => {
        setForums(response);
      });
      return;
    }
    setCategory(event.target.value);
    Api.get(`/forum/category/${event.target.value}?size=${size}`).then((response) => {
      setForums(response);
    });
  };

  const handleSearch = (event) => {
    setSize(6)
    if (event.target.value === '') {
      Api.get(`/forum?size=${size}`).then((response) => {
        setForums(response);
      });
      return;
    }
    Api.get(`/forum?search=${event.target.value}&size=${size}`).then((response) => {
      setForums(response);
    });
  }

  useEffect(() => {
    Api.get('/forum/categories').then((response) => {
      setCategories(response);
    });
  }, []);
  return (
    <Card>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TextField label="Search..." variant="outlined" sx={{ width: '600px' }} onChange={handleSearch} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <FormControl variant="outlined" sx={{ width: '200px', marginRight: '10px' }}>
            <InputLabel id="demo-simple-select-outlined-label">Category</InputLabel>
            <Select
              variant="outlined"
              sx={{ width: '200px', marginRight: '10px' }}
              value={category}
              label="Category"
              onChange={handleChange}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id_category} value={cat.id_category}>
                  {cat.str_title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {user && !!user.bl_admin && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mdi:crown" />}
              sx={{ width: '100px', marginRight: '10px' }}
              onClick={() => {
                navigate('/app/forum/admin');
              }}
            >
              Admin
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="bx:bxs-plus-circle" />}
            sx={{ width: '100px' }}
            onClick={() => {
              navigate('/app/forum/add');
            }}
          >
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeaderForum;

HeaderForum.propTypes = {
  setForums: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
  setSize: PropTypes.func.isRequired,
  setCategory: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
}