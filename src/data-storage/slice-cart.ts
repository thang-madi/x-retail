/////////////////////////////////////////////
// Standard's

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/////////////////////////////////////////////
// Application's

import { XTSRecordState } from "./interfaces"
import { postRequestWithThunk } from "./post-request"
import { setError, setLoading, setSucceeded } from "./reducers-extra"

import { reducers } from "./reducers-records"
import { initialState_Records } from "./initial-states";

/////////////////////////////////////////////
// Begin

const initialState: XTSRecordState = initialState_Records(
    [
        'externalAccount',
        'company',
        'customer',
        'product',
        'characteristic',
        'uom',
    ],
    ['product']
)

export const apiRequest = createAsyncThunk(
    'carts/apiRequest',
    (data: any, thunkAPI: any) => postRequestWithThunk(data, thunkAPI, sliceCart.actions)
)

const sliceCart = createSlice({
    name: 'carts',
    initialState,
    reducers,
    extraReducers(builder) {
        builder
            .addCase(apiRequest.pending, (state) => setLoading(state))
            .addCase(apiRequest.fulfilled, (state) => setSucceeded(state))
            .addCase(apiRequest.rejected, (state, action) => setError(state, action))
    },
    // extra: extraData,
})

/////////////////////////////////////////////
// Export's

export default sliceCart.reducer
export const actions = sliceCart.actions
