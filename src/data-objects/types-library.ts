
import { XTSObject, XTSObjectId, XTSObjectRow, XTSRequest, XTSResponse, XTSType, } from "./types-common"

// Tạm thời không cần dùng ???
export function getXTSClass_Library(_type: string) {

    try {
        const XTSClass = eval(`${_type}`)
        return XTSClass
    } catch (error) {
        //         
    }
}

// OK
export class XTSUser extends XTSObject {

    individual?: XTSObjectId = new XTSObjectId('XTSIndividual')
    description: string = ''
    phone: string = ''
    email: string = ''

    constructor() {
        super('XTSUser')
    }
}

// OK
export class XTSFile extends XTSObject {

    author: XTSObjectId = new XTSObjectId('XTSUser')
    fileOwner: XTSObjectId = new XTSObjectId('')
    description: string = ''
    creationDate: string = '1900-01-01T00:00:00'
    longDescription: string = ''
    size: number = 0
    extension: string = ''

    constructor(_type = 'XTSFile') {
        super(_type)
    }
}

// OK
export class XTSDownloadFileRequest extends XTSRequest {

    fileId: XTSObjectId = new XTSObjectId('XTSFile')

    constructor() {
        super('XTSDownloadFileRequest')
    }
}

// OK
export class XTSDownloadFileResponse extends XTSResponse {

    file: XTSFile = new XTSFile()
    binaryData: string = ''

    constructor() {
        super('XTSDownloadFileResponse')
    }
}

// OK
export class XTSGetFilesRequest extends XTSRequest {

    fileOwner: XTSObjectId = new XTSObjectId('')
    startWith: string = ''
    extension: string = ''

    constructor(dataType: string) {
        super('XTSGetFilesRequest')
    }
}

// OK
export class XTSGetFilesResponse extends XTSResponse {

    files: XTSFile[] = []

    constructor() {
        super('XTSGetFilesResponse')
    }
}

// OK
export class XTSUploadFileRequest extends XTSRequest {

    file: XTSFile = new XTSFile()
    binaryData: string = ''
    startsWith: string = ''
    attributeName: string = ''
    copyToS3Storage: boolean = true

    constructor() {
        super('XTSUploadFileRequest')
    }
}

// OK
export class XTSUploadFileResponse extends XTSResponse {

    file: XTSFile = new XTSFile()

    constructor() {
        super('XTSUploadFileResponse')
    }
}

// OK
export class XTSDeleteFilesRequest extends XTSRequest {

    fileIds: XTSObjectId[] = []

    constructor() {
        super('XTSDeleteFilesRequest')
    }
}

// OK
export class XTSDeleteFilesResponse extends XTSResponse {

    fileIds: XTSObjectId[] = []

    constructor() {
        super('XTSDeleteFilesResponse')
    }
}
