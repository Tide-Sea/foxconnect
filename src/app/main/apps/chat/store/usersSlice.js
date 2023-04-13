import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';

export const getUserOptions = createAsyncThunk(
  'chatApp/users/getUserOptions',
  async (params, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    const { organizationId } = getState().organization;
    const response = await axios.get(`/api/${organizationId}/chat/userOptions`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.data;

    return data;
  }
);

const usersAdapter = createEntityAdapter({});

export const { selectAll: selectUsers, selectById: selectUserById } = usersAdapter.getSelectors(
  (state) => state.chatApp.users
);

const usersSlice = createSlice({
  name: 'chatApp/users',
  initialState: usersAdapter.getInitialState(),
  extraReducers: {
    [getUserOptions.fulfilled]: usersAdapter.setAll,
  },
});

export default usersSlice.reducer;
