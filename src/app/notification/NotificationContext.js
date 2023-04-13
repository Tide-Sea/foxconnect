import { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { clearNotification, getNotifications, updateFCMToken } from 'app/store/notificationsSlice';
import NotificationTemplate from 'app/theme-layouts/shared-components/notificationPanel/NotificationTemplate';
import { useAuth } from '../auth/AuthContext';
import firebaseService from '../auth/services/firebaseService';

const NotificationContext = createContext({});

const NotificationProvider = (props) => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [tabHasFocus, setTabHasFocus] = useState(true);

  const [userConsent, setUserConsent] = useState();
  function isPushNotificationSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  const isShowNotification = (notificationType) => {
    // console.log('[notificationType]', notificationType);
    // console.log(' window.location.pathname. ', window.location.pathname);
    const type = window.location.pathname.split('/');
    // console.log('type ', type);
    console.log('type[2] ', type[2].toLocaleLowerCase());
    console.log('[notificationType]', notificationType.toLocaleLowerCase());

    if (notificationType && type.length > 2 && type[2]) {
      return !(
        type[2].toLocaleLowerCase() === notificationType.toLocaleLowerCase() ||
        (type[2].toLocaleLowerCase() === 'kanbanboard' &&
          notificationType.toLocaleLowerCase() === 'scrumboard')
      );
    }
    return true;
  };
  useEffect(() => {
    if (isPushNotificationSupported()) {
      if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification');
      }
      // Let's check whether notification permissions have already been granted
      else if (Notification.permission === 'granted') {
        // If it's okay let's create a notification
        console.info('Notification permission granted. ', Notification.permission);
        setUserConsent(Notification.permission);
        // var notification = new Notification("Hi there!");
      }

      // Otherwise, we need to ask the user for permission
      else if (Notification.permission !== 'denied' || Notification.permission === 'default') {
        Notification.requestPermission(function (permission) {
          // If the user accepts, let's create a notification
          if (permission === 'granted') {
            console.info('Notification permission granted.');
            setUserConsent(Notification.permission);
            // var notification = new Notification("Hi there!");
          } else {
            console.info('Notification permission: ', Notification.permission);
          }
        });
      }
    } else {
      console.info('>> Notification are NOT supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (userConsent && userConsent === 'granted') {
      const { messaging } = firebaseService;

      firebaseService.getMessagingToken().then((currentToken) => {
        console.log('[FCM Token]', currentToken);
        if (currentToken) {
          dispatch(updateFCMToken(currentToken));
          messaging.onMessage((payload) => {
            console.log('[FCM Message received]', payload);
            console.log('messageId', payload.messageId);
            dispatch(getNotifications());
            if (payload && payload.messageId && isShowNotification(payload.data.type)) {
              const data = JSON.parse(payload.data.data);
              const organization = JSON.parse(payload.data.organization);
              const createdAt = new Date(payload.data.createdAt);
              const notification = { ...payload.data, createdAt, data, organization };
              enqueueSnackbar(payload.title, {
                key: payload.messageId,
                // eslint-disable-next-line react/no-unstable-nested-components
                content: () => (
                  <NotificationTemplate
                    item={notification}
                    onClose={() => {
                      closeSnackbar(payload.messageId);
                    }}
                  />
                ),
              });
            }
          });
        }
      });
    }
  }, [dispatch, userConsent]);

  const handleFocus = () => {
    console.log('Tab has focus');
    setTabHasFocus(true);
  };
  const handleBlur = () => {
    console.log('Tab lost focus');
    setTabHasFocus(false);
  };
  useEffect(() => {
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(getNotifications());
    }
    return () => {
      dispatch(clearNotification());
    };
  }, [auth, dispatch]);

  return <NotificationContext.Provider>{props.children}</NotificationContext.Provider>;
};

export { NotificationProvider };
export default NotificationContext;
