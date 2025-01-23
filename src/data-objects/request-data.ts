/////////////////////////////////////////////
// Application's

// import { createXTSObject } from "./objects"
// import { dayjsToString, formatDateTime, generateUUID, stringToDayjs } from "../commons/common-use"
// import { objectsDescription, objectsEnums } from "./types"
// import dayjs from "dayjs"
// import { connectParams } from "../commons/connect-params"
// import { addDefaultValues } from "./add-default-values"
import { createXTSObject, isEmptyObjectId } from "./common-use"
import { XTSObject, XTSObjectId, XTSRecord, XTSRecordFilter, XTSRecordKey, XTSRecordSet } from "./types-common"
import { formDataToXTSValues } from "./form-data"
import { XTSRequestData } from "./types-request"
import { XTSFile } from "./types-library"

/////////////////////////////////////////////
// Begin

// OK
export function requestData_GetObjectList(dataType: string, length: number, count: number, requestParams: any): XTSRequestData {

    const requestObject = createXTSObject('XTSGetObjectListRequest', requestParams)
    requestObject.dataType = dataType
    requestObject.positionFrom = length + 1
    requestObject.positionTo = length + count
    console.log('requestParams', requestParams)
    if (requestParams.conditions) {
        requestObject.conditions = requestParams.conditions
    }

    const headers = {}
    const body = requestObject
    const requestData = createXTSObject('XTSRequestData', { headers, body })

    // console.log('requestData_GetObject.requestData', requestData)

    return requestData
}

// 
export function requestData_DownloadObjectList(dataType: string, requestParams: any): XTSRequestData {

    const requestObject = createXTSObject('XTSDownloadObjectListRequest', requestParams)
    requestObject.dataType = dataType
    if (requestParams.prefix) {
        requestObject.prefix = requestParams.prefix
    }

    const headers = {}
    const body = requestObject
    const requestData = createXTSObject('XTSRequestData', { headers, body })

    // console.log('requestData_GetObject.requestData', requestData)

    return requestData
}

// OK
export function requestData_GetObject(dataType: string, object_id: string): XTSRequestData {

    const requestObject = createXTSObject('XTSGetObjectsRequest')
    const objectId = createXTSObject('XTSObjectId')
    objectId.dataType = dataType
    objectId.id = object_id
    requestObject.objectIds = [objectId]

    const headers = {}
    const body = requestObject
    const requestData = createXTSObject('XTSRequestData', { headers, body })

    // console.log('requestData_GetObject.requestData', requestData)

    return requestData
}

//
export function requestData_SaveObject(dataObject: XTSObject): XTSRequestData {

    // const savingObject = createXTSObject(dataObject._type, null, dataObject)
    // const savingObject = { ...dataObject } as { [key: string]: any }
    // console.log('savingObject 1', savingObject)

    // for (let key in savingObject) {
    //     if (dataObject.hasOwnProperty(key)) {
    //         savingObject[key] = dataObject[key]
    //     }
    // }
    // console.log('formValues', formValues)

    console.log('dataObject', dataObject)
    // const xtsValues = formDataToXTSValues(formValues, dataObject._type)
    // console.log('valuesObject', xtsValues)

    // dataObject.fillPropertyValues(xtsValues)
    // for (let key in xtsValues) {
    //     savingObject[key] = xtsValues[key]
    // }
    // for (let tabName in valueTabs) {
    //     savingObject[tabName] = valueTabs[tabName]
    // }

    // const valuesObject = formDataToXTSObject(formValues, dataObject._type)
    // const saveableObject = { ...dataObject, ...valuesObject }
    // console.log('valuesObject', valuesObject)

    const requestName = (isEmptyObjectId(dataObject.objectId)) && 'XTSCreateObjectsRequest' || 'XTSUpdateObjectsRequest'
    const requestObject = createXTSObject(requestName)

    // if (requestName === 'XTSCreateObjectsRequest') {
    //     addDefaultValues(newObject, defaultValues)
    // }

    requestObject.objects = [dataObject]

    const headers = {}
    // const body = JSON.stringify(requestObject)
    const body = requestObject
    const requestData = createXTSObject('XTSRequestData', { headers, body })

    return requestData
}

//
export function requestData_CreateObject(dataObject: XTSObject, fillingValues?: any): XTSRequestData {

    const requestName = 'XTSCreateObjectRequest'
    const requestObject = createXTSObject(requestName)

    requestObject.object = dataObject
    requestObject.fillingValues = fillingValues

    const headers = {}
    // const body = JSON.stringify(requestObject)
    const body = requestObject
    const requestData = createXTSObject('XTSRequestData', { headers, body })

    return requestData
}

//
export function requestData_UpdateObject(attributeValues: { [key: string]: any }): XTSRequestData {

    const requestName = 'XTSUpdateObjectsRequest'
    const requestObject = createXTSObject(requestName)

    requestObject.objects = [attributeValues]

    const headers = {}
    // const body = JSON.stringify(requestObject)
    const body = requestObject
    const requestData = createXTSObject('XTSRequestData', { headers, body })

    return requestData
}

//
export function requestData_UploadFile(
    fileInfo: XTSFile, attributeName: string, binaryData: string
): XTSRequestData {

    const requestObject = createXTSObject('XTSUploadFileRequest')
    requestObject['file'] = fileInfo
    requestObject['attributeName'] = attributeName
    requestObject['binaryData'] = binaryData

    const formData = new FormData()
    for (let key in requestObject) {
        formData.append(key, requestObject[key])
    }

    const headers = { "Content-Type": 'multipart/form-data' }
    const body = requestObject
    const requestData = createXTSObject('XTSRequestData', { headers, body })

    return requestData
}

// OK
export function requestData_ByDataItem(requestName: string, dataItem: { [key: string]: any }): XTSRequestData {

    const requestObject = createXTSObject(requestName, dataItem)

    // const headers = { 'Content-Type': 'application/json' }
    const headers = {}
    const body = requestObject
    const requestData = createXTSObject('XTSRequestData', { headers, body })

    // console.log('requestObject')
    // console.log(formValues)
    // console.log(requestObject)

    return requestData
}

// OK
export function requestData_ByPropertyValues(requestName: string, propertyValues: { [key: string]: any }): XTSRequestData {

    // console.log('requestData_ByDataItem.requestObject', dataItem)
    const requestObject = createXTSObject(requestName)
    // console.log('requestData_ByDataItem.requestObject', requestObject)

    for (let key in propertyValues) {
        if (requestObject.hasOwnProperty(key)) {
            requestObject[key] = propertyValues[key]
            // console.log('key', key)
        }
    }

    // const headers = { 'Content-Type': 'application/json' }
    const headers = {}
    const body = requestObject
    // const requestData = { headers, body }
    const requestData = createXTSObject('XTSRequestData', { headers, body })

    // console.log('requestObject')
    // console.log(formValues)
    // console.log(requestObject)

    return requestData
}

// 
export function requestData_GetRecordSet(dataType: string, filter: XTSRecordFilter): XTSRequestData {

    const requestObject = createXTSObject('XTSGetRecordSetRequest', { dataType, filter })

    const headers = {}
    const body = requestObject
    const requestData = createXTSObject('XTSRequestData', { headers, body })

    // console.log('requestData_GetObject.requestObject', requestObject)
    // console.log('requestData_GetObject.requestData', requestData)

    return requestData
}

// 
export function requestData_GetRecord(recordKey: XTSRecordKey): XTSRequestData {

    const { dataType, filter } = recordKey
    const requestObject = createXTSObject('XTSGetRecordSetRequest', { dataType, filter })

    const headers = {}
    const body = requestObject
    const requestData = createXTSObject('XTSRequestData', { headers, body })

    // console.log('requestData_GetObject.requestObject', requestObject)
    // console.log('requestData_GetObject.requestData', requestData)

    return requestData
}

//
export function requestData_SaveRecord(dataRecord: XTSRecord, dimensions: string[]): XTSRequestData {

    // console.log('dataRecord', dataRecord)
    // console.log('dimensions', dimensions)

    const dataType = dataRecord._type
    const recordSet = createXTSObject('XTSRecordSet', { dataType, records: [dataRecord] })
    for (let dimension of dimensions) {
        // filter có các trường bổ sung, vậy nên cần gán riêng
        recordSet.filter.addFilterItem(dimension, (dataRecord as any)[dimension])
    }
    // console.log('recordSet', recordSet)

    const requestObject = createXTSObject('XTSUpdateRecordSetRequest', { recordSet })

    const headers = {}
    const body = requestObject
    const requestData = createXTSObject('XTSRequestData', { headers, body })

    return requestData
}

//
export function requestData_SaveRecordSet(dataType: string, dataRecords: XTSRecord[], filter: XTSRecordFilter): XTSRequestData {

    // console.log('dataRecords', dataRecords)

    const recordSet = createXTSObject('XTSRecordSet', { dataType, records: dataRecords })
    recordSet.filter = filter           // filter có các trường bổ sung, vậy nên cần gán riêng
    const requestObject = createXTSObject('XTSUpdateRecordSetRequest', { recordSet })

    const headers = {}
    const body = requestObject
    const requestData = createXTSObject('XTSRequestData', { headers, body })

    return requestData
}


// OK
export function requestData_GetRelatedDocument(objectId: XTSObjectId): XTSRequestData {

    const requestObject = createXTSObject('XTSGetRelatedDocumentsRequest')
    requestObject.objectId = objectId

    const headers = {}
    const body = requestObject
    const requestData = createXTSObject('XTSRequestData', { headers, body })

    // console.log('requestData_GetObject.requestData', requestData)

    return requestData
}

/////////////////////////////////////////////
// Export's

