
import { FormInstance } from "antd"
import { XTSObject, XTSObjectId, XTSObjectRow, XTSRecord } from "./types-common"
import { XTSItemValue } from "./types-form"
import { isEmptyObjectId } from "./common-use"

export enum ITEM_VALUE_ACTIONS {
    VIEW = 'VIEW',
    EDIT = 'EDIT',
    // PRINT = 'PRINT',
    CHOICE = 'CHOICE',
    LIST = 'LIST',
    ESCAPE = 'ESCAPE',
    // GET_RELATED = 'GET_RELATED',
}

export interface XTSChoicePageProps {
    modalProps: { [key: string]: any }
    itemName: string
    dataType: string
    objectIds?: XTSObjectId[]
    form?: any              // Xem xét bỏ đi
    // pageOwnerId: string
    choiceItemValue: (itemValue: XTSItemValue) => void
    // setPageInfo: () => void
}

export interface XTSViewPageProps {
    modalProps: { [key: string]: any }
    dataType: string
    id: string
    choiceItemValue: (itemValue: XTSItemValue) => void
}

export interface XTSSubPageProps {
    modalProps: { [key: string]: any }
    pageName: string
    itemValue: XTSItemValue
    // form?: any
    // pageOwnerId: string
    choiceItemValue: (itemValue: XTSItemValue) => void
    // setPageInfo: () => void
}

export interface XTSPrintPageProps {
    objectId: XTSObjectId
    title: string
    open: boolean
    pageName: string
    // itemValue: XTSItemValue
    choiceItemValue: (itemValue: XTSItemValue) => void
}

// Đã được khai báo trong component RelatedPage
// export interface XTSRelatedPageProps {
//     objectId: XTSObjectId
//     title: string
//     open: boolean
//     pageName: string
//     // itemValue: XTSItemValue
//     choiceItemValue: (itemValue: XTSItemValue) => void
// }

/////////////////////////////////////////////
// Object's

export enum USAGE_MODES {
    DEFAULT = 'DEFAULT',
    ITEM_VIEW = 'ITEM_VIEW',
    LIST_VIEW = 'LIST_VIEW',
}

export interface XTSObjectIndexProps {
    itemName?: string
    renderKey?: number
    objectIds?: XTSObjectId[]
    id?: string
    // usageMode?: USAGE_MODES
    choiceItemValue?: (itemValue: XTSItemValue) => void
}

export interface XTSObjectListProps {
    pageId: string
    itemName?: string
    objectIds?: XTSObjectId[]
    usageMode?: USAGE_MODES
    renderKey?: number
    choiceItemValue?: (itemValue: XTSItemValue) => void
    stepBack?: () => void
}

export interface XTSObjectCardProps {
    item: XTSObject
    itemName?: string
    additionals?: any
    choiceItemValue?: (itemValue: XTSItemValue) => void
    stepBack?: () => void
}

export interface XTSObjectViewProps {
    pageId: string
    itemValue: XTSItemValue
    itemName?: string
    usageMode?: USAGE_MODES
    additionals?: any
    renderKey?: number
    choiceItemValue?: (itemValue: XTSItemValue) => void
    stepBack?: () => void
}

export interface XTSObjectEditProps {
    pageId: string
    itemValue: XTSItemValue
    itemName?: string
    additionals?: any
    choiceItemValue?: (itemValue: XTSItemValue) => void
    stepBack?: () => void
    afterSave?: (saveParams: any) => void
}

export interface XTSObjectPrintProps {
    pageId?: string
    objectId: XTSObjectId
    // itemName?: string
    // additionals?: any
    choiceItemValue?: (itemValue: XTSItemValue) => void
    stepBack?: () => void
}

// export interface XTSObjectRelatedDocumentsProps {
//     // pageId?: string
//     objectId: XTSObjectId
//     // itemName?: string
//     // additionals?: any
//     choiceItemValue: (itemValue: XTSItemValue) => void
//     stepBack?: () => void
// }

export interface XTSObjectRelatedProps {
    objectId: XTSObjectId
    // renderKey?: number
    choiceItemValue?: (itemValue: XTSItemValue | undefined) => void
}

export interface XTSObjectRowProps {
    dataRow: XTSObjectRow
    dataObject?: XTSObject
    // pageId: string
    // itemName?: string
    additionals?: any
    form?: FormInstance
    updateRow: (tabName: string, dataRow: XTSObjectRow) => void
    deleteRow: (tabName: string, _lineNumber: number) => void
}

/////////////////////////////////////////////
// Record's

export interface XTSRecordIndexProps {
    itemName?: string
    choiceItemValue?: (itemValue: XTSItemValue | undefined) => void
}

export interface XTSRecordListProps {
    pageId: string
    itemName?: string
    renderKey?: number
    choiceItemValue?: (itemValue: XTSItemValue) => void
    stepBack?: () => void
}

export interface XTSRecordCardProps {
    item: XTSRecord
    itemName?: string
    additionals?: any
    choiceItemValue?: (itemValue: XTSItemValue) => void
    stepBack?: () => void
}

export interface XTSRecordViewProps {
    itemValue: XTSItemValue
    itemName?: string
    additionals?: any
    choiceItemValue?: (itemValue: XTSItemValue) => void
    stepBack?: () => void
}

export interface XTSRecordEditProps {
    itemValue: XTSItemValue
    pageId: string
    itemName?: string
    additionals?: any
    choiceItemValue?: (itemValue: XTSItemValue) => void
    stepBack?: () => void
}

// export interface XTSObjectRowProps {
//     dataRow: XTSObjectRow
//     // pageId: string
//     // itemName?: string
//     additionals?: any
//     updateRow: (tabName: string, dataRow: XTSObjectRow) => void
//     deleteRow: (tabName: string, _lineNumber: number) => void
// }


/////////////////////////////////////////////
// Report

export interface XTSReportParam {
    name: string
    value: any
}

export interface XTSReportProps {
    reportId: string
    reportParams: XTSReportParam[]
    reportTitle: string
}



/////////////////////////////////////////////
// 

export interface XTSMediaItem {
    id: string,
    dataType: string,
    imageSrc: string,
    presentation: string,
}

