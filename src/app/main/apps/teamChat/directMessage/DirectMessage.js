import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import clsx from 'clsx';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import { lighten, styled } from '@mui/material/styles';
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material/';

import { selectUser } from 'app/store/userSlice';
import { ContactAvatar } from 'app/shared-components/chat';
import {
  getMessage,
  selectDirectMessage,
  sendDirectMessage,
  sendFileMessage,
} from '../store/directMessageSlice';
import DirectMessageMoreMenu from './DirectMessageMoreMenu';
import TeamChatAppContext from '../TeamChatAppContext';
import DirectFeatureMenu from './featureMenu-D/featureMenu-D';
import { getDmReplies, selectThreadData } from '../store/threadSlice';
import VideoPlayer from '../components/videoPlayer';
import FileViewer from '../components/fileViewer';
import TextViewer from '../components/textViewer';
import ImageViewer from '../components/imageViewer';
import ReplyMessage from '../components/replyMessage';

const StyledMessageRow = styled('div')(({ theme, isuser }) => ({
  // eslint-disable-next-line no-nested-ternary
  color: isuser ? (theme.palette.mode === 'light' ? '#677489' : '#ffffff') : '#677489',
  // eslint-disable-next-line no-nested-ternary
  outlineColor: isuser ? (theme.palette.mode === 'light' ? '#ebeff5' : '#ffffff') : '#ebeff5',

  '& .text-field-channel':
    theme.palette.mode === 'dark'
      ? {
          width: 'fit-content',
          background: 'rgba(0, 0, 0, 0.2) !important',
        }
      : {
          width: 'fit-content',
        },
  '&.contact': {
    justifyContent: 'flex-start',
    '& .hiddenAvatar': {
      visibility: 'hidden',
    },
    '& .bubble': {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.contrastText,
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      '& .time': {
        marginLeft: 12,
      },
      '& .replies': {
        flexDirection: 'row-reverse',
        '& .reply': {
          marginRight: 5,
        },
      },
    },
    '& .bubble-D': {
      '& .time': {
        marginLeft: 12,
      },
      '& .replies': {
        flexDirection: 'row-reverse',
        '& .reply': {
          marginRight: 5,
        },
      },
    },
    '&.first-of-group': {
      '& .bubble': {
        borderTopLeftRadius: 20,
      },
    },
    '&.last-of-group': {
      '& .bubble': {
        borderBottomLeftRadius: 20,
      },
    },
  },
  '&.me': {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    '& .MuiAvatar-root': {
      display: 'none',
    },
    '& .bubble': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      borderRadius: 10,
      '& .time': {
        justifyContent: 'flex-end',
      },
      '& .replies': {
        '& .reply': {
          marginLeft: 5,
        },
      },
    },

    '& .bubble-D': {
      '& .time': {
        justifyContent: 'flex-end',
      },
      '& .replies': {
        '& .reply': {
          marginLeft: 5,
        },
      },
    },

    '&.first-of-group': {
      '& .bubble': {
        borderRadius: 10,
      },
    },

    '&.last-of-group': {
      '& .bubble': {
        borderRadius: 10,
      },
    },
  },
  '&.first-of-group': {
    '& .bubble': {
      borderTopLeftRadius: 20,
      paddingTop: 13,
    },
  },
  '&.last-of-group': {
    '& .bubble': {
      borderBottomLeftRadius: 20,
      paddingBottom: 13,
      marginBottom: 40,
      '& .time': {
        display: 'flex',
      },
    },
    '& .bubble-D': {
      paddingBottom: 13,
      marginBottom: 40,
      '& .time': {
        display: 'flex',
      },
    },
  },
  '&.isReplies': {
    marginBottom: 20,
  },
}));

const DirectMessage = (props) => {
  const dispatch = useDispatch();
  const { contactId } = useParams();
  const {
    setMainSidebarOpen,
    setMemberSidebarOpen,
    setContactSidebarOpen,
    setThreadSidebarOpen,
    setHqPinSidebarOpen,
    setCmPinSidebarOpen,
  } = useContext(TeamChatAppContext);

  const directMessage = useSelector(selectDirectMessage);
  const loginUser = useSelector(selectUser);
  const replies = useSelector(selectThreadData);
  const [messageText, setMessageText] = useState('');
  const [fileLoading, setFileLoading] = useState(false);

  const messageRef = useRef(null);

  useEffect(() => {
    if (contactId) {
      dispatch(getMessage({ contactId }));
      setMemberSidebarOpen(false);
      setHqPinSidebarOpen(false);
      setCmPinSidebarOpen(false);
      dispatch(getDmReplies());
    }
  }, [contactId, dispatch, setCmPinSidebarOpen, setHqPinSidebarOpen, setMemberSidebarOpen]);

  function scrollToBottom() {
    if (!messageRef.current) {
      return;
    }
    messageRef.current.scrollTo({
      top: messageRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }

  function isFirstMessageOfGroup(item, i) {
    return (
      i === 0 ||
      (directMessage.messages[i - 1] &&
        directMessage.messages[i - 1].sendUser?.id !== item.sendUser.id)
    );
  }

  function isLastMessageOfGroup(item, i) {
    if (i === directMessage.messages.length - 1) {
      return true;
    }
    if (directMessage.messages[i + 1]) {
      if (directMessage.messages[i + 1].sendUser?.id !== item.sendUser.id) {
        return true;
      }
    }
    return false;
  }

  function onMessageSubmit(ev) {
    ev.preventDefault();
    if (messageText.trim() === '') {
      return;
    }
    setMessageText('');

    dispatch(
      sendDirectMessage({
        messageText,
        receiveUser: contactId,
      })
    ).then(() => {
      setMessageText('');
    });
    scrollToBottom();
  }

  const handleFileInput = (event) => {
    setFileLoading(true);
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    dispatch(sendFileMessage({ formData, receiveUser: contactId })).then(() => {
      setTimeout(() => {
        setFileLoading(false);
      }, 4000);
    });
  };

  function onInputChange(ev) {
    setMessageText(ev.target.value);
  }

  function onEnterPress(e) {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      onMessageSubmit(e);
    }
  }

  if (!contactId || !directMessage) {
    return null;
  }

  return (
    <>
      <Box
        className="w-full border-b-1"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? lighten(theme.palette.background.default, 0.4)
              : lighten(theme.palette.background.default, 0.02),
        }}
      >
        <Toolbar className="flex items-center justify-between pl-10 pr-24 min-h-60 w-full">
          <div className="flex items-center">
            <IconButton
              aria-label="Open drawer"
              onClick={() => setMainSidebarOpen(true)}
              className="flex lg:hidden"
              size="large"
            >
              <FuseSvgIcon>heroicons-outline:chat</FuseSvgIcon>
            </IconButton>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                setContactSidebarOpen(true);
                setMemberSidebarOpen(false);
              }}
              onKeyDown={() => {
                setContactSidebarOpen(true);
                setMemberSidebarOpen(false);
              }}
              role="button"
              tabIndex={0}
            >
              {directMessage && directMessage.contact && (
                <>
                  <ContactAvatar
                    contact={directMessage.contact}
                    className="w-[3.5rem] h-[3.5rem]"
                  />
                  <Typography
                    color="inherit"
                    className="text-16 font-semibold px-4 truncate max-w-200"
                  >
                    {directMessage.contact.display}
                  </Typography>
                </>
              )}
            </div>
          </div>
          <DirectMessageMoreMenu className="-mx-8" messages={directMessage.messages} />
        </Toolbar>
      </Box>

      <div className="flex flex-auto h-full min-h-0 w-full">
        <div className={clsx('flex flex-1 z-10 flex-col relative', props.className)}>
          <FuseScrollbars ref={messageRef} className="flex flex-1 flex-col overflow-y-auto">
            {directMessage.messages && directMessage.messages.length > 0 && (
              <div className="flex flex-col w-full pt-16 pl-10 pr-24 pb-40">
                {directMessage.messages.map((item, i) => {
                  const messageObj = JSON.parse(item.data);
                  if (!item?.sendUser?.id) {
                    return null;
                  }
                  return (
                    <>
                      <StyledMessageRow
                        id={item.id}
                        key={i}
                        className={clsx(
                          'flex grow-0 shrink-0 items-start justify-end relative chat-row -translate-x-1/2 left-1/2 max-w-[950px]',
                          item.sendUser.id === loginUser.uuid ? 'me' : 'contact',
                          item.isDelete ? 'pb-8' : 'pb-4',
                          { 'first-of-group': isFirstMessageOfGroup(item, i) },
                          { 'last-of-group': isLastMessageOfGroup(item, i) },
                          !item.isReply && i + 1 === directMessage.messages.length && 'pb-96'
                        )}
                      >
                        <Avatar
                          src={item.sendUser.pictureURL}
                          alt={item.sendUser.display}
                          className={clsx('w-[3rem] h-[3rem] mr-10', {
                            hiddenAvatar: !isFirstMessageOfGroup(item, i),
                          })}
                        />
                        {item.isDelete ? (
                          <StyledMessageRow
                            className={clsx(
                              'bubble-D flex relative items-center justify-center p-10 text-field-channel rounded-r-full rounded-l-full outline'
                            )}
                            isuser={item.sendUser.id === loginUser.uuid ? 1 : 0}
                          >
                            <Typography>{messageObj.text}</Typography>
                            <Typography
                              className={clsx(
                                'time absolute hidden w-full text-11 mt-8 ltr:left-0 rtl:right-0 bottom-0 whitespace-nowrap -mb-24'
                              )}
                              color="textSecondary"
                            >
                              {isLastMessageOfGroup(item, i) &&
                                item.sendUser &&
                                `By: ${item.sendUser.display} @ `}
                              {formatDistanceToNow(new Date(item.createdAt), {
                                addSuffix: true,
                              })}
                            </Typography>
                          </StyledMessageRow>
                        ) : (
                          <div
                            className={clsx(
                              'bubble flex relative items-center justify-center p-10 max-w-640 shadow text-field-channel'
                            )}
                          >
                            {item.type && item.type === 'text' && <TextViewer item={item} />}
                            {item.type && item.type === 'image' && <ImageViewer item={item} />}
                            {item.type && item.type === 'video' && <VideoPlayer item={item} />}
                            {item.type && item.type === 'file' && <FileViewer item={item} />}
                            {item.isEdit ? (
                              <Typography className="text-12 text-grey-300 ml-5">
                                (Edited)
                              </Typography>
                            ) : null}
                            <Typography
                              className={clsx(
                                'time absolute hidden w-full text-11 mt-8 ltr:left-0 rtl:right-0 bottom-0 whitespace-nowrap -mb-24'
                              )}
                              color="textSecondary"
                            >
                              {isLastMessageOfGroup(item, i) &&
                                item.sendUser &&
                                `By: ${item.sendUser.display} @ `}
                              {formatDistanceToNow(new Date(item.createdAt), {
                                addSuffix: true,
                              })}
                            </Typography>
                          </div>
                        )}
                        {!item.isDelete && (
                          <DirectFeatureMenu
                            item={item}
                            loginUser={loginUser}
                            directMessage={directMessage}
                            contactId={contactId}
                          />
                        )}
                      </StyledMessageRow>
                      {!item.isDelete && item.isReply && (
                        <ReplyMessage
                          item={item}
                          replies={replies}
                          loginUser={loginUser}
                          messages={directMessage.messages}
                        />
                      )}
                    </>
                  );
                })}
              </div>
            )}
          </FuseScrollbars>
          {directMessage && directMessage.messages && (
            <Paper
              square
              component="form"
              autoComplete="off"
              onSubmit={onMessageSubmit}
              className="absolute border-t-1 bottom-0 right-0 left-0 py-16 px-16"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
            >
              <div className="flex items-center relative max-w-[950px] left-1/2 -translate-x-1/2">
                {fileLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <IconButton size="large" component="label">
                    <input
                      hidden
                      accept="image/gif, image/png, image/jpeg, video/mp4, application/pdf, application/msword, application/vnd.ms-excel,application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                      application/vnd.openxmlformats-officedocument.presentationml.slideshow,
                      application/vnd.openxmlformats-officedocument.presentationml.presentation"
                      onChange={handleFileInput}
                      type="file"
                    />
                    <FuseSvgIcon>heroicons-outline:paper-clip</FuseSvgIcon>
                  </IconButton>
                )}

                <InputBase
                  multiline
                  maxRows={2}
                  autoFocus={false}
                  id="message-input"
                  className="flex-1 flex grow shrink-0 h-44 mx-8 px-16 border-2 rounded-full"
                  placeholder="Type your message"
                  onChange={onInputChange}
                  value={messageText}
                  disabled={fileLoading}
                  sx={{ backgroundColor: 'background.paper' }}
                  onKeyDown={onEnterPress}
                />
                <IconButton className="" onClick={onMessageSubmit} size="large">
                  <FuseSvgIcon className="rotate-90" color="action">
                    heroicons-outline:paper-airplane
                  </FuseSvgIcon>
                </IconButton>
              </div>
            </Paper>
          )}
        </div>
      </div>
    </>
  );
};

export default DirectMessage;
