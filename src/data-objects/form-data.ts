/////////////////////////////////////////////
// Application's

// import { createXTSObject } from "./objects"
import { dayjsToString, formatDateTime, generateUUID, isDate, stringToDayjs } from "../commons/common-use"
// import { objectsDescription, objectsEnums } from "./types"
// import { connectParams } from "../commons/connect-params"
// import { addDefaultValues } from "./add-default-values"
import { createXTSObject, isEmptyObjectId } from "./common-use"
import dayjs, { Dayjs } from "dayjs"
import { XTSObject, XTSRecord, XTSType } from "./types-common"


/////////////////////////////////////////////
// Begin

// Xem xét lại có cần dùng hàm này không
export function xtsValueToFormValue(xtsValue: any, key: string): any {

    try {

        var result = undefined
        // if (dayjs.isDayjs(xtsValue)) {
        //     result = (xtsValue as Dayjs).format('YYYY-MM-DDTHH:mm:ss')
        // } else
        if (Array.isArray(xtsValue)) {
            // result = undefined
        } else if (xtsValue === 'string') {
            if (isDate(xtsValue)) {
                result = dayjs(xtsValue)
            } else {
                result = xtsValue
            }
        } else if (typeof xtsValue === 'number') {
            result = xtsValue
        } else if (typeof xtsValue === 'boolean') {
            result = xtsValue
        } else if (typeof xtsValue === 'object') {
            if (xtsValue['_type'] === 'XTSObjectId') {
                result = {
                    [key + '_id']: xtsValue?.id,
                    [key + '_type']: xtsValue?._type,
                    [key + '_dataType']: xtsValue?.dataType,
                    [key + '_presentation']: xtsValue?.presentation,
                }
            }
        }

    } catch (error) {
        console.log('error', error)
    }

    return result
}

// Thực ra không có ý nghĩa lắm, có thể xem xét không dùng
export function xtsObjectToFormData(xtsObject: XTSType): { [key: string]: any } {

    // console.log('xtsObject')
    // console.log(xtsObject)
    // console.log('objectsDescription: xtsObjectToFormData')
    // console.log(objectsDescription)

    const formValues: { [key: string]: any } = {}

    if (!xtsObject) {
        return formValues
    }

    if (!xtsObject.hasOwnProperty('_type')) {
        return formValues
    }

    for (let key in xtsObject) {
        const xtsValue = (xtsObject as { [key: string]: any })[key]

        var formValue = undefined

        // console.log('key', key)
        // console.log('xtsValue', xtsValue)
        // console.log('typeof', typeof xtsValue)

        if (Array.isArray(xtsValue)) {
            // result = undefined
        } else if (typeof xtsValue === 'string') {
            if (isDate(xtsValue)) {
                formValue = dayjs(xtsValue)
            } else {
                formValue = xtsValue
            }
        } else if (typeof xtsValue === 'number') {
            formValue = xtsValue
        } else if (typeof xtsValue === 'boolean') {
            formValue = xtsValue
        } else if (xtsValue === null) {
            // console.log('key', key)
        } else if (typeof xtsValue === 'object') {
            if (xtsValue['_type'] === 'XTSObjectId') {
                formValue = {
                    [key + '_id']: xtsValue.id,
                    [key + '_type']: xtsValue._type,
                    [key + '_dataType']: xtsValue.dataType,
                    [key + '_presentation']: xtsValue.presentation,
                }
                Object.assign(formValues, formValue)
                formValue = xtsValue.presentation
            }
        }

        formValues[key] = formValue
    }
    // console.log('formValues', formValues)

    return formValues
}

// Xem xét lại, có thể không cần dùng
// Lấy giá trị kiểu XTS từ formData.
export function formDataToXTSValue(formValues: { [key: string]: any }, itemName: string, dataType: string): any {

    var xtsValue = undefined
    const formValue = formValues[itemName]

    if (dataType === 'Number') {
        xtsValue = formValue
    } else if (dataType === 'Boolean') {
        xtsValue = formValue
    } else if (dataType === 'Number') {
        xtsValue = formValue
    } else if (dataType === 'Date' || dataType === 'DateTime') {
        xtsValue = (formValue as Dayjs).format('YYYY-MM-DDTHH:mm:ss')
    } else if (dataType === 'XTSObjectId') {

        const propertyName_dataType = itemName + '_dataType'
        const propertyName_presentation = itemName + '_presentation'
        const propertyName_id = itemName + '_id'

        const id = formValues[propertyName_id]
        const dataType = formValues[propertyName_dataType]
        const presentation = formValues[propertyName_presentation]

        xtsValue = createXTSObject('XTSObjectId', { id, dataType, presentation })
    }

    // console.log('xtsValue 2', xtsValue)
    return xtsValue
}

// function formDataToXTSValues(formValues, dataType) {

//     const xtsValues = {}
//     const xtsProperties = xtsObjectProperties(dataType)
//     // console.log('xtsProperties', xtsProperties)
//     for (let key in xtsProperties) {
//         if (key === '_type') {
//             continue
//         }

//         const property = xtsProperties[key]
//         if (formValues.hasOwnProperty(key)) {
//             xtsValues[key] = formDataToXTSValue(formValues, property)
//         }
//     }

//     return xtsValues
// }

// Có thể không cần dùng, có thể xem xét lại
export function formDataToXTSValues(formValues: { [key: string]: any }, dataType: string): { [key: string]: any } {

    const xtsObject = createXTSObject(dataType)

    if (!xtsObject) { return xtsObject }

    for (let key in xtsObject) {
        if (key === '_type') {
            continue
        }
        xtsObject[key] = formDataToXTSValue(formValues, key, xtsObject[key])
    }

    // Xóa bỏ các trường có giá trị là trắng
    for (let key in xtsObject) {
        if (!xtsObject[key]) {
            delete xtsObject[key]
        }
    }

    console.log('xtsObject', xtsObject)

    return xtsObject
}

// Cần xem lại vì trùng với formDataToXTSValue ???? ==> Không trùng, vì khác loại tham số
// Để tạo giá trị mặc định cho initialValue
//
export function dataObjectToItemValue(dataObject: XTSObject | XTSRecord, itemName: string, dataType: string) {

    var itemValue = createXTSObject('XTSItemValue')

    // var itemValue = { id: null, _type: dataType, dataType, presentation: null, itemName }
    if (dataObject) {
        const xtsValue = (dataObject as { [key: string]: any })[itemName]
        const id = xtsValue?.id
        const _type = xtsValue?._type || dataType
        const _dataType = xtsValue?.dataType || dataType
        const presentation = xtsValue?.presentation || xtsValue
        itemValue = { id, dataType: _dataType, presentation, itemName, _type }
    }
    // console.log('dataObjectToItemValue.dataObject', dataObject)
    return itemValue
}


// Cần xem lại vì trùng với formDataToXTSValue ???? ==> Không trùng, vì khác loại tham số
// Để tạo giá trị mặc định cho initialValue
//
// function formDataToItemValue(formData, itemName, dataType) {

//     var itemValue = { id: null, _type: dataType, dataType, presentation: null, itemName }
//     if (formData) {
//         const id = formData[itemName + '_id']
//         const _type = formData[itemName + '_type'] || dataType
//         const _dataType = formData[itemName + '_dataType'] || (dataType)
//         const presentation = formData[itemName + '_presentation'] || formData[itemName]
//         itemValue = { id, dataType: _dataType, presentation, itemName, _type }
//     }
//     return itemValue
// }

// Không cần nữa, vì đã có getXTSObjectProperties
// function xtsObjectProperties(dataType) {
//     const xtsDescriptions = objectsDescription
//     if (xtsDescriptions.hasOwnProperty(dataType)) {
//         return xtsDescriptions[dataType]
//     }
// }

/////////////////////////////////////////////
// Export's
