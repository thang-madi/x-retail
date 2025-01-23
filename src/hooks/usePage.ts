/////////////////////////////////////////////
// Standard's

import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, useSearchParams, useLocation, NavigateFunction } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form } from 'antd'


/////////////////////////////////////////////
// Application's

import { actions as actions_Current } from '../data-storage/slice-current'
import { MIN_SEARCH_LENGTH, PAGE_ITEMS } from '../commons/constants'
import { getXTSSlice } from '../data-storage/xts-mappings'
import { RootState } from '../data-storage'
import { compareFunction, compareXTSValues, createXTSObject, isEmptyObjectId } from '../data-objects/common-use'
import { XTSObject, XTSObjectId, XTSRecordFilter, XTSRecordKey } from '../data-objects/types-common'
import { XTSItemValue } from '../data-objects/types-form'
import { ITEM_VALUE_ACTIONS, USAGE_MODES } from '../data-objects/types-components'
import { requestData_DownloadObjectList, requestData_GetObject, requestData_GetObjectList, requestData_GetRecordSet } from '../data-objects/request-data'
import { arrayFilter, arraySort, generateUUID } from '../commons/common-use'
import { fillDefaultValues } from '../data-objects/default-values'
import { PAGE_ACTIONS, REQUEST_STATUSES } from '../commons/enums'

/////////////////////////////////////////////
// Object'


/////////////////////////////////////////////
// Interfaces

// OK
export interface UseCreatePageParams {


}

// OK
export interface UseOpenPageParams {
    pageId: string
    pageName: string
    pageTitle: string
    renderKey?: number      // Dùng cho Modal hoặc Drawer, khi mở lại Page thì cần render lại các giá trị trên đó
}

// OK
export interface UseStepBackParams {
    pageId: string
    // itemName?: string       // Xem lại
    // dataType: string        // Xem lại
    stepBack: () => void
}

// OK
export interface UseGetDataObjectParams {
    dataType: string
    object_id: string
    refresh: boolean
}

// OK
export interface UseGetDataRecordParams {
    recordKey: XTSRecordKey
    refresh: boolean
}

// Sau này sẽ dần bỏ đi
export interface UseGetDataListParams {
    dataType: string
    requestParams: { [key: string]: any }
    // searchText: string
    // searchFields: string[]
    classType: string
}

// OK
export interface UseGetObjectListParams {
    dataType: string
    requestParams: { [key: string]: any }
    download: boolean
    sortBy?: string
    objectIds?: XTSObjectId[]
}

// OK
export interface UseGetRecordSetParams {
    dataType: string
    requestParams: { [key: string]: any }
    refresh: boolean
    sortBy?: string
}

// Chưa dùng ở đâu
export interface UseGetRecordListParams {
    dataType: string
    requestParams: { [key: string]: any }
    // searchText: string
    // searchFields: string[]
}

// OK
export interface UseSaveFormDataParams {
    dataType: string
    itemName?: string
    choiceItemValue?: (itemValue: XTSItemValue) => void
    afterSave?: (tempData: any) => void
}

// OK
export interface UseIndexPageParams {
    dataType: string
    id?: string
    itemName?: string
    // reopen?: boolean
    // action?: ITEM_VALUE_ACTIONS
    // usageMode?: USAGE_MODES
    choiceItemValue?: (itemValue: XTSItemValue) => void
    afterSave?: (tempData: any) => void
    // navigate: NavigateFunction
}

/////////////////////////////////////////////
// useCustomPageHooks

// OK
// Thực hiện các thao tác ban đầu khi bắt đầu tạo trang
export function useCreatePage(params: UseCreatePageParams): { [key: string]: any } {

    const [form] = Form.useForm()

    return { form }
}

// OK
// Thực hiện các thao tác ban đầu khi bắt đầu mở trang
// Tham số:
//      pageTitle: tiêu đề trang
//
export function useOpenPage(params: UseOpenPageParams) {

    const { pageId, pageName, pageTitle, renderKey } = params

    // const navigate = useNavigate()
    const dispatch = useDispatch()

    const setPageInfo = (): void => {
        if (pageId) {
            dispatch(actions_Current.setParams({ pageId, pageName, pageTitle }))
        } else {
            dispatch(actions_Current.setParams({ pageName, pageTitle }))
        }
    }

    useEffect(() => {
        setPageInfo()
    }, [pageId, pageName, pageTitle, renderKey])

    // console.log('useOpenPage.params', params)
    // useEffect(() => {
    //     setPageInfo()
    // }, [])

    return { setPageInfo }
}

// OK
// Chỉ dùng cho Object
export function useGetDataObject(params: UseGetDataObjectParams): { [key: string]: any } {

    const { dataType, object_id, refresh = false } = params

    const dispatch = useDispatch()

    const { sliceName, apiRequest, actions } = getXTSSlice(dataType)

    // Lấy giá trị dataObject từ redux-store theo slice tương ứng
    // Nếu không tìm thấy thì tạo mới 1 dataObject trắng
    const { defaultValues, externalAccount } = useSelector((state: RootState) => state.session)
    const object = useSelector((state: any) => state[sliceName].objects.find((item: XTSObject) => item.objectId.id === object_id))
    // console.log('useGetDataObject.itemObject', object)

    const getDataObject = (dataType: string, fillingValues: { [key: string]: any } | undefined): XTSObject => {
        const _dataObject = createXTSObject(dataType, fillingValues)
        if (!fillingValues && defaultValues) {
            fillDefaultValues(_dataObject, { ...defaultValues })
        }
        return _dataObject
    }

    const [dataObject, setDataObject] = useState(getDataObject(dataType, object))
    // console.log('dataObject 1', dataObject)

    useEffect(() => {
        if (object) {
            setDataObject(getDataObject(dataType, object))
        } else {
            setDataObject(getDataObject(dataType, undefined))
        }
        // console.log('useGetDataObject.object', object)

    }, [object])

    /////////////////////////////////////////////
    // Cập nhật dữ liệu

    // const status = useSelector((state: any) => state[sliceName].status)
    // const tempData = useSelector((state: any) => state[sliceName].tempData)
    const { status, tempData } = useSelector((state: any) => state[sliceName])
    useEffect(() => {
        const responseTypes = ['XTSGetObjectsResponse']
        // if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.find(item => item === tempData['_type'])) {
        if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.includes(tempData['_type'])) {
            dispatch(actions.setStatus(REQUEST_STATUSES.IDLE))
        }
    }, [status, tempData])

    const refreshObject = () => {
        if (object_id) {
            const requestData = requestData_GetObject(dataType, object_id)
            // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(apiRequest(requestData))
        }
    }

    const { uploadFilesCountDown } = useSelector((state: any) => state[sliceName])
    useEffect(() => {
        if (uploadFilesCountDown === 0) {
            refreshObject()
        }
    }, [uploadFilesCountDown])

    useEffect(() => {
        if (refresh || (!object?._isFullData)) {
            // console.log('object', object)
            refreshObject()
        }
    }, [object_id])

    // useEffect(() => {
    //     if (refresh) {
    //         refreshObject()
    //     }
    // }, [])

    // console.log('dataObject', dataObject)

    return { dataObject, status, refreshObject, setDataObject }
}

// 
export function useGetDataRecord(params: UseGetDataRecordParams) {

    const { recordKey, refresh = true } = params
    const { dataType, filter } = recordKey
    const dispatch = useDispatch()

    const { sliceName, apiRequest, actions } = getXTSSlice(dataType)

    const dataRecord = useSelector((state: any) => state[sliceName].records.find((record: any) => {
        // var result = true
        // for (let filterKey in filter) {
        //     if (filterKey === '_type') {
        //         continue
        //     }
        //     if (!compareXTSValues((filter as any)[filterKey], record[filterKey])) {
        //         result = false
        //         break
        //     }
        // }
        // return result
        return (filter as any).every((filterItem: any) => {
            const propertyValue = (record as any)[filterItem.key]
            return compareXTSValues(propertyValue, filterItem.value) === 0
        })
    }))

    /////////////////////////////////////////////
    // 

    const { status, tempData } = useSelector((state: any) => state[sliceName])

    /////////////////////////////////////////////
    // Cập nhật dữ liệu

    const refreshRecord = () => {
        const requestObject = createXTSObject('XTSGetRecordSetRequest')
        requestObject.dataType = dataType
        requestObject.filter = filter

        const headers = {}
        const body = JSON.stringify(requestObject)
        const requestData = { headers, body }
        // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(apiRequest(requestData))
    }

    useEffect(() => {
        if (refresh) {
            refreshRecord()
        }
    }, [filter])

    return { dataRecord, status, refreshRecord, }
}

// Dần dần sẽ bỏ đi, thay vào là:
//  - useGetObjectList
//  - useGetRecordSet
// Tải về ObjectList / RecordSet 
export function useGetDataList(params: UseGetDataListParams) {

    // const { dataType, params, searchText, searchFields, classType = 'object' } = params

    // params: các tham số bổ sung vào body của request
    // searchFields: mảng các trường tìm kiếm
    // classType: nhận 1  trong hai giá trị: 'object" và 'record'

    const dispatch = useDispatch()

    const { sliceName, apiRequest, actions } = getXTSSlice(params.dataType)

    const sliceItemName = params.classType + 's'
    const dataList = useSelector((state: any) => (state[sliceName][sliceItemName]))

    // console.log('dataList', dataList)
    // const [max, setMax] = useState(dataList.length as number)
    // console.log('dataList', dataList)

    const refreshList = () => {
        const refresh = true
        loadData(PAGE_ITEMS, true)
    }

    const loadMore = () => {
        loadData(PAGE_ITEMS)
    }

    const loadData = (count: number, refresh: boolean = false) => {

        var length = dataList.length
        if (refresh) {
            length = 0
            dispatch(actions.clear())
        }

        if (params.classType === 'object') {
            const requestData = requestData_GetObjectList(params.dataType, length, count, params.requestParams)
            // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setTemp(null))
            dispatch(apiRequest(requestData))
        } else if (params.classType === 'record') {
            const filter = params.requestParams.filter
            const requestData = requestData_GetRecordSet(params.dataType, filter)
            // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setTemp(null))
            dispatch(apiRequest(requestData))
            console.log('requestData', requestData)
        }
    }

    const { status, tempData } = useSelector((state: any) => state[sliceName])
    useEffect(() => {
        const responseTypes = ['XTSGetObjectListResponse', 'XTSGetRecordSetResponse']
        // if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.find(item => item === tempData['_type'])) {
        if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.includes(tempData['_type'])) {
            dispatch(actions.setStatus(REQUEST_STATUSES.IDLE))
        }
    }, [status, tempData])

    // Load dữ liệu từ Server khi mới mở
    useEffect(() => {
        if (dataList.length === 0) {
            refreshList()
        }
    }, [])

    return { dataList, status, refreshList, loadMore }
}

// OK
// Tải về ObjectList  
export function useGetObjectList(params: UseGetObjectListParams) {

    const dispatch = useDispatch()

    const { sliceName, apiRequest, actions } = getXTSSlice(params.dataType)
    const { objects, status, tempData, searchString, searchFields, filter, sortBy } = useSelector((state: any) => (state[sliceName]))
    const dataLength = objects.length

    const dataList = useMemo(() => {
        // if (searchString.length < MIN_SEARCH_LENGTH) {
        //     // return objects
        // } else {
        //     const lowerCaseText = searchString.toLowerCase()
        //     return objects.filter((object: any) => {
        //         let result = false
        //         for (const field of searchFields) {
        //             let fieldValue: any = object[field]
        //             if (fieldValue && typeof fieldValue === 'object' && fieldValue.hasOwnProperty('presentation')) {
        //                 fieldValue = fieldValue.presentation
        //             }
        //             result = String(fieldValue).toLowerCase().includes(lowerCaseText)
        //             if (result) break
        //         }
        //         return result
        //     })
        // }

        let filteredObjects
        // console.log('params.objectIds', params.objectIds)
        let objectIds: XTSObjectId[] = []
        if (params.objectIds) {
            objectIds = params.objectIds
        }
        if (objectIds.length === 0) {
            filteredObjects = objects
        } else {
            filteredObjects = objects.filter((object: XTSObject) => {
                if (params.objectIds) {
                    return params.objectIds.findIndex((objectId: XTSObjectId) => object.objectId.id === objectId.id) !== -1
                } else {
                    return false
                }
            })
        }

        // console.log('filteredObjects', filteredObjects)
        // }
        // filteredObjects = arrayFilter([...objects], filter)
        // return arraySort(filteredObjects, sortBy)
        const filterResult = arrayFilter([...filteredObjects], filter)
        if (searchString.length < MIN_SEARCH_LENGTH) {
            return arraySort(filterResult, sortBy)
        } else {
            const lowerCaseText = searchString.toLowerCase()
            return filterResult.filter((object: any) => {
                let result = false
                for (const field of searchFields) {
                    let fieldValue: any = object[field]
                    if (fieldValue && typeof fieldValue === 'object' && fieldValue.hasOwnProperty('presentation')) {
                        fieldValue = fieldValue.presentation
                    }
                    result = String(fieldValue).toLowerCase().includes(lowerCaseText)
                    if (result) break
                }
                return result
            })
        }
    }, [objects, searchString, filter, sortBy])

    const refreshList = () => {
        const refresh = true
        loadData(PAGE_ITEMS, refresh)
    }

    const loadMore = () => {
        loadData(PAGE_ITEMS)
    }

    const loadData = (count: number, refresh: boolean = false) => {

        console.log('loadData - ', dataLength)
        var length = dataLength
        // console.log('objects.length 2 - ', dataLength)
        if (refresh) {
            length = 0
            dispatch(actions.clear())
        }
        // console.log('requestParams', requestParams)

        if (params.download) {
            const requestData = requestData_DownloadObjectList(params.dataType, params.requestParams)
            // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setTemp(null))
            dispatch(apiRequest(requestData))
        } else {
            const requestData = requestData_GetObjectList(params.dataType, length, count, params.requestParams)
            // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setTemp(null))
            dispatch(apiRequest(requestData))
        }
    }

    // const { status, tempData } = useSelector((state: any) => state[sliceName])
    useEffect(() => {
        const responseTypes = ['XTSGetObjectListResponse', 'XTSDownloadObjectListResponse']
        // if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.find(item => item === tempData['_type'])) {
        if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.includes(tempData['_type'])) {
            dispatch(actions.setStatus(REQUEST_STATUSES.IDLE))
        }
    }, [status, tempData])

    // Load dữ liệu từ Server khi mới mở
    useEffect(() => {
        if (dataList.length === 0) {
            refreshList()
        }
    }, [])

    return { dataList, status, refreshList, loadMore }
}

// 
// Tải về RecordSet 
export function useGetRecordSet(params: UseGetRecordSetParams) {

    const dispatch = useDispatch()

    const { sliceName, apiRequest, actions } = getXTSSlice(params.dataType)

    const { records, status, tempData, searchString, searchFields } = useSelector((state: any) => (state[sliceName]))
    const dataList = useMemo(() => {
        const lowerCaseText = searchString.toLowerCase()
        const _records = records.filter((object: any) => {
            let result = false
            for (const field of searchFields) {
                let fieldValue: any = object[field]
                if (fieldValue && typeof fieldValue === 'object' && fieldValue.hasOwnProperty('presentation')) {
                    fieldValue = fieldValue.presentation
                }
                result = String(fieldValue).toLowerCase().includes(lowerCaseText)
                if (result) break
            }
            return result
        })
        if (params.sortBy) {
            const sortBy = params.sortBy
            _records.sort((record1: any, record2: any) => {
                // if (typeof sortBy === 'string') {
                return compareFunction(record1[sortBy], record2[sortBy])
                // }
            })
        }
        // return records.filter((object: any) => {
        //     let result = false
        //     for (const field of searchFields) {
        //         let fieldValue: any = object[field]
        //         if (fieldValue && typeof fieldValue === 'object' && fieldValue.hasOwnProperty('presentation')) {
        //             fieldValue = fieldValue.presentation
        //         }
        //         result = String(fieldValue).toLowerCase().includes(lowerCaseText)
        //         if (result) break
        //     }
        //     return result
        // })
        return _records
    }, [records, searchString])

    const refreshList = () => {
        const refresh = true
        loadData(refresh)
    }

    const loadData = (refresh: boolean = false) => {

        if (refresh) {
            dispatch(actions.clear())
        }

        const filter = params.requestParams.filter
        const requestData = requestData_GetRecordSet(params.dataType, filter)
        // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(actions.setTemp(null))
        dispatch(apiRequest(requestData))
        console.log('requestData', requestData)
    }

    // const { status, tempData } = useSelector((state: any) => state[sliceName])
    useEffect(() => {
        const responseTypes = ['XTSGetRecordSetResponse']
        // if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.find(item => item === tempData['_type'])) {
        if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.includes(tempData['_type'])) {
            dispatch(actions.setStatus(REQUEST_STATUSES.IDLE))
        }
    }, [status, tempData])

    // Load dữ liệu từ Server khi mới mở
    useEffect(() => {
        if (params.refresh === true || dataList.length === 0) {
            refreshList()
        }
    }, [])

    return { dataList, status, refreshList }
}

// OK
// Thực hiện các thao tác khi lưu lại trang ==> Chuyển đến trang Xem
export function useSaveDataObject(params: UseSaveFormDataParams) {

    // const { dataType, setItemValue, afterSave } = params
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // const { pathname } = useLocation()
    const { sliceName, apiRequest, actions } = getXTSSlice(params.dataType)

    const { status, tempData } = useSelector((state: any) => state[sliceName])
    useEffect(() => {
        const responseTypes = ['XTSCreateObjectsResponse', 'XTSUpdateObjectsResponse']
        // console.log('useSaveFormData.useEffect', responseTypes)

        if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.includes(tempData['_type'])) {
            const { objects } = tempData
            dispatch(actions.setStatus(REQUEST_STATUSES.IDLE))
            if (params.afterSave) {
                params.afterSave(tempData)
            }
            if ((params.choiceItemValue) && objects[0].objectId?.id) {         // id chính thức được lưu là nằm trong tempData
                const objectId = objects[0].objectId
                const itemValue = createXTSObject('XTSItemValue', {
                    id: objectId.id,
                    edit: false,
                    type: objectId.dataType,
                    action: ITEM_VALUE_ACTIONS.VIEW
                })
                params.choiceItemValue(itemValue)
            }

        }
    }, [status, tempData])

    return { status }
}

// 
// Thực hiện các thao tác khi lưu lại trang ==> Chuyển đến trang Xem
export function useSaveDataRecord(params: UseSaveFormDataParams) {

    // const { dataType, setItemValue, afterSave } = params
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { sliceName, apiRequest, actions } = getXTSSlice(params.dataType)

    const { status, tempData } = useSelector((state: any) => state[sliceName])
    useEffect(() => {
        const responseTypes = ['XTSCreateObjectsResponse', 'XTSUpdateObjectsResponse']
        // console.log('useSaveFormData.useEffect', responseTypes)

        // if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.find(item => item === tempData['_type'])) {
        if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.includes(tempData['_type'])) {
            const { objects } = tempData
            dispatch(actions.setStatus(REQUEST_STATUSES.IDLE))
            if (params.afterSave) {
                params.afterSave(tempData)
            }
            // Cần hoàn thiện việc trả lại itemValue khi gọi params.choiceItemValue(itemValue)
            // if ((params.choiceItemValue) && objects[0].objectId?.id) {
            //     const objectId = objects[0].objectId
            //     const itemValue = createXTSObject('XTSItemValue', {
            //         id: objectId.id,
            //         edit: false,
            //         type: objectId.dataType,
            //         action: ITEM_VALUE_ACTIONS.VIEW
            //     })
            //     params.choiceItemValue(itemValue)
            // }
        }
    }, [status, tempData, navigate, dispatch])

    return { status }
}

// Giống hệt useSaveDataObject, chỉ là đổi tên. Sau này sẽ bỏ hàm này đi, thay bằng useSaveDataObject
// Thực hiện các thao tác khi lưu lại trang ==> Chuyển đến trang Xem
export function useSaveFormData(params: UseSaveFormDataParams) {

    // const { dataType, setItemValue, afterSave } = params
    // const navigate = useNavigate()
    const dispatch = useDispatch()

    // const { pathname } = useLocation()
    const xtsSlice = getXTSSlice(params.dataType)
    const { sliceName, apiRequest, actions } = xtsSlice

    const { status, tempData } = useSelector((state: any) => state[sliceName])
    // console.log('sliceName', sliceName, status, tempData)
    useEffect(() => {
        const responseTypes = ['XTSCreateObjectResponse', 'XTSCreateObjectsResponse', 'XTSUpdateObjectsResponse']

        if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.includes(tempData['_type'])) {
            // const { objects } = tempData
            dispatch(actions.setStatus(REQUEST_STATUSES.IDLE))
            if (params.afterSave) {
                params.afterSave(tempData)
            }
            let objectId: any
            // id chính thức được lưu là nằm trong tempData
            if (tempData['_type'] === 'XTSCreateObjectResponse') {
                objectId = tempData.object.objectId
            } else {
                objectId = tempData.objects[0].objectId
            }
            if ((params.choiceItemValue) && objectId?.id) {
                // const objectId = objects[0].objectId
                const action = (params.itemName) && ITEM_VALUE_ACTIONS.CHOICE || ITEM_VALUE_ACTIONS.VIEW
                const itemValue = createXTSObject('XTSItemValue', {
                    id: objectId.id,
                    edit: false,
                    dataType: objectId.dataType,
                    presentation: objectId.presentation,
                    action,
                })
                // console.log('itemValue', itemValue)
                params.choiceItemValue(itemValue)
            }
        }
    }, [status, tempData])

    return { status }
}

// 
export function useChoicePage(useChoicePageParams: any) {

    const { pageId, pageName, pageTitle, } = useChoicePageParams

    const dispatch = useDispatch()

    // State để mở và đóng Modal ChoicePage
    const [choiceOpen, setChoiceOpen] = useState(false)

    const setPageInfo = (): void => {
        dispatch(actions_Current.setParams({ pageId, pageName, pageTitle }))
    }

    // openChoicePage - mở Modal
    const openChoicePage = (itemValue: XTSItemValue) => {
        setChoiceOpen(true)
    }

    // closeChoicePage - đóng Modal
    const closeChoicePage = () => {
        setChoiceOpen(false)
    }

    return {
        choiceOpen,
        openChoicePage,
        closeChoicePage,
    }
}

// 
// Thực hiện các thao tác stepBack
// Xem xét để gộp với useIndexPage
export function useStepBack(params: UseStepBackParams): any {

    const { stepBack } = params

    const dispatch = useDispatch()
    const { pageAction, pageId, pageName, pageTitle } = useSelector((state: RootState) => state.currentData)

    const setPageBackAction = () => {
        dispatch(actions_Current.setParams({ pageAction: PAGE_ACTIONS.BACK }))
    }       // Xem xét lại, có thể không cần dùng


    // useEffect(() => {
    //     dispatch(actions_Current.setParams({ pageId: params.pageId, pageAction: PAGE_ACTIONS.NONE }))
    // }, [])

    // useEffect(() => {
    //     dispatch(actions_Current.setParams({ pageId: params.pageId, pageAction: PAGE_ACTIONS.NONE }))
    // }, [pageName])

    /////////////////////////////////////////////
    // 

    useEffect(() => {
        if (pageId === params.pageId) {
            if (pageAction === PAGE_ACTIONS.BACK) {
                dispatch(actions_Current.setParams({ pageAction: PAGE_ACTIONS.NONE }))
                stepBack()
            }
        }
    }, [pageId, pageAction])

    return { setPageBackAction }
}

// OK
export function useIndexPage(params: UseIndexPageParams) {

    const { dataType, itemName, afterSave } = params

    const [searchParams, setSearchParams] = useSearchParams()

    const navigate = useNavigate()
    const { user } = useSelector((state: RootState) => state.session)
    // const dispatch = useDispatch()

    // id
    const id = searchParams.get('id') || params.id

    // action
    let action = ITEM_VALUE_ACTIONS.LIST
    if (!params.itemName) {
        if (searchParams.get('edit') && dataType === searchParams.get('type')) {
            action = ITEM_VALUE_ACTIONS.EDIT
        } else if (id) {
            action = ITEM_VALUE_ACTIONS.VIEW
        }
    }

    // usageMode
    let usageMode = USAGE_MODES.DEFAULT
    if (id) {
        usageMode = USAGE_MODES.ITEM_VIEW
    } else if (searchParams.get('mode') === USAGE_MODES.LIST_VIEW) {
        usageMode = USAGE_MODES.LIST_VIEW
    }

    const stepBack = () => {
        const newItemValue = createItemValue(itemValue)
        if (itemValue.action === ITEM_VALUE_ACTIONS.VIEW) {
            if (usageMode === USAGE_MODES.ITEM_VIEW) {
                newItemValue.action = ITEM_VALUE_ACTIONS.ESCAPE
                if (params.choiceItemValue) {
                    params.choiceItemValue(newItemValue)
                }
            } else {
                newItemValue.action = ITEM_VALUE_ACTIONS.LIST
                setItemValue(newItemValue)
            }
        } else if (itemValue.action === ITEM_VALUE_ACTIONS.EDIT) {
            if (itemValue.id) {
                newItemValue.action = ITEM_VALUE_ACTIONS.VIEW
                setItemValue(newItemValue)
            } else {
                newItemValue.action = ITEM_VALUE_ACTIONS.LIST
                setItemValue(newItemValue)
            }
        } else if (itemValue.itemName) {
            // Đóng ChoicePage
            newItemValue.action = ITEM_VALUE_ACTIONS.ESCAPE
            choiceItemValue(newItemValue)
        } else if (user) {
            navigate('/home')
        } else {
            navigate('/about')
        }
    }

    const choiceItemValue = (value: XTSItemValue): void => {

        if (value.action === ITEM_VALUE_ACTIONS.LIST) {
            setItemValue(value)
        } else if (value.action === ITEM_VALUE_ACTIONS.VIEW) {
            setItemValue(value)
        } else if (value.action === ITEM_VALUE_ACTIONS.EDIT) {
            setItemValue(value)
        } else if (params.choiceItemValue) {
            params.choiceItemValue(value)
            itemValue.action = ITEM_VALUE_ACTIONS.LIST          // Xem lại xem có cần ko?
        }
    }

    const [pageId] = useState(generateUUID())
    const { setPageBackAction } = useStepBack({ pageId, stepBack })

    /////////////////////////////////////////////
    // Khởi tạo giá trị itemValue

    const createItemValue = (itemValue: { [key: string]: any }): XTSItemValue => {
        const result = createXTSObject('XTSItemValue', itemValue)
        return result
    }

    const [itemValue, setItemValue] = useState<XTSItemValue>(createItemValue({ itemName, dataType, id, action }))

    return { itemValue, pageId, usageMode, choiceItemValue, stepBack: setPageBackAction }
}

/////////////////////////////////////////////
// Export's
