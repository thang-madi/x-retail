
import * as Types_Common from './types-common'
import * as Types_Library from './types-library'
import * as Types_Application from './types-application'
import * as Types_Enums from './types-enums'

// Đã có trong data-objects/common-use
export function _getXTSClass(_type: string): any {

    // let result = (Types_Common as { [key: string]: any })[_type]
    // if (!result) {
    //     result = (Types_Library as { [key: string]: any })[_type]
    // }
    // if (!result) {
    //     result = (Types_Application as { [key: string]: any })[_type]
    // }

    const AllTypes: { [key: string]: any } = {
        ...Types_Common,
        ...Types_Library,
        ...Types_Application,
    }
    const result = (AllTypes as { [key: string]: any })[_type]

    return result
}

// Đã có trong data-objects/common-use
export function _getXTSEnum(_type: string): any {

    const result = (Types_Enums as { [key: string]: any })[_type]
    return result

}