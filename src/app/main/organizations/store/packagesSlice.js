import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';

export const getPackages = createAsyncThunk('organizationsApp/packages/getPackages', async () => {
  const { token } = await firebase.auth().currentUser.getIdTokenResult();
  const response = await axios.get('/api/packages', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.data;

  return data;
});

const packagesAdapter = createEntityAdapter({});

export const { selectAll: selectPackages, selectById: selectPackagesById } =
  packagesAdapter.getSelectors((state) => state.organizationsApp.packages);

const packagesSlice = createSlice({
  name: 'organizationsApp/packages',
  initialState: packagesAdapter.getInitialState({}),
  reducers: {},
  extraReducers: {
    [getPackages.fulfilled]: packagesAdapter.setAll,
  },
});

export default packagesSlice.reducer;
