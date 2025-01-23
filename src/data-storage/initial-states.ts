import { PAGE_ACTIONS, REQUEST_STATUSES } from "../commons/enums"
import { XTSCurrentState, XTSListSortItem, XTSObjectState, XTSRecordState, XTSReportState, XTSSessionState } from "./interfaces"


export function initialState_Objects(searchFields: string[] = [], sortBy: XTSListSortItem[] = []) {

    const initialState: XTSObjectState = {

        objects: [],
        uploadFilesCountDown: -1,

        // vList: {
        //     objects: [],
        //     searchString: '',
        //     searchFields: searchFields,
        // },

        scrollTop: 0,
        scrollLeft: 0,
        // scrollRow: 0,
        // scrollColumn: 0,
        searchString: '',
        searchFields: searchFields,
        filter: [],
        sortBy: sortBy,

        status: REQUEST_STATUSES.IDLE,
        error: '',
        tempData: null,
    }

    return initialState
}

export function initialState_Records(dimensions: string[] = [], searchFields: string[] = []) {

    const initialState: XTSRecordState = {

        records: [],
        dimensions: dimensions,

        // vList: {
        //     objects: [],
        //     searchString: '',
        //     searchFields: searchFields
        // },

        scrollTop: 0,
        scrollLeft: 0,
        // scrollRow: 0,
        // scrollColumn: 0,
        searchString: '',
        searchFields: searchFields,

        status: REQUEST_STATUSES.IDLE,
        error: '',
        tempData: undefined,
    }

    return initialState
}

export function initialState_Session() {

    const initialState: XTSSessionState = {

        deviceId: '',
        userName: '',
        userToken: '',
        acessToken: '',

        telegramId: '',
        zaloId: '',
        phone: '',
        roles: ['anonymous'],

        user: undefined,
        userProfile: undefined,
        externalAccount: undefined,
        externalAccountId: '',
        externalAccountOwner: '',

        company: undefined,
        employee: undefined,
        customer: undefined,

        fileStorageURL: '',
        defaultValues: undefined,

        status: REQUEST_STATUSES.IDLE,
        error: '',
        tempData: undefined
    }

    return initialState
}

export function initialState_Current() {

    const initialState: XTSCurrentState = {

        pageTitle: '',
        pageName: '',
        pageId: '',
        pageAction: PAGE_ACTIONS.NONE,

        relatedDocuments: [],

        // dashboard: {
        //     sales: 0,
        //     receiptCash: 0,
        //     receiptBank: 0,
        //     postPayment: 0,
        //     orderToPrepay: 0,
        //     orderToPrepare: 0,
        //     orderToTransport: 0,
        // },

        status: REQUEST_STATUSES.IDLE,
        error: '',
        tempData: undefined,
    }

    return initialState
}


export function initialState_Report() {

    const initialState: XTSReportState = {

        dashboard: {
            salesAmount: 0,
            salesOrders: 0,
            receiptCash: 0,
            receiptBank: 0,
            postPayment: 0,
            orderToPrepay: 0,
            orderPreparing: 0,
            orderTransporting: 0,
        },

        status: REQUEST_STATUSES.IDLE,
        error: '',
        tempData: undefined,
    }

    return initialState
}