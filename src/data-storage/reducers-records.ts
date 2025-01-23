/////////////////////////////////////////////
// Standard's


/////////////////////////////////////////////
// Application's

import { XTSRecordState, XTSSliceAction } from './interfaces'
import { XTSRecord } from '../data-objects/types-common'
import { compareXTSValues } from '../data-objects/common-use'

/////////////////////////////////////////////
// Object's

import { current } from '@reduxjs/toolkit'

/////////////////////////////////////////
// default reducers

export const reducers = {

    updateRecordSet(state: XTSRecordState, action: XTSSliceAction) {

        // Cập nhật records vào sliceCarts
        // Mỗi record đều có kiểu là XTSCart
        // Cập nhật record theo các kiểu sau:
        //  - xóa bỏ các bản ghi trong items nếu như trùng Filter
        //  - tạo mới mảng với các bản ghi còn lại với các bản ghi trong payload

        const recordSet = action.payload
        const recordSetFilter = recordSet.filter
        const stateRecords = current(state).records as XTSRecord[]
        const records = stateRecords.filter(record => {
            let filterResult = false
            for (let filterKey in recordSetFilter) {
                if (filterKey === '_type') {
                    continue
                } else if (compareXTSValues((record as any)[filterKey], recordSetFilter[filterKey]) !== 0) {
                    filterResult = true
                } else {
                    // console.log('filterKey', filterKey)
                    // console.log('value1', (record as any)[filterKey])
                }
            }
            return filterResult

            // return recordSetFilter.every(filterItem => {
            //     const itemValue = (item as any)[filterItem.key]
            //     return compareXTSValues(itemValue, filterItem.value) === 0
            // })

        }
        )

        state.records = [...records, ...recordSet.records]
    },

    clear(state: XTSRecordState) {
        state.records = []
    },

    setTemp(state: XTSRecordState, action: XTSSliceAction) {
        state.tempData = action.payload
    },

    setStatus(state: XTSRecordState, action: XTSSliceAction) {
        state.status = action.payload
    },

    setScrollValues(state: XTSRecordState, action: XTSSliceAction) {
        const currentState = current(state)
        if (currentState.scrollTop !== action.payload.scrollTop) {
            state.scrollTop = action.payload.scrollTop
        }
        if (currentState.scrollLeft !== action.payload.scrollLeft) {
            state.scrollLeft = action.payload.scrollLeft
        }
        // if (currentState.scrollRow !== action.payload.scrollRow) {
        //     state.scrollRow = action.payload.scrollRow
        // }
        // if (currentState.scrollColumn !== action.payload.scrollColumn) {
        //     state.scrollRow = action.payload.scrollRow
        // }
    },
}

/////////////////////////////////////////////
// Export's

