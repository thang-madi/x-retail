import { XTSType } from "./types-common"

export class XTSRequestData extends XTSType {
    url?: string
    headers?: any
    body?: any
    method: string = 'POST'

    constructor() {
        super('XTSRequestData')
    }

}