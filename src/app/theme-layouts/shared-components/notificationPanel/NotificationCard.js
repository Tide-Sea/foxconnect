import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
// import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
// import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import history from '@history';
import { styled } from '@mui/material/styles';

const SmallIcon = styled(Avatar)(({ theme }) => ({
  width: 24,
  height: 24,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const NotificationCard = (props) => {
  const { item, className } = props;
  const variant = item?.variant || '';

  const [historyPath, setHistoryPath] = useState();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [picture, setPicture] = useState();
  const [icon, setIcon] = useState();

  const handleClose = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    if (props.onClose) {
      props.onClose(item.id);
    }
  };
  const handleRedirect = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    if (historyPath) {
      history.push({ pathname: historyPath });
    }
  };

  const handleDismiss = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    if (historyPath) {
      history.push({ pathname: historyPath });
    }
  };

  useMemo(() => {
    console.log('Notification Chat', item);
    if (item) {
      if (item.data) {
        // set redirect path
        if (item.data.recordType && item.data.recordId) {
          if (item.data.recordType === 'chat') {
            setHistoryPath(`/apps/chat/${item.data.recordId}`);
          } else if (item.data.recordType === 'channel') {
            setHistoryPath(`/apps/teamChat/${item.data.recordId}`);
          } else if (item.data.recordType === 'directChannel') {
            setHistoryPath(`/apps/teamChat/dm/${item.data.recordId}`);
          } else if (item.data.recordType === 'hq') {
            setHistoryPath(`/apps/teamChat/hq`);
          } else if (item.data.recordType === 'scrumboard') {
            setHistoryPath(`/apps/kanbanboard/boards/${item.data.recordId}`);
          }
        }

        // set picture
        //
        if (item.data.customer && item.data.customer.picture) {
          setPicture(item.data.customer.picture);
        }
      }

      // set title
      if (item.type === 'chat') {
        setTitle('Chat Inbox');
        setIcon('heroicons-outline:chat-alt');
        // set body
        if (item.event) {
          if (item.event === 'newChat') {
            if (item.data && item.data.customer && item.data.customer.display) {
              setBody(`You have a new chat from <b>${item.data.customer.display}</b>`);
            } else {
              setBody('You have a new chat');
            }
          } else if (item.event === 'newMessage') {
            const messageCount = (item.data && item.data.newMessage) || 0;
            if (messageCount > 1) {
              if (item.data && item.data.customer && item.data.customer.display) {
                setBody(
                  `You have a ${messageCount} new message from <b>${item.data.customer.display}</b>`
                );
              } else {
                setBody(`You have a ${messageCount} new message`);
              }
            } else if (item.data && item.data.customer && item.data.customer.display) {
              setBody(`You have a new message from <b>${item.data.customer.display}</b>`);
            } else {
              setBody('You have a new message');
            }
          } else if (item.event === 'newOwner') {
            if (item.data && item.data.requester && item.data.requester.display) {
              setBody(`You have been assigned to chat <b>${item.data.requester.display}</b>`);
            } else {
              setBody(`You have been assigned to chat`);
            }
          } else if (item.event === 'newMention') {
            if (item.data && item.data.requester && item.data.requester.display) {
              setBody(
                `You have a new mention in chat comment from <b>${item.data.requester.display}</b>`
              );
            } else {
              setBody(`You have a new mention in chat comment`);
            }
          }
        }
      } else if (item.type === 'teamchat') {
        setTitle('Team Chat');
        setIcon('heroicons-outline:chat-alt-2');
        if (item.event) {
          if (item.event === 'addMember') {
            if (item.data && item.data.requester && item.data.requester.display) {
              setBody(`You have been added to channel by <b>${item.data.requester.display}</b>`);
            } else {
              setBody('You have been added to channel');
            }
          } else if (item.event === 'newHQMessage') {
            const messageCount = (item.data && item.data.newMessage) || 0;
            if (messageCount > 1) {
              setBody(`You have a ${messageCount} new message in General Chat`);
            } else {
              setBody('You have a new message in General Chat');
            }
          } else if (item.event === 'newChannelMessage') {
            const messageCount = (item.data && item.data.newMessage) || 0;
            if (messageCount > 1) {
              setBody(`You have a ${messageCount} new message in Channel`);
            } else {
              setBody('You have a new message in Channel');
            }
          } else if (item.event === 'newDirectMessage') {
            const messageCount = (item.data && item.data.newMessage) || 0;
            if (messageCount > 1) {
              setBody(`You have a ${messageCount} new direct message`);
            } else {
              setBody('You have a new direct message');
            }
          } else if (item.event === 'newChannelMention') {
            if (item.data && item.data.requester && item.data.requester.display) {
              setBody(
                `You have a new mention in channel from <b>${item.data.requester.display}</b>`
              );
            } else {
              setBody(`You have a new mention in channel`);
            }
          } else if (item.event === 'newHQMention') {
            if (item.data && item.data.requester && item.data.requester.display) {
              setBody(
                `You have a new mention in General Chat from <b>${item.data.requester.display}</b>`
              );
            } else {
              setBody(`You have a new mention in General Chat`);
            }
          }
        }
      } else if (item.type === 'scrumboard' || item.type === 'kanbanboard') {
        setTitle('Kanban Board');
        setIcon('heroicons-outline:view-boards');
        if (item.event) {
          if (item.event === 'newCardMember') {
            if (item.data && item.data.requester && item.data.requester.display) {
              setBody(`You have been added to card by <b>${item.data.requester.display}</b>`);
            } else {
              setBody('You have been added to card');
            }
          } else if (item.event === 'newCardMention') {
            if (item.data && item.data.requester && item.data.requester.display) {
              setBody(
                `You have a new mention in card comment from <b>${item.data.requester.display}</b>`
              );
            } else {
              setBody(`You have a new mention in card comment`);
            }
          }
        }
      }
    }
  }, [item]);

  return (
    <Card
      className={clsx(
        'flex items-center relative w-full rounded-8 p-14 min-h-64 shadow space-x-8',
        variant === 'success' && 'bg-green-600 text-white',
        variant === 'info' && 'bg-blue-700 text-white',
        variant === 'error' && 'bg-red-600 text-white',
        variant === 'warning' && 'bg-orange-600 text-white',
        className
      )}
      elevation={0}
      component={item.useRouter ? NavLinkAdapter : 'div'}
      role="button"
      onClick={handleRedirect}
    >
      {icon && !picture && (
        <Box
          sx={{ backgroundColor: 'background.default' }}
          className="flex shrink-0 items-center justify-center w-48 h-48 mr-12 rounded-full"
        >
          <FuseSvgIcon className="opacity-75" color="inherit">
            {icon}
          </FuseSvgIcon>
        </Box>
      )}

      {picture && (
        <img
          className="shrink-0 w-48 h-48 mr-12 rounded-full overflow-hidden object-cover object-center"
          src={picture}
          alt="Notification"
        />
      )}

      <div className="flex flex-col flex-auto">
        {title && <Typography className="font-bold line-clamp-1">{title}</Typography>}

        {body && <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: body }} />}

        <div className="flex flex-row w-full justify-between mt-8">
          {/* {item.organization && item.organization.name && item.organization.name.length > 15 && (
            <Tooltip title={item.organization.name} arrow>
              <Chip
                size="small"
                className="w-min my-1 rounded"
                label={`${item.organization.name.substring(0, 15)}...`}
              />
            </Tooltip>
          )}
          {item.organization && item.organization.name && item.organization.name.length <= 15 && (
            <Chip size="small" className="w-min my-1 rounded" label={`${item.organization.name}`} />
          )}

          {item.createdAt && (
            <Typography className="whitespace-nowra font-medium text-12" color="text.secondary">
              {format(new Date(item.createdAt), 'PP')}
            </Typography>
          )} */}
          {item.organization && item.organization.name && (
            <Chip size="small" className="w-min my-1 rounded" label={`${item.organization.name}`} />
          )}
        </div>
        {item.createdAt && (
          <Typography className="whitespace-nowra font-medium text-12 mt-8" color="text.secondary">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </Typography>
        )}
      </div>

      <IconButton
        disableRipple
        className="top-0 right-0 absolute p-8"
        color="inherit"
        onClick={handleClose}
      >
        <FuseSvgIcon size={24} className="opacity-40" color="inherit">
          heroicons-solid:x
        </FuseSvgIcon>
      </IconButton>
      {item.children}
    </Card>
  );
};

export default NotificationCard;
