import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';

import { selectPermission } from 'app/store/permissionSlice';
import { selectChannel } from '../store/channelSlice';
import ChannelsContext from '../ChannelsContext';

const NewChannel = () => {
  const { setRightSidebarOpen, rightSidebarOpen } = useContext(ChannelsContext);
  const channel = useSelector(selectChannel);
  const permission = useSelector(selectPermission);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!rightSidebarOpen) {
      setRightSidebarOpen(true);
    }
  }, [rightSidebarOpen, setRightSidebarOpen]);

  // if (!channel) {
  //   return <FuseLoading />;
  // }

  return (
    <div className="relative flex flex-col flex-auto items-center px-32 sm:px-24 mt-48">
      <div className="w-full max-w-3xl">
        <Typography className="w-full font-bold truncate" variant="h5">
          Connect your channel
        </Typography>
        <Typography className="w-full truncate" variant="body1">
          Select the Channel that you want to connect
        </Typography>

        <Divider className="mt-16 mb-24" />

        <List className="w-full m-0 p-0">
          <ListItem
            button
            component={NavLinkAdapter}
            to="/settings/channels/line/new/edit"
            onClick={() => {
              // handleMenuClose();
            }}
          >
            <ListItemAvatar>
              <Avatar src="assets/images/logo/LINE.png" alt="line" />
            </ListItemAvatar>
            <ListItemText primary="Connect LINE OA Channel" />
          </ListItem>
          <ListItem
            button
            component={NavLinkAdapter}
            to="/settings/channels/facebook/new/edit"
            onClick={() => {
              // handleMenuClose();
            }}
          >
            <ListItemAvatar>
              <Avatar src="assets/images/logo/Facebook.png" alt="line" />
            </ListItemAvatar>
            <ListItemText primary="Connect Facebook Messenger Channel" />
          </ListItem>
          <ListItem
            button
            component={NavLinkAdapter}
            to="/settings/channels/instagram/new/edit"
            onClick={() => {
              // handleMenuClose();
            }}
          >
            <ListItemAvatar>
              <Avatar src="assets/images/logo/Instagram.png" alt="line" />
            </ListItemAvatar>
            <ListItemText primary="Connect Instagram Channel" />
          </ListItem>
        </List>
      </div>
    </div>
  );
};

export default NewChannel;
