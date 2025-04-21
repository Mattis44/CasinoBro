import * as yup from 'yup';
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Select, Button, MenuItem, TextField, InputLabel, FormControl, Switch, FormControlLabel, Tooltip, Alert } from '@mui/material';
import Api from 'src/utils/api';
import { useNavigate } from 'react-router';
import { Icon } from '@iconify/react';
import { ForumMarkdown } from "./forumMarkdown";

const CreationForm = () => {
  const [content, setContent] = useState("# My topic !");
  const [categories, setCategories] = useState([]);
  const [formation, setFormation] = useState(false);
  const [formationStep, setFormationStep] = useState(0);
  const [steps, setSteps] = useState([{ title: 'Step 1', content: '# My step !' }]);

  const schema = yup.object().shape({
    formation: yup.boolean(),
    title: yup.string().required('Title is required'),
    category: yup.string().required('Category is required'),
    content: yup.string().required('Content is required').min(50, 'Content is too short, minimum 50 characters')
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), defaultValues: { content: "# My Topic !" } });
  const navigate = useNavigate();

  useEffect(() => {
    Api.get('/forum/categories').then((data) => {
      setCategories(data);
    });
  }, []);

  const onSubmit = (data) => {
    const formData = {
      str_title: data.title,
      str_content: data.content,
      id_category: data.category,
      formation: data.formation,
    };

    if (data.formation) {
      formData.steps = steps.map((step) => ({
        str_title: step.title,
        str_content: step.content,
      }))
    }
    Api.post('/forum', {
      ...formData
    }).then(() => {
      navigate('/app/forum');
    });
  };

  const handleAddStep = () => {
    setSteps([...steps, {
      title: `Step ${steps.length + 1}`,
      content: '# My step !',
    }]);
    setFormationStep(steps.length + 1);
  };

  const handleDeleteStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
    setFormationStep(0);
  };

  const renderForm = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: '50%',
          margin: 'auto',
        }}
      >
        {formation && (
          <Alert severity="warning">
            Formation topics will need a review by the team.
          </Alert>
        )}
        <div style={{ display: 'flex', flexDirection: "row" }}>
          <FormControlLabel
            control={
              <Switch
                {...register('formation')}
                checked={formation}
                onChange={(e) => setFormation(e.target.checked)}
              />
            }
            label="Formation"
          />
          <Tooltip title="Formation are topics with specific content and steps for learning purposes. This topic will need a review by the team.">
            <Icon icon="material-symbols:info" style={{ fontSize: 15, alignSelf: 'center' }} />
          </Tooltip>
        </div>
        <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between" }}>
          <TextField
            {...register('title')}
            label="Title"
            variant="outlined"
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
          />
          <FormControl variant="outlined" error={Boolean(errors.category)} style={{
            minWidth: '200px',
          }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              {...register('category')}
              labelId="category-label"
              label="Category"
              variant="outlined"
              value={watch('category') || ''}
              onChange={(e) => setValue('category', e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category.id_category} value={category.id_category}>
                  {category.str_title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <TextField
          {...register('content')}
          label="Content"
          multiline
          rows={10}
          cols={50}
          variant="outlined"
          error={Boolean(errors.content)}
          helperText={errors.content?.message}
          onChange={(e) => setContent(e.target.value)}
        />
        <InputLabel>Preview</InputLabel>
        <ForumMarkdown
          content={content}
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </form>
  )

  const renderStep = (index) => (
    <div key={index}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: '50%',
          margin: 'auto',
        }}
      >
        <Alert severity="info">
          Steps are automaticaly saved, go back to <strong>Principal step</strong> to submit your formation.
        </Alert>
        <TextField
          label="Title"
          variant="outlined"
          value={steps[index].title}
          onChange={(e) => {
            const newSteps = [...steps];
            newSteps[index].title = e.target.value;
            setSteps(newSteps);
          }}
        />
        <TextField
          label="Content"
          multiline
          rows={10}
          cols={50}
          variant="outlined"
          value={steps[index].content}
          onChange={(e) => {
            const newSteps = [...steps];
            newSteps[index].content = e.target.value;
            setSteps(newSteps);
          }}
        />
        <InputLabel>Preview</InputLabel>
        <ForumMarkdown
          content={steps[index].content}
        />
        {index > 0 && (
          <Button variant="outlined" color="error" onClick={() => handleDeleteStep(index)}>
            Delete
          </Button>
        )}
      </Box>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: "row" }}>
      {formation && (
        <div style={{ display: 'flex', flexDirection: "column", gap: '1rem' }}>
          <Button
            color="primary"
            onClick={() => setFormationStep(0)}
            variant={formationStep === 0 ? 'contained' : null}
          >
            Principal
          </Button>
          {steps.map((step, index) => (
            <Button
              key={index}
              color="primary"
              variant={formationStep === index + 1 ? 'contained' : null}
              onClick={() => setFormationStep(index + 1)}
            >
              {step.title || `Step ${index + 1}`}
            </Button>
          ))}
          <Button
            color="primary"
            onClick={handleAddStep}
          >
            Add step
          </Button>
        </div>
      )}
      <div style={{ width: '100%' }}>
        {formationStep === 0 && renderForm}
        {formationStep > 0 && renderStep(formationStep - 1)}
      </div>
    </div >
  );
};

export default CreationForm;
