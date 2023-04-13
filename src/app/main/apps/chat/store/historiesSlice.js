import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import firebase from 'firebase/compat/app';
import axios from 'axios';
// import { closeMobileChatsSidebar } from './sidebarsSlice';
// import { setHistorySelected } from './currentSlice';

export const getHistories = createAsyncThunk(
  'chatApp/histories/getHistories',
  async (params, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      const { organizationId } = getState().organization;
      const response = await axios.get(`/api/${organizationId}/chat/history/list`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.data;
      return result;
    } catch (error) {
      console.error('getHistories ', error);
      return [];
    }
  }
);

// export const getHistory = createAsyncThunk(
//   'chatApp/history/getHistory',
//   async ({ historyId, isMobile }, { dispatch, getState }) => {
//     try {
//       const { token } = await firebase.auth().currentUser.getIdTokenResult();
//       if (!token) return null;
//       const { id: orgId } = getState().auth.organization.organization;
//       const response = await axios.get(`/api/${orgId}/chat/history`, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         params: {
//           id: historyId,
//         },
//       });
//       const history = await response.data;

//       dispatch(setHistorySelected(history));
//       if (isMobile) {
//         dispatch(closeMobileChatsSidebar());
//       }
//       return history;
//     } catch (error) {
//       console.error('getHistory ', error);
//       return null;
//     }
//   }
// );

const historiesAdapter = createEntityAdapter({});

export const { selectAll: selectHistories, selectById: selectHistoryById } =
  historiesAdapter.getSelectors((state) => state.chatApp.histories);

const historiesSlice = createSlice({
  name: 'chatApp/histories',
  initialState: historiesAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setHistoriesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    clearHistories: (state, action) => {
      state = historiesAdapter.getInitialState({
        searchText: '',
      });
    },
  },
  extraReducers: {
    [getHistories.fulfilled]: (state, action) => {
      historiesAdapter.setAll(state, action.payload);
    },
  },
});

export const { setHistoriesSearchText, clearHistories } = historiesSlice.actions;

export default historiesSlice.reducer;
