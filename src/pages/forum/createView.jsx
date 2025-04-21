import { Divider, Typography } from '@mui/material';

import CreationForm from './components/creationForm';

const CreateView = () => {
  console.log();
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Create a topic
      </Typography>
      <Divider sx={{ mb: 5 }} />
      <CreationForm />
    </>
  );
};

export default CreateView;
