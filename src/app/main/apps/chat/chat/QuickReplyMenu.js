import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getReplies, selectReply, sendReply } from '../store/replySlice';
import { selectChat } from '../store/chatSlice';

const QuickReplyMenu = (props) => {
  const routeParams = useParams();

  const dispatch = useDispatch();
  const replies = useSelector(selectReply);
  const chat = useSelector(selectChat);
  const { className } = props;

  const [moreMenuEl, setMoreMenuEl] = useState(null);

  function handleMoreMenuClick(event) {
    setMoreMenuEl(event.currentTarget);
  }

  function handleMoreMenuClose(event) {
    setMoreMenuEl(null);
  }

  useEffect(() => {
    dispatch(getReplies());
  }, [dispatch]);

  return (
    <div className={className}>
      <IconButton
        aria-owns={moreMenuEl ? 'main-more-menu' : null}
        aria-haspopup="true"
        onClick={handleMoreMenuClick}
        size="large"
      >
        <FuseSvgIcon>material-outline:quickreply</FuseSvgIcon>
      </IconButton>
      <Popover
        id="quick-menu"
        anchorEl={moreMenuEl}
        open={Boolean(moreMenuEl)}
        onClose={handleMoreMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        maxWidth="lg"
      >
        <div className="flex flex-col flex-auto h-full w-full ">
          <Card sx={{ maxWidth: 345 }} className="rounded p-16">
            <CardHeader
              className="p-0"
              action={
                <IconButton aria-label="settings" component={Link} to="/settings/replies">
                  <FuseSvgIcon>heroicons-outline:cog</FuseSvgIcon>
                </IconButton>
              }
              title={<Typography variant="h6">Quick reply</Typography>}
            />

            <CardContent className="p-0 pt-8">
              {replies && replies.length > 0 ? (
                <List component="nav" aria-label="main mailbox folders">
                  {replies.map((item, index) => {
                    return (
                      <ListItem
                        button
                        onClick={() => {
                          dispatch(sendReply({ reply: item, chat }));
                          handleMoreMenuClose();
                        }}
                        key={index}
                      >
                        {item.response && (
                          <>
                            <ListItemIcon>
                              {item.response.length && item.response[0].type === 'text' && (
                                <FuseSvgIcon className="text-48" size={24} color="action">
                                  heroicons-outline:document-text
                                </FuseSvgIcon>
                              )}
                              {item.response.length && item.response[0].type === 'image' && (
                                <FuseSvgIcon className="text-48" size={24} color="action">
                                  heroicons-outline:photograph
                                </FuseSvgIcon>
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={item.name}
                              secondary={
                                item.response &&
                                item.response.length > 0 &&
                                item.response[0].type === 'text'
                                  ? JSON.parse(item.response[0].data).text
                                  : 'Image'
                              }
                            />
                          </>
                        )}
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <div className="flex flex-1 items-center justify-center h-full">
                  <Typography color="textSecondary" variant="body2">
                    There are no reply!
                  </Typography>
                </div>
              )}
            </CardContent>
            {/* <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions> */}
          </Card>
        </div>
      </Popover>
    </div>
  );
};

export default QuickReplyMenu;
