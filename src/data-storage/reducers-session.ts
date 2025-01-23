/////////////////////////////////////////////
// Standard's


/////////////////////////////////////////////
// Application's

import { XTSSessionState, XTSSliceAction } from './interfaces'
import { fillPropertyValues } from '../data-objects/common-use'
import { setLocalDeviceId, setLocalUserToken } from '../commons/users'
import { XTSObjectId } from '../data-objects/types-common'
import { getXTSSlice } from './xts-mappings'

/////////////////////////////////////////////
// Object's

// import { current } from '@reduxjs/toolkit'

/////////////////////////////////////////
// default reducers

export const reducers = {

    setParams(state: XTSSessionState, action: XTSSliceAction) {

        fillPropertyValues(state, action.payload)
    },

    signIn(state: XTSSessionState, action: XTSSliceAction) {

        // console.log('action.payload', action.payload)

        const responseObject = action.payload
        if (responseObject['_type'] === 'XTSSignInResponse') {
            fillPropertyValues(state, action.payload)
        }

        if (state.userToken) {
            setLocalUserToken(state.userToken)
        }
    },

    signOut(state: XTSSessionState, action: XTSSliceAction) {

        const { user, externalAccount, customer, defaultValues, company } = action.payload

        // console.log('action.payload', action.payload)

        if (!user) {
            state.userName = ''
            state.user = user
            state.company = company
            // state.roles = ['customer']
            state.customer = customer
        }

        if (!externalAccount) {
            state.userToken = ''
            state.deviceId = ''
            state.externalAccount = externalAccount
            state.externalAccountId = ''
            state.externalAccountOwner = ''
            state.telegramId = ''
            state.zaloId = ''
            state.phone = ''
            state.fileStorageURL = ''
            setLocalUserToken('')
            setLocalDeviceId('')
            state.roles = []
        }

        // state.company = null
        // state.supplier = null
        // state.shipper = null

    },

    updateUserConnection(state: XTSSessionState, action: XTSSliceAction) {

        // console.log('action.payload', action.payload)
        const responseObject = action.payload
        if (responseObject['_type'] === 'XTSConnectUserResponse') {
            state.externalAccount = responseObject['externalAccount']
            state.customer = responseObject['customer']
            state.employee = responseObject['employee']
            state.user = responseObject['user']
            state.defaultValues = responseObject['defaultValues']
        }
        // console.log('updateUserConnection.responseObject', responseObject)
    },

    setStatus(state: XTSSessionState, action: XTSSliceAction) {
        state.status = action.payload
    },

    setTemp(state: XTSSessionState, action: XTSSliceAction) {
        state.tempData = action.payload
    },

}

/////////////////////////////////////////////
// Export's

