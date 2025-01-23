
/////////////////////////////////////////
// Object's

import { REQUEST_STATUSES } from "../commons/enums"
import { XTSBaseState } from "./interfaces"


/////////////////////////////////////////
// default extraReducers

export const setLoading = (state: XTSBaseState): void => {
    // console.log('LOADING')
    state.status = REQUEST_STATUSES.LOADING
    state.error = ''
}

export const setSucceeded = (state: XTSBaseState): void => {
    state.status = REQUEST_STATUSES.SUCCEEDED
}

export const setError = (state: XTSBaseState, action: any): void => {
    state.status = REQUEST_STATUSES.FAILED
    state.error = action.payload
}
