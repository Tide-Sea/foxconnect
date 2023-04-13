import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getCustomerLabels = createAsyncThunk(
  'customersApp/customers/getCustomerLabels',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const { organizationId } = getState().organization;
      const response = await axios.get(`/api/${organizationId}/customer/label/list`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const labelOption = await response.data;
      return labelOption;
    } catch (error) {
      dispatch(showMessage({ message: 'Get Label Option', variant: 'error' }));
      return [];
    }
  }
);

export const createCustomerLabel = createAsyncThunk(
  'customersApp/customers/createCustomerLabel',
  async (labels, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const { organizationId } = getState().organization;
      const response = await axios.post(
        `/api/${organizationId}/customer/label`,
        { labels },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const labelOption = await response.data;
      dispatch(getCustomerLabels());
      return labelOption;
    } catch (error) {
      dispatch(showMessage({ message: 'Get Label Option', variant: 'error' }));
      return [];
    }
  }
);

const labelsAdapter = createEntityAdapter({});

export const { selectAll: selectLabels, selectById: selectLabelsById } = labelsAdapter.getSelectors(
  (state) => state.customersApp.labels
);

const labelsSlice = createSlice({
  name: 'customersApp/labels',
  initialState: labelsAdapter.getInitialState([]),
  reducers: {},
  extraReducers: {
    [getCustomerLabels.fulfilled]: labelsAdapter.setAll,
  },
});

export default labelsSlice.reducer;
