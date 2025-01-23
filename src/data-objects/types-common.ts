
// Tạm thời không cần dùng ???
export function getXTSClass_Common(_type: string) {

    try {
        const XTSClass = eval(`${_type}`)
        // const XTSClass = new Function(`return new ${_type}()`)
        return XTSClass
    } catch (error) {
        //         
    }
}

// OK 
export function getXTSObjectConstructor_Common(_type: string) {

    try {
        const XTSClass = eval(`${_type}`)
        return XTSClass
    } catch (error) {
        //         
    }

}

// ???
// export enum ComparisonOperators {
export enum COMPARISION_OPERATORS {
    EQUAL = '=',
    NOT_EQUAL = '<>',
    GREATER = '>',
    LESS = '<'
}

// OK
export abstract class XTSType {

    _type: string

    constructor(_type: string) {
        this._type = _type
        this.fillEmptyDates()
    }

    writeJSON(deleteEmptyRef: boolean = false): string {
        if (deleteEmptyRef) {
            this.clearEmptyRef()
        }
        return JSON.stringify(this, null, 4)
    }

    // Xem xét lại, có thể bỏ đi, vì giá trị mặc định được gắn là: '0001-01-01T00:00:00'
    dateFields(): string[] {
        const result: string[] = []
        return result
    }

    fillEmptyDates(): void {
        const emptyFields = this.dateFields()
        const thisObject = this as { [key: string]: any }
        for (let field of emptyFields) {
            if (!thisObject[field]) {
                thisObject[field] = '0001-01-01'
            }
        }
    }

    clearEmptyRef() {
        const thisObject = (this as { [key: string]: any })
        for (const key of Object.keys(this)) {
            const propertyValue = thisObject[key]
            if (typeof propertyValue === 'object') {
                if (propertyValue.hasOwnProperty('_type') && propertyValue['_type'] === 'XTSObjectId' && propertyValue['id'] === '') {
                    thisObject[key] = undefined
                }
            }
        }
    }

    fillPropertyValues(propertyValues: { [key: string]: any }): void {
        for (let key in propertyValues) {
            if (this.hasOwnProperty(key)) {
                (this as { [key: string]: any })[key] = propertyValues[key]
            }
        }
    }
}

// OK
export class XTSObjectId extends XTSType {

    dataType: string = ''
    id: string = ''
    presentation: string = ''
    url: string = ''

    constructor(dataType: string) {
        super('XTSObjectId')
        if (dataType) {
            this.dataType = dataType
        }
    }
}

// OK
export abstract class XTSObject extends XTSType {

    _isFullData: boolean = false
    objectId: XTSObjectId

    constructor(dataType: string) {
        super(dataType)
        // const dataType = _type
        this.objectId = new XTSObjectId(dataType)
    }
}

// OK
export abstract class XTSObjectRow extends XTSType {

    _lineNumber: number = 0

    constructor(dataType: string) {
        super(dataType)
        // const dataType = dataType
        // this.objectId = new XTSObjectId(dataType)
    }
}

// // OK
// export class XTSRecordFilter extends XTSType {

//     name: string = ''
//     value: any

//     constructor(name: string, value: any) {
//         super('XTSRecordFilter')
//         this.setValue(name, value)
//     }

//     setValue(name: string, value: any) {
//         this.name = name
//         this.value = value
//     }
// }

// OK
export class XTSRecordFilter extends XTSType {

    constructor() {
        super('XTSRecordFilter')
    }

    addFilterItem(name: string, value: any) {
        (this as any)[name] = value
    }

    deleteFilterItem(name: string) {
        delete (this as any)[name]
    }

    clearFilter() {
        for (let key in this) {
            if (key !== '_type') {
                delete (this as any)[key]
            }
        }
    }
}

// OK
export class XTSRecordKey extends XTSType {

    dataType: string = ''
    filter: XTSRecordFilter = new XTSRecordFilter()
    period?: string
    register?: XTSObjectId

    constructor(dataType: string) {
        super('XTSRecordKey')
        if (dataType) {
            this.dataType = dataType
        }
    }

    // Xem xét bỏ đi trường này
    dateFields(): string[] {
        const result: string[] = ['period']
        return result
    }
}

// OK
export abstract class XTSRecord extends XTSType {

    // recordKey?: 
    _dimensions: string[] = []

    constructor(_type: string) {
        super(_type)
    }
}

// OK
export class XTSRecordSet extends XTSType {

    dataType: string = ''
    filter: XTSRecordFilter = new XTSRecordFilter()
    records: XTSRecord[] = []

    constructor(dataType: string) {
        super('XTSRecordSet')
        if (dataType) {
            this.dataType = dataType
        }
    }
}

// OK
export class XTSCondition extends XTSType {

    property: string = ''
    value: any
    comparisonOperator: COMPARISION_OPERATORS = COMPARISION_OPERATORS.EQUAL

    constructor() {
        super('XTSCondition')
    }

}

// OK
export abstract class XTSMessage extends XTSType {

    _dbId: string = ''
    _msgId: string = ''

    constructor(_type: string) {
        super(_type)
    }
}

// OK
export abstract class XTSRequest extends XTSMessage {

    constructor(_type: string) {
        super(_type)
    }
}

// OK
export abstract class XTSResponse extends XTSMessage {

    constructor(_type: string) {
        super(_type)
    }
}

// 
export class XTSCreateObjectRequest extends XTSRequest {

    object?: XTSObject
    fillingValues: any
    constructor() {
        super('XTSCreateObjectRequest')
    }
}

// 
export class XTSCreateObjectResponse extends XTSResponse {

    object?: XTSObject

    constructor() {
        super('XTSCreateObjectResponse')
    }
}

// OK
export class XTSCreateObjectsRequest extends XTSRequest {

    objects: XTSObject[] = []

    constructor() {
        super('XTSCreateObjectsRequest')
    }
}

// OK
export class XTSCreateObjectsResponse extends XTSResponse {

    objects: XTSObject[] = []

    constructor() {
        super('XTSCreateObjectsResponse')
    }
}

// OK
export class XTSDeleteObjectsRequest extends XTSRequest {

    objects: XTSObject[] = []

    constructor() {
        super('XTSDeleteObjectsRequest')
    }
}

// OK
export class XTSDeleteObjectsResponse extends XTSResponse {

    objectIds: XTSObjectId[] = []

    constructor() {
        super('XTSDeleteObjectsResponse')
    }
}

// OK
export class XTSError extends XTSResponse {

    description: string = ''
    subject: string = ''

    constructor() {
        super('XTSError')
    }
}

// OK
export class XTSGetObjectListRequest extends XTSRequest {

    dataType: string = ''
    columnSet: string[] = []
    sortBy: string[] = []
    positionFrom: number = 0
    positionTo: number = 0
    limit: number = 0
    conditions: XTSCondition[] = []

    constructor(dataType: string) {
        super('XTSGetObjectListRequest')
        if (dataType) {
            this.dataType = dataType
        }
    }
}

// OK
export class XTSGetObjectListResponse extends XTSResponse {

    items: XTSObjectListItem[] = []

    constructor() {
        super('XTSGetObjectListResponse')
    }
}

// OK
export class XTSObjectListItem extends XTSType {

    canHaveChildren: boolean = false
    isFolder: boolean = false
    object?: XTSObject
    parentId?: XTSObjectId

    constructor() {
        super('XTSObjectListItem')
    }
}

// OK
export class XTSGetObjectsRequest extends XTSRequest {

    objectIds: XTSObjectId[] = []
    columnSet: string[] = []

    constructor() {
        super('XTSGetObjectsRequest')
    }
}

// OK
export class XTSGetObjectsResponse extends XTSResponse {

    objects: XTSObject[] = []

    constructor() {
        super('XTSGetObjectsResponse')
    }
}

// OK
export class XTSUpdateObjectsRequest extends XTSRequest {

    objects: XTSObject[] = []

    constructor() {
        super('XTSUpdateObjectsRequest')
    }
}

// OK
export class XTSUpdateObjectsResponse extends XTSResponse {

    objects: XTSObject[] = []

    constructor() {
        super('XTSUpdateObjectsResponse')
    }
}

// OK
export class XTSDownloadObjectListRequest extends XTSRequest {

    dataType: XTSObject[] = []
    prefix: string = ''

    constructor() {
        super('XTSDownloadObjectListRequest')
    }
}

// OK
export class XTSDownloadObjectListResponse extends XTSResponse {

    objects: XTSObject[] = []

    constructor() {
        super('XTSDownloadObjectListResponse')
    }
}

// OK
export class XTSSignInRequest extends XTSRequest {

    deviceId: string = ''
    userToken: string = ''
    userName: string = ''
    password: string = ''
    telegramId: string = ''
    zaloId: string = ''
    phone: string = ''
    otp: string = ''
    deviceInfo: string = ''
    fullName: string = ''

    constructor() {
        super('XTSSignInRequest')
    }
}

// OK
export class XTSSignInResponse extends XTSResponse {

    deviceId: string = ''
    userToken: string = ''
    userName: string = ''
    phone: string = ''
    externalAccount?: XTSObjectId
    externalAccountID: string = ''
    externalAccountOwner: string = ''
    user?: XTSObjectId
    employee?: XTSObjectId
    defaultValues: any
    fileStorage: string = ''

    constructor() {
        super('XTSSignInResponse')
    }
}

// OK
export class XTSSignOutRequest extends XTSRequest {

    deviceId: string = ''
    user?: XTSObjectId
    externalAccount?: XTSObjectId

    constructor() {
        super('XTSSignOutRequest')
    }
}

// OK
export class XTSSignOutResponse extends XTSResponse {

    externalAccount?: XTSObjectId
    user?: XTSObjectId
    customer?: XTSObjectId

    constructor() {
        super('XTSSignOutResponse')
    }
}

// OK
export class XTSGetRecordSetRequest extends XTSRequest {

    dataType: string = ''
    filter?: XTSRecordFilter

    constructor(dataType: string) {
        super('XTSGetRecordSetRequest')
        if (dataType) {
            this.dataType = dataType
        }
    }
}

// OK
export class XTSGetRecordSetResponse extends XTSResponse {

    recordSet?: XTSRecordSet

    constructor() {
        super('XTSGetRecordSetResponse')
    }
}

// OK
export class XTSUpdateRecordSetRequest extends XTSRequest {

    recordSet?: XTSRecordSet

    constructor(dataType: string) {
        super('XTSUpdateRecordSetRequest')
        if (dataType) {
            this.recordSet = new XTSRecordSet(dataType)
        }
    }
}

// OK
export class XTSUpdateRecordSetResponse extends XTSResponse {

    recordSet?: XTSRecordSet

    constructor() {
        super('XTSUpdateRecordSetResponse')
    }
}

// OK
export class XTSGetReportDataRequest extends XTSRequest {

    reportName: string = ''
    startDate: string = '0001-01-01T00:00:00'
    endDate: string = '0001-01-01T00:00:00'
    conditions: XTSCondition[] = []

    constructor() {
        super('XTSGetReportDataRequest')
    }
}

// OK
export class XTSGetReportDataResponse extends XTSResponse {

    reportData: any = null

    constructor() {
        super('XTSGetReportDataResponse')
    }
}

