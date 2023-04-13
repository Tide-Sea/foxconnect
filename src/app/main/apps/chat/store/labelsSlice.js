import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';

export const getLabelOptions = createAsyncThunk(
  'chatApp/labels/getLabelOptions',
  async (params, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    const { organizationId } = getState().organization;
    const response = await axios.get(`/api/${organizationId}/chat/labelOptions`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.data;

    return data;
  }
);

const labelsAdapter = createEntityAdapter({});

export const { selectAll: selectLabels, selectById: selectLabelById } = labelsAdapter.getSelectors(
  (state) => state.chatApp.labels
);

const labelsSlice = createSlice({
  name: 'chatApp/labels',
  initialState: labelsAdapter.getInitialState(),
  extraReducers: {
    [getLabelOptions.fulfilled]: labelsAdapter.setAll,
  },
});

export default labelsSlice.reducer;
