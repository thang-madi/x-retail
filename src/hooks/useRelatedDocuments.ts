
/////////////////////////////////////////////
// Standard's

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import dayjs from 'dayjs'

/////////////////////////////////////////////
// Application's

// import { setPageInfo } from '../data-storage/slice-current'
// import { compareValues, createRequestDataByDataItem, newItemValue, xtsObjectToFormData } from '../data-exchange/common-use'
// import { generateUUID } from '../commons/common-use'
// import { createXTSObject } from '../data-exchange/objects'
// import { DEBUG, PAGE_ITEMS } from '../commons/constants'
// import xtsSlice from '../data-storage/slice-xts'
// import { getXTSSlice } from '../data-storage/slice-xts'
import { requestData_GetRelatedDocument } from '../data-objects/request-data'
import { RootState } from '../data-storage'
import { compareXTSValues, createXTSObject } from '../data-objects/common-use'
import { getXTSSlice } from '../data-storage/xts-mappings'

/////////////////////////////////////////////
// Object's

// import { apiRequest, actions } from '../data-storage/slice-current'
import debounce from 'lodash.debounce'
import { notification } from 'antd'
import { XTSObjectId } from '../data-objects/types-common'
import { REQUEST_STATUSES } from '../commons/enums'

/////////////////////////////////////////////
// Interfaces

// OK
export interface UseGetRelatedDocumentsParams {
    objectId: XTSObjectId
    // requestParams: { [key: string]: any }
    // download: boolean
    // sortBy?: string
}

/////////////////////////////////////////////
// useHook: useGetRelatedDocuments

// OK
// Tải về ObjectList  
export function useGetRelatedDocuments(params: UseGetRelatedDocumentsParams) {

    const dispatch = useDispatch()

    const { sliceName, apiRequest, actions } = getXTSSlice('XTSCurrent')
    const { relatedDocuments, status, tempData } = useSelector((state: any) => (state.currentData))
    // const dataLength = documents?.length
    // console.log('objects.length 1 - ', dataLength)

    const refreshList = () => {
        loadData()
    }

    const loadData = (refresh: boolean = false) => {

        if (refresh) {
            dispatch(actions.clearRelatedDocuments())
        }
        // console.log('requestParams', requestParams)

        const requestData = requestData_GetRelatedDocument(params.objectId)
        // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(actions.setTemp(null))
        dispatch(apiRequest(requestData))
    }

    useEffect(() => {
        const responseTypes = ['XTSGetRelatedDocumentsResponse']
        if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.includes(tempData['_type'])) {
            dispatch(actions.setStatus(REQUEST_STATUSES.IDLE))
        }
    }, [status, tempData])

    // Load dữ liệu từ Server khi mới mở
    useEffect(() => {
        refreshList()
    }, [])

    return { relatedDocuments, status, refreshList }
}