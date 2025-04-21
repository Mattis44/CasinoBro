import { useState, useEffect } from 'react';

import { Grid, Divider, Typography, Skeleton, Button } from '@mui/material';

import Api from 'src/utils/api';

import { Icon } from '@iconify/react';
import Iconify from 'src/components/iconify';
import CardForum from './components/card';
import HeaderForum from './components/header';

export default function Forum() {
  const [forums, setForums] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [size, setSize] = useState(6);
  const [category, setCategory] = useState("");
  const [latestStared, setLatestStared] = useState({});
  const [latestFormation, setLatestFormation] = useState({});

  useEffect(() => {
    if (category !== "" && category !== undefined) {
      Api.get(`/forum/category/${category}?size=${size}`).then((response) => {
        setForums(response);
        setLoaded(true);
      });
      return;
    }
    Api.get(`/forum?size=${size}`).then((response) => {
      setForums(response);
      const starred = response.list.filter((item) => item.bl_starred && item.date_starred);
      const formation = response.list.filter((item) => item.bl_formation);
      setLatestStared(starred.length === 0 ? starred[0] : starred.sort((a, b) => new Date(b.date_starred) - new Date(a.date_starred))[0]);
      setLatestFormation(formation.length === 0 ? formation[0] : formation.sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation))[0]);
      setLoaded(true);
    });
  }, [size, category]);


  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Iconify icon="mdi:forum" style={{ fontSize: 30 }} />
        <Typography variant="h4" gutterBottom sx={{
          marginLeft: 1,
        }}>
          Forum
        </Typography>
      </div>
      <Divider sx={{ mb: 5 }} />
      <HeaderForum setForums={setForums} size={size} setSize={setSize} setCategory={setCategory} category={category} />
      {latestStared && latestFormation && (
        <Grid container rowSpacing={1} columnSpacing={{ xs: 3, sm: 1, md: 1 }} sx={{ marginTop: 2 }}>
          <Grid item xs={12} sm={6} md={6}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon icon="material-symbols:star" style={{ fontSize: 25, marginRight: 1 }} />
                <Typography variant="h6" gutterBottom sx={{ marginLeft: 1, marginTop: 1 }}>
                  Recent starred topic
                </Typography>
              </div>
              <Divider sx={{ mb: 2 }} />
              <CardForum
                title={latestStared?.str_title}
                category={latestStared?.category}
                content={latestStared?.str_content}
                date={latestStared?.date_starred}
                id={latestStared?.id_forum}
                user={latestStared?.user}
                likes={latestStared?.likes?.count}
                comments={latestStared?.reply?.count}
                views={latestStared?.views?.count}
                formation={latestStared?.bl_formation}
                starred
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon icon="material-symbols:school" style={{ fontSize: 25, marginRight: 1 }} />
                <Typography variant="h6" gutterBottom sx={{ marginLeft: 1, marginTop: 1 }}>
                  Recent validated formation
                </Typography>
              </div>
              <Divider sx={{ mb: 2 }} />
              <CardForum
                title={latestFormation?.str_title}
                category={latestFormation?.category}
                content={latestFormation?.str_content}
                date={latestFormation?.date_creation}
                id={latestFormation?.id_forum}
                user={latestFormation?.user}
                likes={latestFormation?.likes?.count}
                comments={latestFormation?.reply?.count}
                views={latestFormation?.views?.count}
                starred={!!latestFormation?.bl_starred}
                formation={latestFormation?.bl_formation}
              />
            </div>
          </Grid>
        </Grid>
      )}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
        <Icon icon="mdi:recent" style={{ fontSize: 25, marginRight: 1 }} />
        <Typography variant="h6" gutterBottom sx={{ marginLeft: 1, marginTop: 1 }}>
          Recent topics
        </Typography>
      </div>
      <Divider sx={{ mb: 2 }} />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 3, sm: 1, md: 1 }}>
        {!loaded && (
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton variant="rectangular" width={500} height={250} sx={{ borderRadius: 2, margin: 1 }} key={index} />
          ))
        )}
        {forums.list?.length === 0 && loaded && (
          <Typography variant="h6" gutterBottom>
            No forums found
          </Typography>
        )}
        {forums.list?.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={6}>
            <CardForum
              title={item.str_title}
              category={item.category}
              content={item.str_content}
              date={item.date_creation}
              id={item.id_forum}
              user={item.user}
              likes={item.likes?.count}
              comments={item.reply?.count}
              views={item.views?.count}
              formation={!!item.bl_formation}
              starred={!!item.bl_starred}
            />
          </Grid>
        ))}
      </Grid>

      {forums.count > size && (
        <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
          <Button
            onClick={() => setSize(size + 6)}
            variant="contained"
            color="primary"
          >
            Load more
          </Button>
        </Grid>
      )}
    </div>
  );
}
