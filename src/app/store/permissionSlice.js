import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getPermission = createAsyncThunk(
  'permission/getPermission',
  async (role, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const response = await axios.get(`/api/permission/${role}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const permission = await response.data;
      return permission;
    } catch (error) {
      dispatch(showMessage({ message: 'Get Permission error', variant: 'error' }));
      throw error;
    }
  }
);

const initialState = {};

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    clearPermission: (state, action) => initialState,
    setPermission: (state, action) => action.payload,
  },
  extraReducers: {
    [getPermission.pending]: (state, action) => null,
    [getPermission.fulfilled]: (state, action) => action.payload,
  },
});
export const selectPermission = ({ permission }) => permission;

export const { clearPermission, setPermission } = permissionSlice.actions;

export default permissionSlice.reducer;
