
import * as Types_Common from './types-common'
import * as Types_Library from './types-library'
import * as Types_Application from './types-application'
import * as Types_Request from './types-request'
import * as Types_Form from './types-form'
// import * as Types_Storage from '../data-storage/types'

import * as Types_Enums from './types-enums'

import { XTSObjectId } from './types-common'
import { typesDescription } from './jsons/types'
import { isDate } from '../commons/common-use'
import { XTSMediaItem } from './types-components'
// import { isDate } from 'util/types'


// Constants

const AllTypes: { [key: string]: any } = {
    ...Types_Common,
    ...Types_Library,
    ...Types_Application,
    ...Types_Request,
    ...Types_Form,
    // ...Types_Storage,
}

// Methods

// OK
export function createXTSObject(_type: string, propertyValues: any = undefined): any {

    const XTSClass = getXTSClass(_type)
    if (XTSClass) {
        let dataType = _type
        if (_type === 'XTSFile' && typeof propertyValues === 'object') {
            dataType = propertyValues._type
        }
        // console.log('createXTSObject.dataType', dataType)
        const instance = (_type === 'XTSFile') && new XTSClass(dataType) || new XTSClass()
        if (typeof propertyValues === 'object') {
            for (let key in propertyValues) {
                if (instance.hasOwnProperty(key)) {
                    if (instance[key] === undefined) {
                        instance[key] = propertyValues[key]
                    } else {
                        fillXTSPropertyValue(instance, key, propertyValues[key])
                    }
                }
            }
        }
        return instance
    }
}

// 
function fillXTSPropertyValue(xtsObject: any, propertyName: string, propertyValue: any): void {

    const xtsPropertyValue = xtsObject[propertyName]
    if (Array.isArray(xtsObject[propertyName])) {
        for (let item of propertyValue) {
            // console.log('itemRow', item)
            const xtsRow = createXTSObject(item._type, item)
            // console.log('xtsRow', xtsRow)
            xtsObject[propertyName].push(xtsRow)
        }
    } else if (typeof xtsPropertyValue === 'number') {
        xtsObject[propertyName] = propertyValue || 0
    } else if (typeof xtsPropertyValue === 'boolean') {
        xtsObject[propertyName] = propertyValue || false
    } else if (typeof xtsPropertyValue === 'string') {
        // console.log('xtsPropertyValue', xtsPropertyValue)
        if (isDate(xtsPropertyValue)) {
            xtsObject[propertyName] = propertyValue || '0001-01-01T00:00:00'
        } else {
            xtsObject[propertyName] = propertyValue || ''
        }
    } else if (typeof xtsPropertyValue === 'object') {
        const _type = xtsPropertyValue['_type']
        if (_type === 'XTSObjectId') {
            xtsObject[propertyName]._type = 'XTSObjectId'
            xtsObject[propertyName].dataType = propertyValue?.dataType || ''
            xtsObject[propertyName].id = propertyValue?.id || ''
            xtsObject[propertyName].presentation = propertyValue?.presentation || ''
        } else {
            xtsObject[propertyName] = createXTSObject(_type, propertyValue)
        }
    }
}


// OK 
// Thường không dùng cho class
export function fillPropertyValues(target: any, source: any): void {

    for (const key in source) {
        if (target.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
}

// Không cần dùng nữa, thay bằng fillXTSPropertyValue
// function getXTSPropertyValue(propertyValue: any): any {

//     var result = propertyValue
//     if (Array.isArray(propertyValue)) {
//         result = []
//         for (let rowValue of propertyValue) {
//             result.push(getXTSPropertyValue(rowValue))
//         }
//     } else if (typeof propertyValue === 'object') {
//         const _type = propertyValue['_type']
//         if (_type) {
//             result = createXTSObject(_type, { ...propertyValue })
//         }
//     }

//     return result
// }

// OK
export function getXTSClass(_type: string): any {

    const XTSClass = AllTypes[_type]

    return XTSClass
}

// OK
export function getXTSEnum(_type: string): any {

    const XTSEnum = (Types_Enums as { [key: string]: any })[_type]

    return XTSEnum
}

// OK
export function getXTSEnumItem(_type: string, key: string): XTSObjectId | undefined {

    const XTSEnum = getXTSEnum(_type)
    if (XTSEnum && XTSEnum.hasOwnProperty(key)) {
        // return XTSEnum[key] as XTSObjectId
        return createXTSObject('XTSObjectId', XTSEnum[key])
    }
}

// OK
export function getClassName(object: any): string {

    return object.constructor.name
}

// OK
export function getXTSObjectProperties(_type: string): any {

    return (typesDescription as any)[_type]
}

// OK
export function writeJSON(object: any): string {

    return JSON.stringify(object, null, 4)
}

// OK
export function readJSON(stringJSON: string): any {

    var tempObject: any
    try {
        tempObject = JSON.parse(stringJSON)
    } catch (error) {
        // throw Error('Read stringJSON error!')
        return
    }

    const _type = tempObject['_type']
    console.log('readJSON.tempObject', tempObject)
    const xtsObject = createXTSObject(_type, tempObject)

    // for (let propertyName in xtsObject) {
    //     if (tempObject.hasOwnProperty(propertyName)) {
    //         xtsObject[propertyName] = getXTSPropertyValue(tempObject[propertyName])
    //     }
    // }

    return xtsObject
}

// // OK
// export function compareXTSValues(value1: any, value2: any): boolean {

//     var result = false

//     try {
//         if (value1 && value1 === value2) {
//             result = true
//         } else if (!value1 && !value2) {
//             result = true
//         } else {
//             let _value1: any = value1
//             let _value2: any = value2
//             if (value1 && typeof value1 === 'object' && value1['_type'] === 'XTSObjectId') {
//                 if (isEmptyObjectId(value1)) {
//                     _value1 = null
//                 } else {
//                     _value1 = value1.id
//                 }
//             }
//             if (value2 && typeof value2 === 'object' && value2['_type'] === 'XTSObjectId') {
//                 if (isEmptyObjectId(value2)) {
//                     _value2 = null
//                 } else {
//                     _value2 = value2.id
//                 }
//             }
//             result = (_value1 === _value2)
//         }
//     } catch (error) {
//         console.log('compareValues values error', value1, value2)
//     }

//     return result
// }

// OK
export function compareXTSValues(value1: any, value2: any): number {

    var result = 0
    try {
        if ((value1 === null || value1 === undefined) && (value2 === null || value2 === undefined)) {
            result = 0
        } else if ((value1 !== null && value1 !== undefined) && (value2 === null || value2 === undefined)) {
            result = 1
        } else if ((value1 === null || value1 === undefined) && (value2 !== null && value2 !== undefined)) {
            result = -1
        } else if (value1 === value2) {
            result = 0
        } else if (typeof value1 === 'object') {
            let _id1: any = value1
            let _id2: any = value2
            let _presentation1 = ''
            let _presentation2 = ''
            if (value1 && typeof value1 === 'object' && value1['_type'] === 'XTSObjectId') {
                if (isEmptyObjectId(value1)) {
                    _id1 = null
                } else {
                    _id1 = value1.id
                    _presentation1 = value1.presentation
                }
            }
            if (value2 && typeof value2 === 'object' && value2['_type'] === 'XTSObjectId') {
                if (isEmptyObjectId(value2)) {
                    _id2 = null
                } else {
                    _id2 = value2.id
                    _presentation2 = value2.presentation
                }
            }
            // console.log('_id1, _id2', value1, value2)
            if (_id1 === _id2) {
                result = 0
            } else if (_presentation1 === _presentation2) {
                result = 0
            } else {
                result = _presentation1 > _presentation2 ? 1 : -1;
                // console.log(_presentation1, _presentation2)
            }
        } else {
            // console.log('value1, value2', value1, value2)
            result = value1 > value2 ? 1 : -1;
        }
    } catch (error) {
        console.log('compareValues values error', value1, value2)
    }

    return result
}

// OK
export function isEmptyObjectId(objectId: XTSObjectId): boolean {

    if (!objectId === undefined) {
        return true
    } else if (!objectId?.id) {
        return true
    } else {
        return false
    }
}

export function createXTSMediaItem(avatar: XTSObjectId | undefined): XTSMediaItem {

    const mediaItem = {
        id: '',
        dataType: '',
        imageSrc: '',
        presentation: '',
    }

    if (avatar) {
        Object.assign(mediaItem, avatar)
    }

    return mediaItem
}

export function compareFunction(value1: any, value2: any) {

    const type1 = typeof value1
    const type2 = typeof value2
    if (value1 && value2) {
        if (type1 === type2) {
            // Nếu cùng kiểu, sắp xếp theo kiểu tương ứng 
            if (type1 === 'number' || type2 === 'boolean') {
                return value1 - value2
            }
            if (type1 === 'string') {
                return value1.localeCompare(value2)
            }
            if (type1 === 'object' && value1.hasOwnProperty('_type') && value1['_type'] === 'objectId') {
                return value1.presentation.localeCompare(value2.presentation)
            }
            if (value1 instanceof Date && value2 instanceof Date) {
                // return value1 - value2
            }
        } else {
            // Nếu khác kiểu, sắp xếp theo thứ tự ưu tiên kiểu dữ liệu 
            const order = ['number', 'boolean', 'string', 'object']
            return order.indexOf(type1) - order.indexOf(type2)
        }
    }
}

export function objectPresentation(objectId: XTSObjectId, additionalInfo: any = undefined) {

    switch (objectId?.dataType) {
        case 'XTSOrder':
            return objectId.presentation
                .replace('Đơn hàng của khách', 'Đơn hàng số')
                .replace('(chưa kết chuyển)', '(nháp)') ||
                'Đơn hàng *'

        case 'XTSPurchaseOrder':
            return objectId.presentation
                .replace('Đơn hàng đặt nhà cung cấp', 'Đơn hàng mua số')
                .replace('(chưa kết chuyển)', '(nháp)') ||
                'Đơn hàng mua *'

        case 'XTSSalesInvoice':
            return objectId.presentation
                .replace('Hóa đơn giao hàng', 'Giao hàng số')
                .replace('(chưa kết chuyển)', '(nháp)') ||
                'Giao hàng *'

        case 'XTSSupplierInvoice':
            if (additionalInfo?.presentation === 'Nhận hàng bán bị trả lại') {
                return objectId.presentation
                    .replace('Hóa đơn nhận hàng', 'Nhận hàng trả lại số')
                    .replace('(chưa kết chuyển)', '(nháp)') ||
                    'Nhận hàng trả lại *'
            } else {
                return objectId.presentation
                    .replace('Hóa đơn nhận hàng', 'Nhận hàng số')
                    .replace('(chưa kết chuyển)', '(nháp)') ||
                    'Nhận hàng *'
            }

        case 'XTSCashReceipt':
            return objectId.presentation
                .replace('Phiếu thu', 'Thu tiền mặt số')
                .replace('(chưa kết chuyển)', '(nháp)') ||
                'Thu tiền mặt *'

        case 'XTSCashPayment':
            return objectId.presentation
                .replace('Phiếu chi', 'Chi tiền mặt số')
                .replace('(chưa kết chuyển)', '(nháp)') ||
                'Chi tiền mặt *'

        case 'XTSPaymentReceipt':
            return objectId.presentation
                .replace('Thu tiền vào tài khoản', 'Thu chuyển khoản số')
                .replace('(chưa kết chuyển)', '(nháp)') ||
                'Thu chuyển khoản *'

        case 'XTSPaymentExpense':
            return objectId.presentation
                .replace('Chi tiền từ tài khoản', 'Chi chuyển khoản số')
                .replace('(chưa kết chuyển)', '(nháp)') ||
                'Chi chuyển khoản *'

        default:
            return objectId?.presentation
    }

}