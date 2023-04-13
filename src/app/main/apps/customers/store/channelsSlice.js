import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getChannels = createAsyncThunk(
  'customersApp/channels/getChannels',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const { organizationId } = getState().organization;
      const response = await axios.get(`/api/${organizationId}/channel/list`, {
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

const channelsAdapter = createEntityAdapter({});

export const { selectAll: selectChannels, selectById: selectChannelById } =
  channelsAdapter.getSelectors((state) => state.customersApp.channels);

const channelsSlice = createSlice({
  name: 'customersApp/channels',
  initialState: channelsAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [getChannels.fulfilled]: channelsAdapter.setAll,
  },
});

export const { setChannelsSearchText } = channelsSlice.actions;

export default channelsSlice.reducer;
