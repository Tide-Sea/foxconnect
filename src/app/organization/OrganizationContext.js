import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import {
  clearOrganization,
  getOrganizationState,
  setOrganization,
} from 'app/store/organizationSlice';
import { clearPermission, getPermission } from 'app/store/permissionSlice';
import history from '@history';
import { setRole } from 'app/store/userSlice';
import { useAuth } from '../auth/AuthContext';
import { getNavigationUsers } from '../main/apps/teamChat/store/directMessageUsersSlice';
import { getChats } from '../main/apps/chat/store/chatsSlice';

const OrganizationContext = React.createContext();

const OrganizationProvider = ({ children }) => {
  const location = useLocation();
  const [isOrganizationSelected, setIsOrganizationSelected] = useState(undefined);
  const [waitOrganizationCheck, setWaitOrganizationCheck] = useState(true);
  const dispatch = useDispatch();
  const auth = useAuth();

  useEffect(() => {
    const organization = window.localStorage.getItem('organization');

    if (auth.isAuthenticated && organization) {
      dispatch(setRole(JSON.parse(organization).role));
      setIsOrganizationSelected(true);
      dispatch(setOrganization(JSON.parse(organization)));
      dispatch(getPermission(JSON.parse(organization).role));
      dispatch(getOrganizationState(JSON.parse(organization).organizationId));
      dispatch(getNavigationUsers(JSON.parse(organization).organizationId));
      dispatch(getChats(JSON.parse(organization).organizationId));
    } else {
      setIsOrganizationSelected(false);
      dispatch(clearOrganization());
      dispatch(clearPermission());
      if (auth.isAuthenticated) {
        console.log('pathname ', window.location.pathname);
        const path = window.location.pathname.split('/');
        console.log('pathname ', path);
        if (!(path && path.length > 2 && path[1] === 'packages')) {
          history.push('/organizations');
        }

        //   setWaitAuthCheck(false);
        //   setIsAuthenticated(false);
      }
    }
    setWaitOrganizationCheck(false);
  }, [dispatch]);

  const setSelectOrganization = (organization) => {
    if (organization) {
      dispatch(setRole(organization.role));
      localStorage.setItem('organization', JSON.stringify(organization));
      dispatch(setOrganization(organization));
      dispatch(getPermission(organization.role));
      dispatch(getOrganizationState(organization.organizationId));
      dispatch(getNavigationUsers(organization.organizationId));
      dispatch(getChats(organization.organizationId));
    } else {
      dispatch(setRole('user'));
      localStorage.removeItem('organization');
      dispatch(clearOrganization());
      dispatch(clearPermission());
    }
  };

  const updateRole = (role) => {
    if (role) {
      const organizationLocalStorage = window.localStorage.getItem('organization');
      if (organizationLocalStorage) {
        const organization = JSON.parse(organizationLocalStorage);
        dispatch(setRole(role));
        localStorage.setItem('organization', JSON.stringify({ ...organization, role }));
        dispatch(setOrganization(organization));
        dispatch(getPermission(organization.role));
      }
    }
  };

  return waitOrganizationCheck ? (
    <FuseSplashScreen />
  ) : (
    <OrganizationContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        isOrganizationSelected,
        setSelectOrganization,
        updateRole,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

function useOrganization() {
  const context = React.useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within a OrganizationProvider');
  }
  return context;
}

export { OrganizationProvider, useOrganization };
