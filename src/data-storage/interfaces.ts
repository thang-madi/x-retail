import { timeStamp } from "console"
import { XTSObject, XTSObjectId, XTSRecord, XTSResponse } from "../data-objects/types-common"
import { PAGE_ACTIONS } from "../commons/enums"
import { StringStepperProps } from "antd-mobile/es/components/stepper/stepper"
import { XTSRelatedDocument } from "../data-objects/types-application"

/////////////////////////////////////////////
// State

// OK
export type XTSState = XTSObjectState | XTSRecordState | XTSSessionState

// OK
export interface XTSBaseState {
    status: string
    error: string
    tempData: any
}

// interface VList {
//     objects: XTSObject[]
//     searchString: string
//     searchFields: string[]
// }

// OK
export interface XTSListFilterItem {
    key: string
    value: any
}

// OK
export interface XTSListSortItem {
    key: string
    descending: boolean
}

// OK
export interface XTSObjectState extends XTSBaseState {
    objects: XTSObject[]
    uploadFilesCountDown: number
    // vList: VList

    scrollTop: number
    scrollLeft: number
    // scrollRow: number       // Sau này sẽ bỏ dần
    // scrollColumn: number    // Sau này sẽ bỏ dần
    searchString: string
    searchFields: string[]

    sortBy: XTSListSortItem[]
    filter: XTSListFilterItem[]
}

// OK
export interface XTSRecordState extends XTSBaseState {
    records: XTSRecord[]
    dimensions: string[]
    // vList: VList

    scrollTop: number
    scrollLeft: number
    // scrollRow: number       // Sau này sẽ bỏ dần
    // scrollColumn: number    // Sau này sẽ bỏ dần
    searchString: string
    searchFields: string[]
}

// OK
export interface XTSSessionState extends XTSBaseState {

    deviceId: string
    userName: string
    userToken: string
    acessToken: string

    telegramId: string
    zaloId: string
    phone: string
    roles: string[]

    user?: XTSObjectId
    userProfile?: XTSObjectId
    externalAccount?: XTSObjectId
    externalAccountId: string
    externalAccountOwner: string

    company?: XTSObjectId,
    employee?: XTSObjectId,
    customer?: XTSObjectId,

    fileStorageURL: string
    defaultValues?: XTSSettings
}

// OK
export interface XTSCurrentState extends XTSBaseState {
    pageTitle: string
    pageName: string
    pageId: string
    pageAction: PAGE_ACTIONS

    relatedDocuments: XTSRelatedDocument[]

    // dashboard: XTSDashboard
}

// OK
export interface XTSReportState extends XTSBaseState {
    dashboard: XTSDashboard
}

// OK
export interface XTSDashboard {
    salesAmount: number,
    salesOrders: number,
    receiptCash: number,
    receiptBank: number,
    postPayment: number,
    orderToPrepay: number,
    orderPreparing: number,
    orderTransporting: number
}

/////////////////////////////////////////////
// Action

// OK
export interface XTSSliceAction {
    type: string
    payload: any
}

/////////////////////////////////////////////
// Additional's

// Xem lại
export interface XTSSettings {
    customer?: XTSObjectId
    company?: XTSObjectId
    shipper?: XTSObjectId
}

// Xem lại, có thể không cần dùng, vì đã có trong XTSCurrentState
export interface XTSPageInfo {
    pageTitle: string
    pageName: string
    pageId: string
    pageAction: PAGE_ACTIONS
}

// Thay bằng class trong ../data-objects/types-request
// export interface XTSRequestData {
//     url: any
//     headers: any
//     body: any
//     method: string
// }