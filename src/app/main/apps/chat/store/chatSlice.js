import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';
import history from '@history';
import { resolvedChat } from './chatsSlice';
import { getMessages } from './messagesSlice';

export const getChat = createAsyncThunk(
  'chatApp/chat/getChat',
  async ({ chatId }, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    const { organizationId } = getState().organization;
    try {
      const response = await axios.get(`/api/${organizationId}/chat`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: chatId,
        },
      });

      const data = await response.data;

      return data;
    } catch (error) {
      console.error('Get Chat error ', error);
      dispatch(
        showMessage({
          message: 'Get Chat error',
          variant: 'error',
        })
      );
      return {};
    }
  }
);

export const updateChat = createAsyncThunk(
  'chatApp/chat/updateChat',
  async (chat, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const { organizationId } = getState().organization;
      const response = await axios.put(
        `/api/${organizationId}/chat`,
        { chat },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const chatResult = await response.data;
      dispatch(showMessage({ message: 'Chat Updated', variant: 'success' }));
      return chatResult;
    } catch (error) {
      console.error('Update ChatSs error ', error);
      dispatch(showMessage({ message: 'Update Chat error', variant: 'error' }));
      return {};
    }
  }
);

export const updateChatStatus = createAsyncThunk(
  'chatApp/chat/updateChatStatus',
  async (chat, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const { organizationId } = getState().organization;
      const response = await axios.put(
        `/api/${organizationId}/chat/status`,
        { chat },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const chatResult = await response.data;
      dispatch(showMessage({ message: 'Chat Updated', variant: 'success' }));
      console.log('chat ', chat);
      if (chat.status === 'resolved') {
        dispatch(resolvedChat(chat.id));
        history.push('/apps/chat');
      }
      // dispatch(getChat({ chatId: chat.id }));
      return chatResult;
    } catch (error) {
      console.error('Update ChatSs error ', error);
      dispatch(showMessage({ message: 'Update Chat error', variant: 'error' }));
      return {};
    }
  }
);

export const updateChatOwner = createAsyncThunk(
  'chatApp/chat/updateChatOwner',
  async (chat, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const { organizationId } = getState().organization;
      const response = await axios.put(
        `/api/${organizationId}/chat/owner`,
        { chat },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const chatResult = await response.data;
      dispatch(showMessage({ message: 'Chat Updated', variant: 'success' }));
      // dispatch(getChat({ chatId: chat.id }));
      return chatResult;
    } catch (error) {
      console.error('Update ChatSs error ', error);
      dispatch(showMessage({ message: 'Update Chat error', variant: 'error' }));
      return {};
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chatApp/chat/sendMessage',
  async ({ messageText, chatId }, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const { organizationId } = getState().organization;
      const response = await axios.post(
        `/api/${organizationId}/chat/sendMessage`,
        {
          chatId,
          message: {
            data: JSON.stringify({ text: messageText }),
            type: 'text',
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const chatResult = await response.data;
      dispatch(getMessages({ chatId }));
      return chatResult;
    } catch (error) {
      console.error('[chatApp/chats/sendMessage] ', error);
      dispatch(
        showMessage({
          message: 'Send message error',
          variant: 'error',
        })
      );
      return null;
    }
  }
);

export const sendFileMessage = createAsyncThunk(
  'chatApp/chat/sendFileMessage',
  async ({ formData, chat }, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const { organizationId } = getState().organization;
      console.log('sendFileMessage ', chat);
      // Upload File
      const fileUploadResponse = await axios.post(
        `/api/${organizationId}/chat/uploads/${chat.channelId}/${chat.customerId}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const fileResponseResult = await fileUploadResponse.data;
      console.log('fileResponseResult ', fileResponseResult);

      // wait file upload 3sec
      return setTimeout(async () => {
        console.log('send ', fileResponseResult.fileName);
        console.log('send ', chat);
        try {
          const response = await axios.post(
            `/api/${organizationId}/chat/sendMessage`,
            {
              chatId: chat.id,
              message: {
                data: JSON.stringify({ filename: fileResponseResult.fileName }),
                type: 'image',
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const sendImageMsgResponse = await response.data;

          console.log('sendImageMsgResponse', sendImageMsgResponse);

          // dispatch(getChat({ chatId: chat.id }));
          dispatch(getMessages({ chatId: chat.id }));
          return sendImageMsgResponse;
        } catch (error) {
          console.log('error send Image Message', error);
          return {};
        }
      }, 3000);
    } catch (error) {
      console.error('[chatApp/chat/sendFileMessage] ', error);
      return null;
    }
  }
);

const chatSlice = createSlice({
  name: 'chatApp/chat',
  initialState: null,
  reducers: {
    removeChat: (state, action) => null,
  },
  extraReducers: {
    [getChat.fulfilled]: (state, action) => action.payload,
    [updateChat.fulfilled]: (state, action) => action.payload,
    [updateChatOwner.fulfilled]: (state, action) => {
      state.ownerId = action.payload.ownerId;
    },
    // [updateChat.fulfilled]: (state, action) => {
    //   console.log('state ', state);
    //   console.log('action.payload ', action.payload);
    //   state = { ...state, ...action.payload };
    // },
    // [updateTeamChat.fulfilled]: (state, action) => action.payload,
    // [sendMessage.fulfilled]: (state, action) => [...state, action.payload],
  },
});

export const selectChat = ({ chatApp }) => chatApp.chat;

export const { removeChat } = chatSlice.actions;

export default chatSlice.reducer;
