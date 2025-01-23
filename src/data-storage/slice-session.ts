/////////////////////////////////////////////
// Standard's

import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit"

/////////////////////////////////////////////
// Application's

import { setError, setLoading, setSucceeded } from "./reducers-extra"
import { XTSSettings, XTSSessionState, XTSSliceAction, XTSObjectState } from "./interfaces"
import { postRequestWithThunk } from "./post-request"
import { reducers } from './reducers-session'
import { initialState_Session } from "./initial-states"

/////////////////////////////////////////////
// Begin

const initialState: XTSSessionState = initialState_Session()

export const apiRequest = createAsyncThunk(
    'session/apiRequest',                                                                           // session         
    (data: any, thunkAPI) => postRequestWithThunk(data, thunkAPI, sliceSession.actions)             // sliceSession
)

const sliceSession = createSlice({                                                                  // sliceSession
    name: 'session',                                                                                // session
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

export default sliceSession.reducer                                                                 // sliceSession
export const actions = sliceSession.actions
