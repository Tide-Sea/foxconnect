import {
  AppBar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';

import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { showMessage } from 'app/store/fuse/messageSlice';
import _ from '@lodash';

import { selectUser } from 'app/store/userSlice';
import ChatAppContext from '../ChatAppContext';
import { selectUsers } from '../store/usersSlice';
import { selectChat, updateChat, updateChatOwner, updateChatStatus } from '../store/chatSlice';

export const ChatOwnerSetting = (props) => {
  const dispatch = useDispatch();
  const chat = useSelector(selectChat);
  const { uuid } = useSelector(selectUser);
  const userOptions = useSelector(selectUsers);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectMenuItem = (value) => {
    handleClose();
    if (value && value.id) {
      dispatch(
        updateChatOwner({
          id: chat.id,
          ownerId: value.id,
        })
      );
    }
  };

  const owner = userOptions.find((option) => option.id === chat.ownerId);

  return (
    <>
      {/* Chat Owner */}
      <Button
        id="chat-owner-button"
        aria-controls={open ? 'chat-owner-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
        color="inherit"
        size="small"
        className="rounded border-gray"
        disabled={chat.status && chat.status === 'resolved'}
      >
        <Typography className="capitalize font-medium">
          {owner && owner.display ? owner.display : 'Owner'}
        </Typography>
      </Button>
      <Menu
        id="chat-owner-menu"
        aria-labelledby="chat-owner-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {userOptions.map((value, index) => (
          <MenuItem
            key={index}
            value={value}
            disabled={chat.ownerId === value.id}
            onClick={() => {
              handleSelectMenuItem(value);
            }}
          >
            {value.display}
            {uuid && value.id === uuid && '(Me)'}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export const ChatStatusSetting = (props) => {
  const dispatch = useDispatch();

  const chat = useSelector(selectChat);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (status) => {
    handleClose();
    dispatch(
      updateChatStatus({
        id: chat.id,
        status,
      })
    );
  };

  return (
    <>
      {/* Chat Status */}
      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
        size="small"
        className="rounded border-gray"
        disabled={chat.status && chat.status === 'resolved'}
      >
        <Typography className="capitalize font-medium">
          {chat.status ? chat.status : 'Status'}
        </Typography>
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem key={1} value="open" onClick={() => handleStatusChange('open')}>
          Open
        </MenuItem>
        <MenuItem key={2} value="Resolved" onClick={() => handleStatusChange('resolved')}>
          Resolved
        </MenuItem>
      </Menu>
    </>
  );
};

export const TicketDetailSetting = () => {
  const dispatch = useDispatch();
  const chat = useSelector(selectChat);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
  });
  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    if (dialogOpen) {
      reset({
        ticketDetail: chat.description,
      });
    }
    return () => {
      reset({
        ticketDetail: '',
      });
    };
  }, [dialogOpen, chat, reset]);

  function onSubmit(data) {
    dispatch(
      updateChat({
        id: chat.id,
        description: data.ticketDetail,
      })
    )
      .then(() => {
        setDialogOpen(false);
        dispatch(
          showMessage({
            message: 'Ticket Detail success!',
            autoHideDuration: 1000,
            variant: 'success',
          })
        );
      })
      .catch((error) => {
        console.error('[TicketDetailSetting] error ', error.message);
        dispatch(
          showMessage({
            message: 'Ticket Detail fail!',
            autoHideDuration: 2000,
            variant: 'error',
          })
        );
      });
  }

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        className="rounded border-gray"
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        Edit Ticket Topic
      </Button>

      {/* Ticket Detail */}
      <Dialog
        fullWidth
        maxWidth="xs"
        className="m-24"
        onClose={() => {
          setDialogOpen(false);
        }}
        aria-labelledby="simple-dialog-title"
        open={dialogOpen}
      >
        <AppBar position="static" elevation={0}>
          <Toolbar className="flex w-full">
            <Typography className="capitalize font-medium">Ticket Detail</Typography>
          </Toolbar>
        </AppBar>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col md:overflow-hidden"
        >
          <DialogContent classes={{ root: 'p-24' }}>
            <div className="flex">
              <Controller
                control={control}
                name="ticketDetail"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-8"
                    label="Ticket Detail"
                    id="ticketDetail"
                    error={!!errors.name}
                    helperText={errors?.name?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />
            </div>
          </DialogContent>

          <DialogActions className="justify-between p-4 pb-16">
            <div className="px-16">
              <Button
                variant="contained"
                size="small"
                color="secondary"
                type="submit"
                disabled={_.isEmpty(dirtyFields) || !isValid}
              >
                Save
              </Button>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export const ChatFollowupSetting = (props) => {
  const dispatch = useDispatch();
  const chat = useSelector(selectChat);

  const handleFollowup = async (e) => {
    dispatch(
      updateChat({
        id: chat.id,
        followup: e.target.checked,
      })
    );
  };
  const handleSpam = async (e) => {
    dispatch(
      updateChat({
        id: chat.id,
        spam: e.target.checked,
      })
    );
  };
  const handleArchived = async (e) => {
    dispatch(
      updateChat({
        id: chat.id,
        archived: e.target.checked,
      })
    );
  };

  return (
    <div className="flex flex-col" style={{ margin: '10px' }}>
      <FormControlLabel
        control={
          <Checkbox
            disabled={chat.status && chat.status === 'resolved'}
            size="small"
            checked={chat.archived}
            onChange={handleArchived}
            inputProps={{
              'aria-label': 'primary checkbox',
            }}
          />
        }
        label="Archived Chat"
      />
      <FormControlLabel
        control={
          <Checkbox
            disabled={chat.status && chat.status === 'resolved'}
            size="small"
            checked={chat.followup}
            onChange={handleFollowup}
            inputProps={{
              'aria-label': 'primary checkbox',
            }}
          />
        }
        label="Follow-Up"
      />
      <FormControlLabel
        control={
          <Checkbox
            disabled={chat.status && chat.status === 'resolved'}
            size="small"
            checked={chat.spam}
            onChange={handleSpam}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        }
        label="Spam"
      />
    </div>
  );
};

// export const OpenHistoryButton = (props) => {
//   const chat = useSelector(selectChat);
//   return (
//     <>
//       {/* Button Open Chat history */}
//       <Button
//         component={Link}
//         variant="outlined"
//         className="rounded border-gray"
//         to={`/apps/chat/${chat.id}/history`}
//         onClick={props.onClose}
//       >
//         <Typography className="capitalize font-medium">Open History</Typography>
//       </Button>
//     </>
//   );
// };

export const OpenCommentButton = (props) => {
  const { handleClose } = props;
  const { handleCommentSidebarOpen } = useContext(ChatAppContext);
  return (
    <>
      {/*  Button Open Comments Sidebar */}
      <Button
        onClick={() => {
          handleClose();
          setTimeout(() => {
            handleCommentSidebarOpen();
          }, 100);
        }}
        variant="outlined"
        size="small"
        className="rounded border-gray"
      >
        <Typography className="capitalize font-medium">Comments</Typography>
      </Button>
    </>
  );
};
