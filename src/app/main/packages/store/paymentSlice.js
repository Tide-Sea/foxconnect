import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';

export const getPayment = createAsyncThunk(
  'packagesApp/payment/getPayment',
  async (id, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const response = await axios.get(`/api/activation/payment/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data;

      return data;
    } catch (error) {
      return null;
    }
  }
);

export const selectPayment = ({ packagesApp }) => packagesApp.payment;

const activationSlice = createSlice({
  name: 'packagesApp/payment',
  initialState: null,
  extraReducers: {
    [getPayment.pending]: (state, action) => null,
    [getPayment.fulfilled]: (state, action) => action.payload,
  },
});

export default activationSlice.reducer;
