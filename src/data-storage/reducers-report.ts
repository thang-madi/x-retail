/////////////////////////////////////////////
// Standard's


/////////////////////////////////////////////
// Application's

// import { PAGE_ACTIONS } from '../commons/enums'
// import { ITEM_VALUE_ACTIONS } from '../data-objects/types-components'
import { XTSReportState, XTSSliceAction } from './interfaces'

/////////////////////////////////////////////
// Object's

// import { current } from '@reduxjs/toolkit'

/////////////////////////////////////////
// default reducers

export const reducers = {

    updateReportData(state: XTSReportState, action: XTSSliceAction) {
        const payload = action.payload
        let reportName = ''
        // console.log('payload', action);
        switch (payload.reportName) {
            case 'Dashboard':
                reportName = 'dashboard'
                break
            case '_':
                reportName = '_'
                break
            default:

        }
        if (reportName) {
            (state as any)[reportName] = { ...payload.reportData }
        }
    },

    setTemp(state: XTSReportState, action: XTSSliceAction) {
        state.tempData = action.payload
    },

    setStatus(state: XTSReportState, action: XTSSliceAction) {
        state.status = action.payload
    },

}

/////////////////////////////////////////////
// Export's

