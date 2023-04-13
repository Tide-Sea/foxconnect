import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';
import firebase from 'firebase/compat/app';
import OrganizationModel from '../model/OrganizationModel';
import { addOrganization, updateOrganization } from './organizationSlice';

export const getOrganizations = createAsyncThunk(
  'organizationsApp/organizations/getOrganizations',
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

const organizationsAdapter = createEntityAdapter({});

export const selectSearchText = ({ organizationsApp }) => organizationsApp.organizations.searchText;

export const {
  selectAll: selectOrganizations,
  selectEntities: selectOrganizationsEntities,
  selectById: selectOrganizationsById,
} = organizationsAdapter.getSelectors((state) => state.organizationsApp.organizations);

export const selectFilteredOrganizations = createSelector(
  [selectOrganizations, selectSearchText],
  (channels, searchText) => {
    if (searchText.length === 0) {
      return channels;
    }
    return FuseUtils.filterArrayByString(channels, searchText);
  }
);

const organizationsSlice = createSlice({
  name: 'organizationsApp/organizations',
  initialState: organizationsAdapter.getInitialState({
    searchText: '',
    routeParams: {},
    organizationDialogId: null,
  }),
  reducers: {
    setOrganizationsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    openOrganizationDialog: (state, action) => {
      state.organizationDialogId = action.payload;
    },
    closeOrganizationDialog: (state, action) => {
      state.organizationDialogId = null;
    },
  },
  extraReducers: {
    [getOrganizations.fulfilled]: organizationsAdapter.setAll,
    [addOrganization.fulfilled]: organizationsAdapter.addOne,
    [updateOrganization.fulfilled]: organizationsAdapter.upsertOne,
  },
});

export const { setOrganizationsSearchText, openOrganizationDialog, closeOrganizationDialog } =
  organizationsSlice.actions;

export const selectDialogOrganizationId = ({ organizationsApp }) =>
  organizationsApp.organizations.organizationDialogId;

export const selectDialogOrganization = createSelector(
  [selectDialogOrganizationId, selectOrganizationsEntities],
  (organizationId, organizationsEntities) => {
    if (organizationId === 'new') {
      return OrganizationModel();
    }
    return organizationsEntities[organizationId];
  }
);

export default organizationsSlice.reducer;
