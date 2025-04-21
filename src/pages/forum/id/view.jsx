import { useEffect, useState } from "react";
import { useParams } from "src/routes/hooks";
import Api from "src/utils/api";
import { Divider, Typography, Card, CardContent, Button, CardHeader, Chip, Skeleton, IconButton, TextField, useTheme, CardActions, Avatar } from "@mui/material";
import moment from "moment";
import Iconify from "src/components/iconify";
import ModalDeleteConfirmation from "src/components/modals/deleteConfirmation";
import toast from "react-hot-toast";
import { useMockedUser } from "src/hooks/use-mocked-user";
import ProfileAvatar from "src/pages/profile/components/Avatar";
import { ForumMarkdown } from "../components/forumMarkdown";
import StarredChip from "../components/starredChip";
import FormationChip from "../components/formationChip";

const ForumIdView = () => {
    const [forum, setForum] = useState({});
    const [comments, setComments] = useState([]);
    const [reply, setReply] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState('');
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [formationStep, setFormationStep] = useState(0);
    const content = formationStep === 0 ? forum.str_content : forum.steps?.[formationStep - 1]?.content;

    const { id } = useParams();
    const theme = useTheme();
    const { user } = useMockedUser();
    useEffect(() => {
        Api.get(`/forum/${id}`).then((response) => {
            setForum(response)
            Api.get(`/forum/${id}/actions/reply`).then((responseReply) => {
                setComments(responseReply);
                setLoaded(true);
            });
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleLike = () => {
        Api.post(`/forum/${id}/actions/like`).then((response) => {
            setForum(response);
        });
    }

    const handleUnlike = () => {
        Api.post(`/forum/${id}/actions/unlike`).then((response) => {
            setForum(response);
        });
    }

    const handleComment = () => {
        if (reply === '' || reply.length < 5) {
            setError('Reply is too short')
            return;
        }
        Api.post(`/forum/${id}/actions/reply`, {
            str_reply: reply
        }).then((response) => {
            setComments(response);
            setReply('');
        });
    }

    const handleDelete = () => {
        setOpenModalDelete(true);
    }

    const handleAccept = () => {
        Api.post(`/admin/formation/${id}/accept`).then(() => {
            window.history.back();
        });
    }

    const handleStar = () => {
        Api.post(`/admin/forum/${id}/star`).then((response) => {
            toast.success("Forum starred");
            setForum((prev) => ({
                ...prev,
                bl_starred: 1
            }))
        });
    }

    if (!loaded) {
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Skeleton variant="text" width={100} height={30} />
                        <Skeleton variant="text" width={200} height={30} />
                    </div>
                    <div>
                        <Skeleton variant="rectangular" width={200} height={40} />
                    </div>
                </div>
                <Typography variant="caption">
                    <Skeleton variant="text" width={100} height={20} />
                </Typography>
                <Divider sx={{ mb: 5, mt: 2 }} />
                <Card>
                    <CardHeader action={<Avatar />}>
                        <Skeleton variant="text" width={100} height={20} />
                    </CardHeader>
                    <CardContent>
                        <Skeleton variant="text" width={200} height={20} />
                        <Skeleton variant="rectangular" height={200} />
                        <Divider sx={{ mt: 2, mb: 2 }} />
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div />
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                                <Skeleton variant="text" width={40} height={20} />
                                <Skeleton variant="text" width={40} height={20} />
                                <Skeleton variant="text" width={40} height={20} />
                                <Skeleton variant="text" width={40} height={20} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card sx={{ mt: 2 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Replies ({comments.length})
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <div>
                            <Typography variant="body1" gutterBottom>
                                No replies yet
                            </Typography>
                        </div>
                    </CardContent>
                </Card>
            </div >
        );
    }

    const renderReplies = (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Replies ({comments.length})
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <div>
                    {comments.length === 0 ? (
                        <Typography variant="body1" gutterBottom>
                            No replies yet
                        </Typography>
                    ) : comments.map((comment, index) => (
                        <Card key={index} sx={{ mt: 2, mb: 2, backgroundColor: theme.palette.background.default }}>
                            <CardContent>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Typography variant="body1" gutterBottom>
                                        {comment.str_reply}
                                    </Typography>
                                    <ProfileAvatar user={comment.user} size="small" showUsername linkTo />
                                </div>
                                <Typography variant="caption" color="text.secondary">
                                    {moment(comment.date_creation).fromNow()}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Divider sx={{ mt: 2, mb: 2 }} />
                <div>
                    <TextField label="Reply" variant="outlined" fullWidth multiline onChange={(e) => setReply(e.target.value)} value={reply} />
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleComment}>
                        Reply
                    </Button>
                </div>
                <Typography variant="caption" color="error" sx={{ mt: 5 }}>
                    {error}
                </Typography>
            </CardContent>
        </Card>
    )

    const renderHeader = (
        <>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {!!forum.bl_starred &&
                        <StarredChip />
                    }
                    {forum.bl_formation &&
                        <FormationChip />
                    }
                    <Chip
                        variant="soft"
                        label={forum.category?.str_title}
                        color="info"
                        sx={{
                            marginRight: 1,
                        }}
                    />
                    <Typography variant="h4" gutterBottom>
                        {forum.str_title}
                    </Typography>
                </div>
                <div>
                    {forum.bl_formation && forum.date_formation === null && (
                        <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={handleAccept}>
                            Accept
                        </Button>
                    )}
                    {!forum.bl_starred && !!user.bl_admin && (
                        <Button variant="contained" color="warning" sx={{ mr: 2 }} onClick={handleStar}>
                            Star
                        </Button>
                    )}
                    <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => {
                        window.history.back();
                    }}>
                        Close
                    </Button>
                    {/* <Button variant="contained" color="warning" sx={{ mr: 2 }}>
                        Edit
                    </Button> */}
                    {user.id_user === forum.id_user && (
                        <Button variant="contained" color="error" onClick={handleDelete}>
                            Delete
                        </Button>
                    )}
                </div>
            </div>
            <Typography variant="caption" gutterBottom>
                {moment(forum.date_creation).fromNow()}
            </Typography>
            {forum.bl_starred ? (
                <div>
                    <Typography variant="caption" gutterBottom>
                        Starred {moment(forum.date_starred).fromNow()}
                    </Typography>
                </div>
            ) : null}
            <Divider sx={{ mb: 5, mt: 2 }} />
        </>
    );

    return (
        <div>
            <ModalDeleteConfirmation open={openModalDelete}
                onClose={() => setOpenModalDelete(false)}
                onClick={() => {
                    Api.delete(`/forum/${id}`).then(() => {
                        window.history.back();
                    });
                }}
                itemTitle={forum.str_title}
            />
            {renderHeader}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                {forum.bl_formation && (
                    <Card>
                        <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1rem' }}>
                            <Button
                                color="primary"
                                onClick={() => setFormationStep(0)}
                                variant={formationStep === 0 ? 'contained' : null}
                            >
                                Main
                            </Button>
                            {forum.steps.map((step, index) => (
                                <Button
                                    key={index}
                                    color="primary"
                                    variant={formationStep === index + 1 ? 'contained' : null}
                                    onClick={() => setFormationStep(index + 1)}
                                >
                                    {step.title || `Step ${index + 1}`}
                                </Button>
                            ))}
                        </div>
                    </Card>
                )}
                <Card sx={{
                    width: '100%',
                    marginLeft: forum.bl_formation ? "1rem" : null,
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    border: forum.bl_starred ? 1 : null,
                    borderColor: forum.bl_starred ? "rgba(255, 215, 0, 0.5)" : null,
                }}>

                    <CardHeader action={<ProfileAvatar user={forum.user} size="small" showUsername linkTo />} />
                    <CardContent>
                        <ForumMarkdown content={content} />
                    </CardContent>
                    <div>
                        <Divider sx={{ mt: 2, mb: 2 }} />
                        <CardActions sx={{ paddingBottom: 2, justifyContent: 'flex-end' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                                <IconButton onClick={forum.likes?.user_liked ? handleUnlike : handleLike}>
                                    <Iconify icon="mdi:heart" style={{ color: forum.likes?.user_liked ? 'red' : null, cursor: 'pointer', "&:hover": { color: 'red' } }} />
                                </IconButton>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{forum.likes?.count}</Typography>
                                <IconButton>
                                    <Iconify icon="mdi:comment" />
                                </IconButton>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{comments.length}</Typography>
                                <IconButton disableRipple sx={{ cursor: 'default' }}>
                                    <Iconify icon="mdi:eye" />
                                </IconButton>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{forum.views?.count}</Typography>
                            </div>
                        </CardActions>
                    </div>
                </Card>
            </div>
            {renderReplies}
        </div >
    );
}

export default ForumIdView;