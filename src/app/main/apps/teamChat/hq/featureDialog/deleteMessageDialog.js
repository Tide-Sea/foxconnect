import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  Typography,
} from '@mui/material';

import { selectUser } from 'app/store/userSlice';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import clsx from 'clsx';
import { selectMessages, setDeleteMessage } from '../../store/hqSlice';
import TextViewer from '../../components/textViewer';
import FileViewer from '../../components/fileViewer';
import VideoPlayer from '../../components/videoPlayer';

const StyledMessageRow = styled('div')(({ theme }) => ({
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
    '& .bubble': {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.contrastText,
      '& .time': {
        marginLeft: 12,
      },
    },
  },
  '&.me': {
    flexDirection: 'row-reverse',

    '& .bubble': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      '& .time': {
        justifyContent: 'flex-end',
      },
    },
  },
}));

const DeleteMessageDialog = (props) => {
  const { open, onClose, item } = props;
  const messages = useSelector(selectMessages);
  const messageObj = JSON.parse(item.data);

  const dispatch = useDispatch();
  const loginUser = useSelector(selectUser);

  if (!item) return null;
  return (
    <Dialog open={open} onClose={onClose} className="create-channel-modal" fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography className="text-20 pb-5">Delete Message?</Typography>
        <Typography className="text-14 pb-10">
          Are you sure you want to delete this message?
        </Typography>
      </DialogTitle>
      <DialogContent>
        <StyledMessageRow
          className={clsx(
            'flex grow-0 shrink-0 items-start relative p-16 border-2 rounded-12',
            item.createdBy.id === loginUser.uuid ? 'me' : 'contact'
          )}
        >
          <div
            className={clsx(
              'bubble flex flex-col relative justify-center p-10 max-w-full shadow pb-14 mb-20 rounded-12'
            )}
          >
            {item.type && item.type === 'text' && <TextViewer item={item} />}

            {item.type && item.type === 'image' && (
              <img
                src={messageObj.url}
                alt={messageObj.id}
                className="max-w-xs h-auto cursor-pointer"
              />
            )}

            {item.type && item.type === 'video' && <VideoPlayer item={item} />}
            {item.type && item.type === 'file' && <FileViewer item={item} />}

            <Typography
              className="time absolute flex w-full text-11 mt-8 -mb-24 ltr:left-0 rtl:right-0 bottom-0 whitespace-nowrap"
              color="textSecondary"
            >
              {`By: ${item.createdBy.display} @ `}
              {formatDistanceToNow(new Date(item.createdAt), {
                addSuffix: true,
              })}
            </Typography>
          </div>
        </StyledMessageRow>
      </DialogContent>
      <DialogActions className="px-20 pb-16">
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="text"
          className="bg-[#FF110D] hover:bg-[#DF0B07] whitespace-nowrap px-10 text-[#ffffff]"
          onClick={() => {
            dispatch(
              setDeleteMessage({
                id: item.id,
                data: { text: 'This message has been deleted...' },
                isDelete: true,
              })
            );
            onClose();
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMessageDialog;
