/////////////////////////////////////////////
// Standard's


/////////////////////////////////////////////
// Application's

// import dayjs from 'dayjs'
// import { emptyUUID, generateUUID, newUUID } from '../commons/common-use'
// import { formDataToXTSObject, xtsObjectProperties, xtsObjectToFormData } from '../data-exchange/common-use'
import { connectParams } from '../commons/connect-params'
// import { XTSObject, XTSResponse } from '../data-objects/types-common'
import { XTSRequestData } from '../data-objects/types-request'
// import { createGunzip } from 'zlib'
// import { XTSRequestData } from './interfaces'
import pako from 'pako'
import { getXTSSlice } from './xts-mappings'

/////////////////////////////////////////////
// Object's


/////////////////////////////////////////////
// Begin

export async function postRequestWithThunk(requestData: XTSRequestData, thunkAPI: any, sliceActions: any) {

    const { rejectWithValue, dispatch } = thunkAPI

    // const state = thunkAPI.getState()

    var _objects

    /////////////////////////////////////////////
    // Chạy request

    console.log('apiRequest.requestData', requestData)

    const URL = process.env.REACT_APP_URL as string
    var {
        url = URL,
        headers = {},
        body = {},
        method = 'POST'
    } = requestData
    // console.log('requestData 112233', requestData)

    if (!headers.hasOwnProperty('Content-Type') && typeof body !== 'string') {
        body = JSON.stringify(body)
    }

    try {
        if (headers & body) {
            throw new Error('Error: no headers/body in parameter Data!')
        }

        const fetchInit = { method, headers, body }

        if (method === 'GET') {
            delete fetchInit.body
        }
        // console.log('fetchInit 2', fetchInit)

        const response = await fetch(url, fetchInit)
        if (!response.ok) {
            throw new Error('Server error!')
        }

        // const responseData = await response.json()
        // console.log('responseData', responseData)

        /////////////////////////////////////////////
        // Insteded

        const contentType = response.headers.get('Content-Type') || ''
        const contentEncoding = response.headers.get('Content-Encoding') || ''

        // console.log('contentType', contentType)

        let responseData: any
        if (contentEncoding === 'gzip') {
            const compressedData = await response.arrayBuffer()
            const decompressedData = pako.inflate(new Uint8Array(compressedData), { to: 'string' })
            const decoder = new TextDecoder('utf-8');
            const responseDataJSON = decoder.decode(decompressedData as any);
            // console.log('responseDataJSON', responseDataJSON)
            responseData = JSON.parse(responseDataJSON)
        } else if (contentType.includes('json')) {
            let now = new Date()
            let hours = now.getHours()
            let minutes = now.getMinutes()
            let seconds = now.getSeconds()
            let milliseconds = now.getMilliseconds()
            // console.log(`Current Time 1: ${hours}:${minutes}:${seconds}.${milliseconds}`)

            responseData = await response.json()
            // console.log('contentType', contentType)
            // console.log('contentEncoding', contentEncoding)
            // console.log('responseData', responseData)
        } else {
            throw new Error('Unsupported response format')
        }

        /////////////////////////////////////////////

        switch (responseData['_type']) {

            // User logs
            case 'XTSSignInResponse':
                // console.log('XTSSignInResponse', responseData)
                dispatch(sliceActions.setTemp(responseData))
                dispatch(sliceActions.signIn(responseData))

                // Xóa bỏ dữ liệu trong orders 
                dispatch(getXTSSlice('XTSOrder').actions.clear())
                break
            case 'XTSSignOutResponse':
                dispatch(sliceActions.setTemp(responseData))
                dispatch(sliceActions.signOut(responseData))

                // Xóa bỏ dữ liệu trong customers, orders và employees
                // dispatch(getXTSSlice('XTSCounterparty').actions.clear())
                dispatch(getXTSSlice('XTSOrder').actions.clear())
                dispatch(getXTSSlice('XTSEmployee').actions.clear())
                break
            case 'XTSConnectUserResponse':
                dispatch(sliceActions.setTemp(responseData))
                dispatch(sliceActions.updateUserConnection(responseData))

                console.log('XTSConnectUserResponse.responseData', responseData)
                break

            // Object's
            case 'XTSGetObjectListResponse':
                _objects = responseData.items.map((item: any) => item.object)
                // console.log('_objects', _objects)
                // console.log('XTSGetObjectListResponse + _objects')
                // console.log('responseData', responseData)
                dispatch(sliceActions.setTemp(responseData))
                dispatch(sliceActions.update(_objects))
                break
            case 'XTSGetObjectsResponse':
                _objects = responseData.objects
                // console.log('XTSGetObjectsResponse - _objects', _objects)
                dispatch(sliceActions.setTemp(responseData))
                dispatch(sliceActions.update(_objects))
                break
            case 'XTSCreateObjectResponse':
                // console.log('XTSCreateObjectsResponse - responseData', responseData)
                _objects = [responseData.object]
                dispatch(sliceActions.setTemp(responseData))
                dispatch(sliceActions.update(_objects))
                // dispatch(sliceActions.setVList({ refresh: true }))      // Cập nhật vList
                break
            case 'XTSCreateObjectsResponse':
                // console.log('XTSCreateObjectsResponse - responseData', responseData)
                _objects = responseData.objects
                dispatch(sliceActions.setTemp(responseData))
                dispatch(sliceActions.update(_objects))
                // dispatch(sliceActions.setVList({ refresh: true }))      // Cập nhật vList
                break
            case 'XTSUpdateObjectsResponse':
                _objects = responseData.objects
                // console.log('XTSUpdateObjectsResponse - responseData', responseData)
                dispatch(sliceActions.setTemp(responseData))
                dispatch(sliceActions.update(_objects))
                // dispatch(sliceActions.setVList({ refresh: true }))      // Cập nhật vList
                break
            case 'XTSDeleteObjectsResponse':
                _objects = responseData.objectIds
                dispatch(sliceActions.setTemp(responseData))
                dispatch(sliceActions.remove(_objects))
                // dispatch(sliceActions.setVList({ refresh: true }))      // Cập nhật vList
                break
            case 'XTSDownloadObjectListResponse':
                let now = new Date()
                let hours = now.getHours()
                let minutes = now.getMinutes()
                let seconds = now.getSeconds()
                let milliseconds = now.getMilliseconds()
                console.log(`Current Time 2: ${hours}:${minutes}:${seconds}.${milliseconds}`)

                // console.log('XTSDownloadObjectListResponse - API', responseData)
                _objects = responseData.objects
                _objects = _objects.map((item: string) => JSON.parse(item))
                // console.log('XTSDownloadObjectListResponse - API', _objects.length)
                // console.log('object[0]', JSON.parse(_objects[0]))
                dispatch(sliceActions.clear())
                dispatch(sliceActions.setTemp(responseData))
                dispatch(sliceActions.update(_objects))

                now = new Date()
                hours = now.getHours()
                minutes = now.getMinutes()
                seconds = now.getSeconds()
                milliseconds = now.getMilliseconds()
                console.log(`Current Time 3: ${hours}:${minutes}:${seconds}.${milliseconds}`)
                // dispatch(sliceActions.setVList({ refresh: true }))      // Cập nhật vList
                break

            // File operations
            case 'XTSUploadFileResponse':
                dispatch(sliceActions.decreaseUploadFilesCountDown())
                break

            // Recordset
            case 'XTSGetRecordSetResponse':
                // console.log('XTSGetRecordSetResponse.responseData', responseData)

                // _objects = responseData.recordSet.records
                // dispatch(sliceActions.load(_objects))
                dispatch(sliceActions.setTemp(responseData))
                dispatch(sliceActions.updateRecordSet(responseData.recordSet))
                // dispatch(sliceActions.setVList({ refresh: true }))      // Cập nhật vList
                break
            case 'XTSUpdateRecordSetResponse':
                console.log('XTSUpdateRecordSetResponse.responseData', responseData)

                dispatch(sliceActions.setTemp(responseData))
                dispatch(sliceActions.updateRecordSet(responseData.recordSet))
                break

            // Report data
            case 'XTSGetReportDataResponse':
                // console.log('responseData', responseData)
                dispatch(sliceActions.setTemp(responseData))
                dispatch(sliceActions.updateReportData(responseData))
                break

            // Related documents
            case 'XTSGetRelatedDocumentsResponse':
                const documents = responseData.documents
                dispatch(sliceActions.setTemp(responseData))
                dispatch(sliceActions.setRelatedDocuments(documents))
                break

            default:
                throw new Error('Error: incorrect ResponseObject!')
        }

    } catch (error: any) {
        return rejectWithValue(error.message)
    }

}

/////////////////////////////////////////////
// Export's

