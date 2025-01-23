/////////////////////////////////////////////
// Standard's


/////////////////////////////////////////////
// Application's

import { PAGE_ACTIONS } from '../commons/enums'
// import { ITEM_VALUE_ACTIONS } from '../data-objects/types-components'
import { XTSCurrentState, XTSSliceAction } from './interfaces'

/////////////////////////////////////////////
// Object's

// import { current } from '@reduxjs/toolkit'

/////////////////////////////////////////
// default reducers

export const reducers = {

    setParams(state: XTSCurrentState, action: XTSSliceAction) {

        const { pageId, pageName, pageAction, pageTitle } = action.payload
        if (pageTitle) {
            state.pageTitle = pageTitle
        }
        if (pageId && pageId !== state.pageId) {
            state.pageId = pageId
            state.pageAction = PAGE_ACTIONS.NONE
        }
        if (pageName && pageName !== state.pageName) {
            state.pageName = pageName
        }
        if (pageAction) {
            state.pageAction = pageAction
        } else {
            state.pageAction = PAGE_ACTIONS.NONE
        }
    },

    setTemp(state: XTSCurrentState, action: XTSSliceAction) {
        state.tempData = action.payload
    },

    setStatus(state: XTSCurrentState, action: XTSSliceAction) {
        state.status = action.payload
    },

    setRelatedDocuments(state: XTSCurrentState, action: XTSSliceAction) {
        state.relatedDocuments = action.payload
    },

    clearRelatedDocuments(state: XTSCurrentState) {
        state.relatedDocuments = []
    },

}

/////////////////////////////////////////////
// Export's

