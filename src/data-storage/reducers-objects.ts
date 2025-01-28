/////////////////////////////////////////////
// Standard's


/////////////////////////////////////////////
// Application's

// import { createXTSObject } from '../data-objects/common-use'
import { XTSObject } from '../data-objects/types-common'
import { XTSObjectState, XTSSliceAction } from './interfaces'


/////////////////////////////////////////////
// Object's

import { current } from '@reduxjs/toolkit'

/////////////////////////////////////////
// default reducers

export const reducers = {

    // updateItem(state: XTSObjectState, action: XTSSliceAction) {
    //     updateItems(state.objects, action.payload)
    // },

    update(state: XTSObjectState, action: XTSSliceAction) {
        updateItems(state.objects, action.payload)
    },

    remove(state: XTSObjectState, action: XTSSliceAction) {
        removeItems(state, action.payload)
    },

    clear(state: XTSObjectState) {
        removeAll(state.objects)
    },

    setTemp(state: XTSObjectState, action: XTSSliceAction) {
        state.tempData = action.payload
    },

    setStatus(state: XTSObjectState, action: XTSSliceAction) {
        state.status = action.payload
    },

    setScrollValues(state: XTSObjectState, action: XTSSliceAction) {
        const currentState = current(state)
        if (currentState.scrollTop !== action.payload.scrollTop) {
            state.scrollTop = action.payload.scrollTop
            // console.log('setVListScrollValues', currentState)
            // console.log('setVListScrollValues.action.payload', action.payload)
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

    setUploadFilesCountDown(state: XTSObjectState, action: XTSSliceAction) {
        state.uploadFilesCountDown = action.payload.uploadFilesCountDown
    },

    decreaseUploadFilesCountDown(state: XTSObjectState) {
        state.uploadFilesCountDown = state.uploadFilesCountDown - 1
    },

    setSearchString(state: XTSObjectState, action: XTSSliceAction) {
        state.searchString = action.payload.searchString
    },

    setSortItem(state: XTSObjectState, action: XTSSliceAction) {
        const { key, descending } = action.payload
        state.sortBy = state.sortBy.filter(item => item.key !== key)
        state.sortBy.push({ key, descending })
    },

    setFilterItem(state: XTSObjectState, action: XTSSliceAction) {
        // console.log('action', action)
        const { key, value } = action.payload
        state.filter = state.filter.filter(item => item.key !== key)
        state.filter.push({ key, value })
    },

    deleteFilterItem(state: XTSObjectState, action: XTSSliceAction) {
        // console.log('action', action)
        const key = action.payload.key
        state.filter = state.filter.filter(item => item.key !== key)
    },

    clearFilter(state: XTSObjectState) {
        state.filter = []
    },

}


/////////////////////////////////////////
// updateItems

// function updateItem(stateObjects: XTSObject[], dataItem: XTSObject) {

//     if (dataItem.objectId) {
//         const object_id = dataItem.objectId.id
//         const itemIndex = stateObjects.findIndex(item => item.objectId?.id === object_id)

//         if (itemIndex === -1) {
//             stateObjects.push(dataItem)
//         } else {
//             stateObjects[itemIndex] = dataItem
//         }
//     }
// }

function updateItems(stateObjects: XTSObject[], dataItems: XTSObject[]) {

    for (let dataItem of dataItems) {
        if (dataItem.objectId) {
            const object_id = dataItem.objectId.id
            const itemIndex = stateObjects.findIndex(item => item.objectId?.id === object_id)

            if (itemIndex === -1) {
                stateObjects.push(dataItem)
            } else {
                stateObjects[itemIndex] = dataItem
            }
        }
    }
}

/////////////////////////////////////////
// removeItems

function removeItems(state: XTSObjectState, objects: XTSObject[]) {

    // stateObjects = stateObjects.filter(item =>
    //     objects.filter(object => item.objectId?.id === object.objectId?.id)
    // )
    state.objects = state.objects.filter(item =>
        !objects.some(object => item.objectId?.id === object.objectId?.id)
    )
    console.log('actions.removeItems', objects)
    console.log('actions.removeItems', state.objects)
}

/////////////////////////////////////////
// clear

function removeAll(stateObjects: XTSObject[]) {

    stateObjects.splice(0, stateObjects.length)
}

