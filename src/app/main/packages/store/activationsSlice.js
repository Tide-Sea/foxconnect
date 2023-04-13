import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';
import firebase from 'firebase/compat/app';
import { addActivation, updateActivation } from './activationSlice';

export const getActivations = createAsyncThunk(
  'packagesApp/activations/getActivations',
  async () => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    const response = await axios.get('/api/activations', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.data;

    return { data };
  }
);

const activationsAdapter = createEntityAdapter({});

export const selectSearchText = ({ packagesApp }) => packagesApp.activations.searchText;

export const { selectAll: selectActivations, selectById: selectActivationsById } =
  activationsAdapter.getSelectors((state) => state.packagesApp.activations);

export const selectFilteredActivations = createSelector(
  [selectActivations, selectSearchText],
  (activations, searchText) => {
    if (searchText.length === 0) {
      return activations;
    }
    return FuseUtils.filterArrayByString(activations, searchText);
  }
);

const activationsSlice = createSlice({
  name: 'packagesApp/activations',
  initialState: activationsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setActivationsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [updateActivation.fulfilled]: activationsAdapter.upsertOne,
    [addActivation.fulfilled]: activationsAdapter.addOne,
    [getActivations.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      activationsAdapter.setAll(state, data);
      state.searchText = '';
    },
  },
});
export const { setActivationsSearchText } = activationsSlice.actions;

export default activationsSlice.reducer;
