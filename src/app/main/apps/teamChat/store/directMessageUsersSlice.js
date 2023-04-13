/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';
import { updateNavigationItem } from 'app/store/fuse/navigationSlice';

export const getUsers = createAsyncThunk(
  'teamchatApp/directMessageUsers/getUsers',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const { organizationId } = getState().organization;
      const response = await axios.get(`/api/${organizationId}/teamChat/getDirectMessageUsers`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      dispatch(showMessage({ message: 'Get Users error', variant: 'error' }));
      throw error;
    }
  }
);

export const getNavigationUsers = createAsyncThunk(
  'teamchatApp/getNavigationDirectMessageUsers',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const { organizationId } = getState().organization;
      const response = await axios.get(
        `/api/${organizationId}/teamChat/getNavigationDirectMessageUsers`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const users = await response.data;
      if (users) {
        await dispatch(
          updateNavigationItem('directMessages', {
            children: users.map((user) => {
              if (user.unread > 0) {
                return {
                  id: `directMessages.${user.userId}`,
                  title: user.display,
                  type: 'item',
                  profile: user,
                  url: `apps/teamChat/dm/${user.userId}`,
                  badge: {
                    title: user.unread,
                    bg: '#8180E7',
                    fg: '#FFFFFF',
                  },
                };
              }
              return {
                id: `directMessages.${user.userId}`,
                title: user.display,
                type: 'item',
                profile: user,
                url: `apps/teamChat/dm/${user.userId}`,
                badge: null,
              };
            }),
          })
        );
      } else {
        dispatch(
          updateNavigationItem('directMessages', {
            children: null,
          })
        );
      }
    } catch (error) {
      dispatch(showMessage({ message: 'Get Users error', variant: 'error' }));
      throw error;
    }
  }
);

const directMessageUsersAdapter = createEntityAdapter({});

export const { selectAll: selectUsers, selectById: selectUserById } =
  directMessageUsersAdapter.getSelectors((state) => state.teamchatApp.directMessageUsers);

const directMessageUsersSlice = createSlice({
  name: 'teamchatApp/directMessageUsers',
  initialState: directMessageUsersAdapter.getInitialState({
    isOpen: true,
  }),
  reducers: {
    toggleIsOpen: (state, action) => {
      state.isOpen = !state.isOpen;
    },
  },
  extraReducers: {
    [getUsers.fulfilled]: directMessageUsersAdapter.setAll,
  },
});

export const { toggleIsOpen } = directMessageUsersSlice.actions;
export default directMessageUsersSlice.reducer;
