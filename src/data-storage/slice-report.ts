/////////////////////////////////////////////
// Standard's

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

/////////////////////////////////////////////
// Application's

import { postRequestWithThunk } from "./post-request"
import { setError, setLoading, setSucceeded } from "./reducers-extra"

/////////////////////////////////////////////
// Object's

import { reducers } from './reducers-report'
import { initialState_Report } from "./initial-states"
import { XTSReportState } from './interfaces'

/////////////////////////////////////////////
// Begin

const initialState: XTSReportState = initialState_Report()

export const apiRequest = createAsyncThunk(
    'reports/apiRequest',                                                                       // 
    (data: any, thunkAPI) => postRequestWithThunk(data, thunkAPI, sliceReport.actions)         // 
)

const sliceReport = createSlice({                                                              // 
    name: 'reports',                                                                            // 
    initialState,
    reducers,
    extraReducers(builder) {
        builder
            .addCase(apiRequest.pending, (state: any) => setLoading(state))
            .addCase(apiRequest.fulfilled, (state: any) => setSucceeded(state))
            .addCase(apiRequest.rejected, (state: any, action) => setError(state, action))
    },
    // extra: extraData,
})

/////////////////////////////////////////////
// Export's

export default sliceReport.reducer                                                  // 
export const actions = sliceReport.actions                                          //
