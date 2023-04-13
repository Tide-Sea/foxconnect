import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';

export const getActivations = createAsyncThunk(
  'organizationsApp/activations/getActivations',
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

export const addInviteCode = createAsyncThunk(
  'organizationsApp/activation/addActivation',
  async (newData, { dispatch, getState }) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    // const { organizationId } = getState().organization;
    const response = await axios.post(`/api/activation/invite`, newData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const activationResult = await response.data;

    return activationResult;
  }
);

const activationsAdapter = createEntityAdapter({});

export const { selectAll: selectActivations, selectById: selectActivationsById } =
  activationsAdapter.getSelectors((state) => state.organizationsApp.activations);

export const selectFilteredActiveActivations = createSelector(
  [selectActivations],
  (activations) => {
    return activations.filter((activation) => activation.status === 'active');
  }
);
export const selectFreeActiveActivations = createSelector([selectActivations], (activations) => {
  return activations.find((activation) => activation.package.isFree);
});

export const selectOrganizationsFreeSlot = createSelector(
  [selectFilteredActiveActivations],
  (activations) => {
    if (!activations || activations.length === 0) return 0;
    if (activations.filter((activation) => activation.package.organizationLimit < 0).length > 0) {
      return -1;
    }
    if (activations.length === 1)
      return activations[0].package.organizationLimit - activations[0].organization;

    let organizationLimit = 0;
    let organizationCount = 0;
    activations.forEach((activation) => {
      organizationLimit += activation.package.organizationLimit;
      organizationCount += activation.organization;
    });
    return organizationLimit - organizationCount;
  }
);

const activationsSlice = createSlice({
  name: 'organizationsApp/activations',
  initialState: activationsAdapter.getInitialState({}),
  reducers: {},
  extraReducers: {
    [getActivations.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      activationsAdapter.setAll(state, data);
      state.searchText = '';
    },
    [addInviteCode.fulfilled]: activationsAdapter.addOne,
  },
});

export default activationsSlice.reducer;
