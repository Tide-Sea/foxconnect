import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';
import { updateNavigationItem } from './fuse/navigationSlice';

export const getOrganization = createAsyncThunk(
  'organization/getOrganization',
  async (organizationId, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const response = await axios.get(`/api/organization/${organizationId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const organization = await response.data;
      return organization;
    } catch (error) {
      dispatch(showMessage({ message: 'Get Organization error', variant: 'error' }));
      throw error;
    }
  }
);

export const getOrganizationState = createAsyncThunk(
  'organization/getOrganizationState',
  async (organizationId, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const response = await axios.get(`/api/organization/${organizationId}/state`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const isRead = await response.data;
      if (isRead.isRead.teamChat > 0) {
        dispatch(
          updateNavigationItem('apps.teamchat', {
            badge: {
              title: isRead.isRead.teamChat,
              bg: '#8180E7',
              fg: '#FFFFFF',
            },
          })
        );
      } else {
        dispatch(
          updateNavigationItem('apps.teamchat', {
            badge: null,
          })
        );
      }
    } catch (error) {
      dispatch(showMessage({ message: 'Get Organization error', variant: 'error' }));
      throw error;
    }
  }
);
const initialState = {};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    clearOrganization: (state, action) => initialState,
    setOrganization: (state, action) => action.payload,
  },
  extraReducers: {
    [getOrganization.fulfilled]: (state, action) => action.payload,
    [getOrganizationState.fulfilled]: (state, action) => {
      state.isRead = action.payload;
    },
  },
});
export const selectOrganization = ({ organization }) => organization;

export const { clearOrganization, setOrganization } = organizationSlice.actions;

export default organizationSlice.reducer;
