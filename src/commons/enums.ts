
export enum PAGE_ACTIONS {
    NONE = 'NONE',
    BACK = 'BACK',
    SAVE = 'SAVE',
    RELOAD = 'RELOAD',
}

export enum REQUEST_STATUSES {
    IDLE = 'IDLE',
    SENDING = 'SENDING',        // Xem lại, có thể không cần, chỉ cần LOADING
    LOADING = 'LOADING',
    SUCCEEDED = 'SUCCEEDED',
    FAILED = 'FAILED'
}

// export enum SORT_DIRECTION {
//     ASCENDING = '',
//     DESCENDING = ' DESC'
// }