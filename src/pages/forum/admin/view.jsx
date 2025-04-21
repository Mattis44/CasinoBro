import { Divider, Grid, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Api from 'src/utils/api';
import CardForum from '../components/card';

const ForumAdminView = () => {
    const [formation, setFormation] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        Api.get("/admin/formation").then((response) => {
            setFormation(response);
            setLoaded(true);
        });
    }, []);

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Administration panel
            </Typography>
            <Divider sx={{ mb: 5 }} />
            <Grid container rowSpacing={1} columnSpacing={{ xs: 3, sm: 1, md: 1 }}>
                {!loaded && (
                    Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton variant="rectangular" width={500} height={250} sx={{ borderRadius: 2, margin: 1 }} key={index} />
                    ))
                )}
                {formation?.length === 0 && loaded && (
                    <Typography variant="h6" gutterBottom>
                        No forums found
                    </Typography>
                )}
                {formation?.map((item, index) => (
                    <Grid key={index} item xs={12} sm={6} md={6}>
                        <CardForum
                            title={item?.str_title}
                            category={item?.category}
                            content={item?.str_content}
                            date={item?.date_creation}
                            id={item?.id_forum}
                            user={item?.user}
                            likes={item?.likes?.count}
                            comments={item?.reply?.count}
                            views={item?.views?.count}
                            formation={item?.bl_formation}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default ForumAdminView;
