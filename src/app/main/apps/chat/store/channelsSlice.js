import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';

export const getChannels = createAsyncThunk(
  'chatApp/channels/getChannels',
  async (params, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    const { organizationId } = getState().organization;
    const response = await axios.get(`/api/${organizationId}/chat/channels`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.data;

    return data;
  }
);

const channelsAdapter = createEntityAdapter({});

export const { selectAll: selectChannels, selectById: selectChannelById } =
  channelsAdapter.getSelectors((state) => state.chatApp.channels);

const channelsSlice = createSlice({
  name: 'chatApp/channels',
  initialState: channelsAdapter.getInitialState(),
  extraReducers: {
    [getChannels.fulfilled]: channelsAdapter.setAll,
  },
});

export default channelsSlice.reducer;
