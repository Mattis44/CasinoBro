import moment from 'moment';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';

import {
  Card,
  Link,
  Chip,
  Stack,
  Button,
  CardHeader,
  Typography,
  CardActions,
  CardContent,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import ProfileAvatar from 'src/pages/profile/components/Avatar';
import StarredChip from './starredChip';
import FormationChip from './formationChip';

const markdownToText = (markdown) => {
  const plainText = markdown?.replace(/(^|\n)(#+)(.*?)(\n|$)/g, '$1$3$4');
  return plainText;
};

const CardForum = ({ id, title, content, date, user, category, likes, comments, views, formation, starred }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/app/forum/${id}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{ cursor: "pointer", border: starred ? 1 : null, borderColor: starred ? "rgba(255, 215, 0, 0.5)" : null }}
    >
      <CardHeader
        title={
          <>
            {!!starred &&
              <StarredChip />
            }
            {!!formation &&
              <FormationChip />
            }
            <Chip
              variant="soft"
              label={category?.str_title}
              color="info"
              sx={{
                marginRight: 1,
              }}
            />
            {title}
          </>
        }
        subheader={moment(date).fromNow()}
        action={
          <ProfileAvatar
            user={user}
            size="small"
            showUsername
          />
        }
      />
      <CardContent sx={{ minHeight: 100 }}>
        <Typography variant="body2" color="text.secondary">
          {content?.length > 100 ? `${markdownToText(content).slice(0, 100)}...` : markdownToText(content)}{' '}
          {content?.length > 100 && <Link sx={{ cursor: "pointer" }} onClick={handleClick}>Read more</Link>}
        </Typography>
      </CardContent>
      <CardActions sx={{ paddingBottom: 2, justifyContent: 'flex-end' }}>
        <Stack
          spacing={1.5}
          direction="row"
          justifyContent="flex-end"
          sx={{
            mt: 3,
            typography: 'caption',
            color: 'text.disabled',
          }}
        >
          <Stack direction="row" alignItems="center">
            <Iconify icon="eva:heart-fill" width={16} sx={{ mr: 0.5 }} />
            {likes}
          </Stack>
          <Stack direction="row" alignItems="center">
            <Iconify icon="eva:message-circle-fill" width={16} sx={{ mr: 0.5 }} />
            {comments}
          </Stack>
          <Stack direction="row" alignItems="center">
            <Iconify icon="solar:eye-bold" width={16} sx={{ mr: 0.5 }} />
            {views}
          </Stack>
          <Stack direction="row" alignItems="center">
            <Button variant="outlined" color="primary" onClick={handleClick}>
              View
            </Button>
          </Stack>
        </Stack>
      </CardActions>
    </Card>
  );
};

CardForum.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  content: PropTypes.string,
  date: PropTypes.string,
  user: PropTypes.string,
  category: PropTypes.string,
  likes: PropTypes.number,
  comments: PropTypes.number,
  views: PropTypes.number,
  formation: PropTypes.bool,
  starred: PropTypes.bool,
};

export default CardForum;
