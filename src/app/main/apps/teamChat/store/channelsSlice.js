import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import history from '@history';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getOrganizationState } from 'app/store/organizationSlice';
// eslint-disable-next-line import/no-cycle
import { getMember } from './channelMemberSlice';

export const getChannels = createAsyncThunk(
  'teamchatApp/channels/getChannels',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const { organizationId } = getState().organization;
      const response = await axios.get(`/api/${organizationId}/teamChat/channel/list`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      dispatch(showMessage({ message: 'Get Channel List error', variant: 'error' }));
      throw error;
    }
  }
);

export const addTeamChannel = createAsyncThunk(
  'teamchatApp/channel/addTeamChannel',
  async (channelInfo, { dispatch, getState }) => {
    const { organizationId } = getState().organization;
    const { token } = await firebase.auth().currentUser.getIdTokenResult();

    const body = {
      channel: {
        name: channelInfo.channelName,
        description: channelInfo.channelDescription,
        members: channelInfo.channelMembers,
      },
    };

    try {
      const response = await axios.post(`/api/${organizationId}/teamChat/channel`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data[0];
      dispatch(showMessage({ message: 'Channel Created', variant: 'success' }));
      dispatch(getChannels());
      history.push({ pathname: `/apps/teamChat/${data.channelId}` });
      return data;
    } catch (error) {
      dispatch(showMessage({ message: error.response.data.error, variant: 'error' }));
      return null;
    }
  }
);

export const updateTeamChannel = createAsyncThunk(
  'teamchatApp/channel/updateTeamChannel',
  async (channelInfo, { dispatch, getState }) => {
    const { organizationId } = getState().organization;
    const { channel } = getState().teamchatApp;
    const body = {
      channel: {
        id: channelInfo.channelId,
        name: channelInfo.channelName,
        description: channelInfo.channelDescription,
        members: channelInfo.channelMembers,
      },
    };
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    try {
      const response = await axios.put(`/api/${organizationId}/teamChat/channel`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data;
      dispatch(showMessage({ message: 'Channel Updated', variant: 'success' }));
      dispatch(getChannels());
      dispatch(getMember({ channelId: channelInfo.channelId }));
      if (channel && channel.id) dispatch(getMember({ channelId: channel.id }));
      return data;
    } catch (error) {
      dispatch(showMessage({ message: 'Update channel error', variant: 'error' }));
      return null;
    }
  }
);

export const deleteChannel = createAsyncThunk(
  'teamchatApp/channel/deleteChannel',
  async ({ channelId }, { dispatch, getState }) => {
    if (channelId) {
      try {
        const { token } = await firebase.auth().currentUser.getIdTokenResult();
        const { organizationId } = getState().organization;

        const response = await axios.delete(
          `/api/${organizationId}/teamChat/channel/${channelId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(getOrganizationState(organizationId));
        dispatch(getChannels());
        return response.data;
      } catch (error) {
        dispatch(showMessage({ message: 'Get channel error', variant: 'error' }));
        return {};
      }
    }
    return {};
  }
);

const channelsAdapter = createEntityAdapter({});

export const { selectAll: selectChannels, selectById: selectChannelById } =
  channelsAdapter.getSelectors((state) => state.teamchatApp.channels);

const channelsSlice = createSlice({
  name: 'teamchatApp/channels',
  initialState: channelsAdapter.getInitialState({
    isOpen: true,
  }),
  reducers: {
    toggleIsOpen: (state, action) => {
      state.isOpen = !state.isOpen;
    },
  },
  extraReducers: {
    [getChannels.fulfilled]: channelsAdapter.setAll,
  },
});

export const { toggleIsOpen } = channelsSlice.actions;
export default channelsSlice.reducer;
