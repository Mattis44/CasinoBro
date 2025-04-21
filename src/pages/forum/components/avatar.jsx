import { Avatar, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const ForumAvatar = ({ name, avatar, }) => (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Avatar
            alt={name}
            src={avatar}
            sx={{
                width: 40,
                height: 40,
            }}
        >
            {name ? name.slice(0, 2)?.toUpperCase() : 'U'}
        </Avatar>
        <Typography variant="caption" gutterBottom sx={{ marginLeft: 1, mt: 2 }}>
            {name}
        </Typography>
    </div>
);


export default ForumAvatar;

ForumAvatar.propTypes = {
    name: PropTypes.string,
    avatar: PropTypes.string,
};