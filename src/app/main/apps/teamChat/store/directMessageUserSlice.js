import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';

export const getContact = createAsyncThunk(
  'teamchatApp/directMessageUser/getContact',
  async (contactId, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const { organizationId } = getState().organization;
      const response = await axios.get(`/api/${organizationId}/teamChat/getContact/${contactId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const contact = await response.data;
      return contact;
    } catch (error) {
      dispatch(showMessage({ message: 'Get Contact Info error', variant: 'error' }));
      return null;
    }
  }
);

const directMessageUserSlice = createSlice({
  name: 'teamchatApp/directMessageUser',
  initialState: {},
  reducers: {},
  extraReducers: {
    [getContact.fulfilled]: (state, action) => action.payload,
  },
});

export const selectDirectMessageUser = ({ teamchatApp }) => teamchatApp.directMessageUser;
export default directMessageUserSlice.reducer;
