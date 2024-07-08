import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getResellers, getDomains } from '../ApiConfig';

export const fetchResellers = createAsyncThunk(
  'resellers/fetchResellers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getResellers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllDomains = createAsyncThunk(
  'resellers/fetchAllDomains',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDomains();
      console.log("from slice", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const resellerSlice = createSlice({
  name: 'resellers',
  initialState: {
    resellers: [],
    allDomains: [],
    filteredDomains: [],
    loading: false,
    error: null,
  },
  reducers: {
    filterDomains: (state, action) => {
      state.filteredDomains = state.allDomains.filter(
        domain => domain.reseller === action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResellers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResellers.fulfilled, (state, action) => {
        state.loading = false;
        state.resellers = action.payload;
      })
      .addCase(fetchResellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllDomains.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllDomains.fulfilled, (state, action) => {
        state.loading = false;
        state.allDomains = action.payload;
      })
      .addCase(fetchAllDomains.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { filterDomains } = resellerSlice.actions;
export default resellerSlice.reducer;