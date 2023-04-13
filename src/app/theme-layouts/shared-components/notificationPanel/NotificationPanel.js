import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import { dismissAll, dismissItem, selectOrderNotifications } from 'app/store/notificationsSlice';
import { useSnackbar } from 'notistack';
import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Alert from '@mui/material/Alert';
import NotificationCard from './NotificationCard';
// import { dismissAll, dismissItem } from './store/dataSlice';
import reducer from './store';
import {
  closeNotificationPanel,
  selectNotificationPanelState,
  toggleNotificationPanel,
} from './store/stateSlice';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background.default,
    width: 360,
  },
}));

const NotificationPanel = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const state = useSelector(selectNotificationPanelState);
  const notifications = useSelector(selectOrderNotifications);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // const [isTokenFound, setTokenFound] = useState(false);
  // const [userConsent, setUserConsent] = useState();
  function isPushNotificationSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // useEffect(() => {
  //   if (isPushNotificationSupported()) {
  //     if (!('Notification' in window)) {
  //       console.log('This browser does not support desktop notification');
  //     }

  //     // Let's check whether notification permissions have already been granted
  //     else if (Notification.permission === 'granted') {
  //       // If it's okay let's create a notification
  //       console.info('Notification permission granted. ', Notification.permission);
  //       setUserConsent(Notification.permission);
  //       // var notification = new Notification("Hi there!");
  //     }

  //     // Otherwise, we need to ask the user for permission
  //     else if (Notification.permission !== 'denied' || Notification.permission === 'default') {
  //       Notification.requestPermission(function (permission) {
  //         // If the user accepts, let's create a notification
  //         if (permission === 'granted') {
  //           console.info('Notification permission granted.');
  //           setUserConsent(Notification.permission);
  //           // var notification = new Notification("Hi there!");
  //         } else {
  //           console.info('Notification permission: ', Notification.permission);
  //         }
  //       });
  //     }
  //   } else {
  //     console.info('>> Notification are NOT supported by this browser.');
  //   }
  // }, []);

  // useEffect(() => {
  //   if (userConsent && userConsent === 'granted') {
  //     const { messaging } = firebaseService;

  //     firebaseService.getMessagingToken().then((currentToken) => {
  //       console.log('FCM currentToken ', currentToken);
  //       if (currentToken) {
  //         // Update Notification Token
  //         console.log('FCM saveSetting ');
  //         dispatch(
  //           saveSetting({
  //             setting: { token: currentToken },
  //           })
  //         );

  //         messaging.onMessage((payload) => {
  //           let isShowNotification = true;
  //           console.log('Message received. ', payload);
  //           // console.log(' window.location.pathname. ', window.location.pathname);
  //           const type = window.location.pathname.split('/');
  //           // console.log('type ', type);
  //           if (type.length > 3 && type[2]) {
  //             if (type[2].toLocaleLowerCase() === 'chat') {
  //               // path teamchat
  //               console.log('PATH chat');
  //               console.log('PAYLOAD type ', payload.data.type);
  //               if (
  //                 payload.data.type &&
  //                 (payload.data.type.toLocaleLowerCase() === 'chat' ||
  //                   payload.data.type.toLocaleLowerCase() === 'message' ||
  //                   payload.data.type.toLocaleLowerCase() === 'comment')
  //               ) {
  //                 isShowNotification = false;
  //               }
  //             }
  //             if (type[2].toLocaleLowerCase() === 'teamchat') {
  //               // path teamchat
  //               console.log('PATH teamchat');
  //               console.log('PAYLOAD type ', payload.data.type);
  //               if (payload.data.type && payload.data.type.toLocaleLowerCase() === 'teamchat') {
  //                 isShowNotification = false;
  //               }
  //             }
  //             if (type[2].toLocaleLowerCase() === 'kanbanboard') {
  //               // path teamchat
  //               console.log('PATH kanbanboard');
  //               console.log('PAYLOAD type ', payload.data.type);
  //               if (payload.data.type && payload.data.type.toLocaleLowerCase() === 'scrumboard') {
  //                 isShowNotification = false;
  //               }
  //             }
  //           }
  //           // const pathname = window.location.pathname
  //           dispatch(getNotifications());
  //           if (payload && payload.messageId && isShowNotification) {
  //             enqueueSnackbar(payload.title, {
  //               key: payload.messageId,
  //               // eslint-disable-next-line react/no-unstable-nested-components
  //               content: () => (
  //                 <NotificationTemplate
  //                   item={payload}
  //                   onClose={() => {
  //                     closeSnackbar(payload.messageId);
  //                   }}
  //                 />
  //               ),
  //             });
  //           }
  //         });
  //       }
  //     });
  //   }
  // }, [closeSnackbar, dispatch, enqueueSnackbar, userConsent]);

  useEffect(() => {
    if (state) {
      dispatch(closeNotificationPanel());
    }
    // eslint-disable-next-line
  }, [location, dispatch]);

  function handleClose() {
    dispatch(closeNotificationPanel());
  }

  function handleDismiss(id) {
    dispatch(dismissItem(id));
  }
  function handleDismissAll() {
    dispatch(dismissAll());
  }

  // function demoNotification() {
  //   const item = NotificationModel({ title: 'Great Job! this is awesome.' });

  //   enqueueSnackbar(item.title, {
  //     key: item.id,
  //     // autoHideDuration: 3000,
  //     content: () => (
  //       <NotificationTemplate
  //         item={item}
  //         onClose={() => {
  //           closeSnackbar(item.id);
  //         }}
  //       />
  //     ),
  //   });

  //   dispatch(addNotification(item));
  // }

  return (
    <StyledSwipeableDrawer
      open={state}
      anchor="right"
      onOpen={(ev) => {}}
      onClose={(ev) => dispatch(toggleNotificationPanel())}
      disableSwipeToOpen
    >
      <IconButton className="m-4 absolute top-0 right-0 z-999" onClick={handleClose} size="large">
        <FuseSvgIcon color="action">heroicons-outline:x</FuseSvgIcon>
      </IconButton>

      {!isPushNotificationSupported() && (
        <Alert className="mx-16 mt-56" severity="warning">
          Push Notification are NOT supported
        </Alert>
      )}

      {notifications ? (
        <FuseScrollbars className="p-16">
          <div className="flex flex-col">
            <div className="flex justify-between items-end pt-48 mb-36">
              <Typography className="text-28 font-semibold leading-none">Notifications</Typography>
              <Typography
                className="text-12 underline cursor-pointer"
                color="secondary"
                onClick={handleDismissAll}
              >
                dismiss all
              </Typography>
            </div>
            {notifications.map((item) => (
              <NotificationCard
                key={item.id}
                className="mb-16"
                item={item}
                onClose={handleDismiss}
              />
            ))}
          </div>
        </FuseScrollbars>
      ) : (
        <div className="flex flex-1 items-center justify-center p-16">
          <Typography className="text-24 text-center" color="text.secondary">
            There are no notifications for now.
          </Typography>
        </div>
      )}
      {/* <div className="flex items-center justify-center py-16">
        <Button size="small" variant="outlined" onClick={demoNotification}>
          Create a notification example
        </Button>
      </div> */}
    </StyledSwipeableDrawer>
  );
};

export default withReducer('notificationPanel', reducer)(memo(NotificationPanel));
