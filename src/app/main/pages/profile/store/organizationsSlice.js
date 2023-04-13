import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';

export const getOrganizations = createAsyncThunk(
  'profilePage/organizations/getOrganizations',
  async () => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    const response = await axios.get('/api/organizations', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.data;

    return data;
  }
);

// const organizationsAdapter = createEntityAdapter({});

export const selectOrganization = ({ profilePage }) => profilePage.organizations;

const organizationsSlice = createSlice({
  name: 'profilePage/organizations',
  initialState: null,
  reducers: {},
  extraReducers: {
    [getOrganizations.pending]: (state, action) => null,
    [getOrganizations.fulfilled]: (state, action) => action.payload,
  },
});

// export const {} = organizationsSlice.actions;

export default organizationsSlice.reducer;
