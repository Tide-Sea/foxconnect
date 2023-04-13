import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router-dom';

import firebase from 'firebase/compat/app';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

import { getChannels } from './store/channelsSlice';
import { getLabelOptions } from './store/labelsSlice';
import { getUserOptions } from './store/usersSlice';

import MainSidebar from './sidebars/main/MainSidebar';
import RightSidebarContent from './RightSidebarContent';
import ChatAppContext from './ChatAppContext';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-content': {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 100%',
    height: '100%',
  },
  '& .FusePageSimple-sidebarContent': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
}));

const ChatApp = (props) => {
  const dispatch = useDispatch();
  const { organizationId } = useSelector(({ organization }) => organization);
  const { chat } = useSelector(({ chatApp }) => chatApp);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [mainSidebarOpen, setMainSidebarOpen] = useState(!isMobile);
  const [customerSidebarOpen, setCustomerSidebarOpen] = useState(false);
  const [commentSidebarOpen, setCommentSidebarOpen] = useState(false);
  const [rightSidebar, setRightSidebar] = useState();
  const location = useLocation();
  const routeParams = useParams();

  const [token, setToken] = useState(null);
  const [tabHasFocus, setTabHasFocus] = useState(true);
  const [eventUpdate, setEventUpdate] = useState();

  useEffect(() => {
    dispatch(getChannels());
    dispatch(getUserOptions());
    dispatch(getLabelOptions());
  }, [dispatch]);

  useEffect(() => {
    const handleFocus = () => {
      console.log('Tab has focus');
      setTabHasFocus(true);
    };

    const handleBlur = () => {
      console.log('Tab lost focus');
      setTabHasFocus(false);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((idToken) => {
        setToken(idToken);
      });
    // return () => {
    //   if (organizationId) {
    //     console.info('[SSE] close Connection ', uuid);
    //     if (uuid) {
    //       try {
    //         axios.delete(`/api/sse/closes/${uuid}`);
    //       } catch (error) {
    //         console.info('[SSE] close Connection error: ', error);
    //       }
    //     }
    //   }
    // };
  }, []);

  useEffect(() => {
    setMainSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      if (routeParams.id) {
        setMainSidebarOpen(false);
      } else {
        setMainSidebarOpen(true);
      }
    }
  }, [location, isMobile, routeParams.id]);

  // SSE Connection
  useEffect(() => {
    // Init Event connection
    if (organizationId && token) {
      console.info('[SSE] Start Connecting');
      const events = new EventSource(
        `${process.env.REACT_APP_BACKEND_URL}/api/sse/events?authorization=${token}&organizationId=${organizationId}`
      );
      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        switch (parsedData.type) {
          case 'init-connection':
            console.info('[SSE] Init Connection Id: ', parsedData.processId);
            // setProcessId(parsedData.processId);
            break;
          default:
            console.log('[SSE] onMessage ', event.data);
            setEventUpdate(new Date());
        }
      };
    }
  }, [chat, organizationId, token]);

  const handleCommentSidebarOpen = useCallback(() => {
    setCustomerSidebarOpen(false);
    setCommentSidebarOpen(true);
  }, []);
  const handleCustomerSidebarOpen = useCallback(() => {
    setCustomerSidebarOpen(true);
    setCommentSidebarOpen(false);
  }, []);
  const handleRightSidebarClose = useCallback(() => {
    setCustomerSidebarOpen(false);
    setCommentSidebarOpen(false);
  }, []);

  const ChatAppProviderValue = useMemo(
    () => ({
      setMainSidebarOpen,
      customerSidebarOpen,
      commentSidebarOpen,
      handleCommentSidebarOpen,
      handleCustomerSidebarOpen,
      handleRightSidebarClose,
      tabHasFocus,
      eventUpdate,
    }),
    [
      setMainSidebarOpen,
      customerSidebarOpen,
      commentSidebarOpen,
      handleCommentSidebarOpen,
      handleCustomerSidebarOpen,
      handleRightSidebarClose,
      tabHasFocus,
      eventUpdate,
    ]
  );

  return (
    <ChatAppContext.Provider value={ChatAppProviderValue}>
      <Root
        content={<Outlet />}
        leftSidebarContent={<MainSidebar />}
        leftSidebarOpen={mainSidebarOpen}
        leftSidebarOnClose={() => {
          setMainSidebarOpen(false);
        }}
        leftSidebarWidth={400}
        rightSidebarContent={<RightSidebarContent />}
        rightSidebarOpen={Boolean(commentSidebarOpen || customerSidebarOpen)}
        rightSidebarOnClose={() => {
          setCustomerSidebarOpen(false);
          setCommentSidebarOpen(false);
        }}
        rightSidebarWidth={400}
        scroll="content"
      />
    </ChatAppContext.Provider>
  );
};

export default ChatApp;
