import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import firebase from 'firebase/compat/app';
import axios from 'axios';

export const getMessages = createAsyncThunk(
  'chatApp/messages/getMessages',
  async ({ chatId, page, size }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    const { organizationId } = getState().organization;
    const _page = page || 0;
    const _size = size || 0;
    try {
      const response = await axios.get(`/api/${organizationId}/chat/messages/${chatId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: _page,
          size: _size,
        },
      });
      const result = await response.data;
      return result.data;
    } catch (error) {
      console.error('Get Messages error ', error);
      return [];
    }
  }
);

const messagesAdapter = createEntityAdapter({});

export const { selectAll: selectMessages, selectById: selectMessageById } =
  messagesAdapter.getSelectors((state) => state.chatApp.messages);

const messagesSlice = createSlice({
  name: 'chatApp/messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    addSendingMessage: messagesAdapter.addOne,
  },
  extraReducers: {
    [getMessages.fulfilled]: messagesAdapter.setAll,
  },
});

export const { addSendingMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
