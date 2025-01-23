
import { XTSRecordFilter, XTSType } from "./types-common"
import { ITEM_VALUE_ACTIONS } from "./types-components"

export class XTSItemValue extends XTSType {

    itemName: string = ''
    // edit: boolean = false
    id: string = ''
    dataType: string = ''
    presentation: string = ''
    filter?: XTSRecordFilter
    dataItem?: any
    action: ITEM_VALUE_ACTIONS = ITEM_VALUE_ACTIONS.LIST

    constructor() {
        super('XTSItemValue')
    }
}
