import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';

import { showMessage } from 'app/store/fuse/messageSlice';

// import { getChat } from './chatSlice';
import { getChats } from './chatsSlice';
// import { getHistory } from './historySlice';
import { getHistories } from './historiesSlice';

export const getCustomer = createAsyncThunk(
  'chatApp/customers/getCustomer',
  async ({ customerId }, { dispatch, getState }) => {
    try {
      if (!customerId) return null;
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const { organizationId } = getState().organization;
      const response = await axios.get(`/api/${organizationId}/customer`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: customerId,
        },
      });
      const customer = await response.data;
      return customer;
    } catch (error) {
      dispatch(showMessage({ message: 'Get Customer error', variant: 'error' }));
      return null;
    }
  }
);

export const getCustomerLabelOption = createAsyncThunk(
  'chatApp/customers/getCustomerLabelOption',
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
      const labelOptions = await response.data;
      return labelOptions;
    } catch (error) {
      dispatch(showMessage({ message: 'Get Label Option', variant: 'error' }));
      return [];
    }
  }
);

export const createCustomerLabel = createAsyncThunk(
  'chatApp/customers/getCustomerLabelOption',
  async (labelList, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const { organizationId } = getState().organization;
      const response = await axios.post(
        `/api/${organizationId}/customer/label`,
        { label: labelList },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const labelOption = await response.data;
      dispatch(getCustomerLabelOption());
      return labelOption;
    } catch (error) {
      dispatch(showMessage({ message: 'Get Label Option', variant: 'error' }));
      return [];
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'chatApp/customers/updateCustomer',
  async (customer, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { organizationId } = getState().organization;
      const response = await axios.put(
        `/api/${organizationId}/customer`,
        { customer },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const customerResult = await response.data;
      dispatch(getCustomerLabelOption());

      setCustomer(customerResult);
      // const { selected, selectType, listType } = getState().chatApp.current;
      // if (selectType === 'chat') {
      // const chatId = getState().chatApp.chat.id;
      const { chatListType, labelFilter } = getState().chatApp.chats;
      // dispatch(getChat({ chatId }));
      dispatch(getChats({ chatListType, labelFilter }));
      // }
      // if (selectType === 'history') {
      // const historyId = getState().chatApp.history.id;
      // dispatch(getHistory({ historyId }));
      dispatch(getHistories());
      // }

      dispatch(showMessage({ message: 'Customer Updated', variant: 'success' }));
      return customerResult;
    } catch (error) {
      dispatch(showMessage({ message: 'Update Customer error', variant: 'error' }));
      return {};
    }
  }
);

const customerSlice = createSlice({
  name: 'chatApp/customers',
  initialState: null,
  reducers: {
    setCustomer: (state, action) => action.payload,
  },
  extraReducers: {
    [getCustomer.fulfilled]: (state, action) => action.payload,
    // [getCustomerLabelOption.fulfilled]: (state, action) => {
    //   state.labelOptions = action.payload;
    // },
    [updateCustomer.fulfilled]: (state, action) => action.payload,
    // [deleteLabel.fulfilled]: (state, action) => {
    //   state.labelOptions = action.payload;
    // },
  },
});

export const selectCustomer = ({ chatApp }) => chatApp.customer;
export const selectLabelOptions = ({ chatApp }) => chatApp.customer.labelOptions;

export const { setCustomer } = customerSlice.actions;

export default customerSlice.reducer;
