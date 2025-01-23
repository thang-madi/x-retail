
import { XTSObject, XTSObjectId, XTSObjectRow, XTSRecord, XTSRecordKey, XTSRequest, XTSResponse, XTSType } from "./types-common"

// Tạm thời không cần dùng ???
export function getXTSClass_Application(_type: string) {

    try {
        const XTSClass = eval(`${_type}`)
        return XTSClass
    } catch (error) {
        //         
    }
}

// OK
export class XTSGetRelatedDocumentsRequest extends XTSRequest {

    objectId: XTSObjectId = new XTSObjectId('')

    constructor() {
        super('XTSGetRelatedDocumentsRequest')
    }
}

// OK
export class XTSGetRelatedDocumentsResponse extends XTSResponse {

    documents: XTSRelatedDocument[] = []

    constructor() {
        super('XTSGetRelatedDocumentsResponse')
    }
}

// OK
export class XTSRelatedDocument extends XTSType {

    document: XTSObjectId = new XTSObjectId('')
    operationKind: XTSObjectId = new XTSObjectId('')

    date: string = '0001-01-01T00:00:00'
    number: string = ''
    company: XTSObjectId = new XTSObjectId('XTSCompany')
    counterparty: XTSObjectId = new XTSObjectId('XTSCounterparty')
    documentCurrency: XTSObjectId = new XTSObjectId('XTSCurrency')
    documentAmount: number = 0
    structuralUnit: XTSObjectId = new XTSObjectId('XTSStructuralUnit')
    department: XTSObjectId = new XTSObjectId('XTSStructuralUnit')
    author: XTSObjectId = new XTSObjectId('XTSUser')
    employeeResponsible: XTSObjectId = new XTSObjectId('XTSEmployee')
    comment: string = ''

    constructor() {
        super('XTSRelatedDocument')
    }
}

// OK
export class XTSProduct extends XTSObject {

    description: string = ''
    descriptionFull: string = ''
    sku: string = ''
    comment: string = ''
    productType: XTSObjectId = new XTSObjectId('XTSProductType')
    productCategory: XTSObjectId = new XTSObjectId('XTSProductCategory')
    measurementUnit: XTSObjectId = new XTSObjectId('XTSUOMClassifier')
    picture: XTSObjectId = new XTSObjectId('XTSProductAttachedFile')
    _uomCoefficient: number = 0
    _price: number = 0
    _priceKind: XTSObjectId = new XTSObjectId('XTSPriceKind')
    _vatRate: XTSObjectId = new XTSObjectId('XTSVATRate')
    _vatRateRate: number = 0
    _uoms: XTSProductUOMRow[] = []
    _characteristics: XTSObjectId[] = []
    _prices: XTSPriceRow[] = []
    _pictures: XTSFileRow[] = []

    constructor() {
        super('XTSProduct')
    }
}

// OK
export class XTSProductUOMRow extends XTSObjectRow {

    uom?: XTSObjectId
    coefficient: number = 0

    constructor() {
        super('XTSProductUOMRow')
    }
}

// 
export class XTSProductCharacteristic extends XTSObject {

    description: string = ''
    _price: number = 0

    constructor() {
        super('XTSProductCharacteristic')
    }
}

// OK
export class XTSPriceRow extends XTSObjectRow {

    product: XTSObjectId = new XTSObjectId('XTSProduct')
    characteristic: XTSObjectId = new XTSObjectId('XTSProductCharacteristic')
    priceKind: XTSObjectId = new XTSObjectId('XTSPriceKind')
    measurementUnit: XTSObjectId = new XTSObjectId('XTSUOMClassifier')
    price: number = 0

    constructor() {
        super('XTSPriceRow')
    }
}

// OK
export class XTSFileRow extends XTSObjectRow {

    file: XTSObjectId = new XTSObjectId('XTSFile')
    fileName: string = ''
    extension: string = ''
    size: number = 0

    constructor() {
        super('XTSFileRow')
    }
}

// OK
export class XTSCounterparty extends XTSObject {

    code: string = ''
    description: string = ''
    descriptionFull: string = ''
    counterpartyKind: XTSObjectId = new XTSObjectId('XTSCounterpartyKind')
    gender: XTSObjectId = new XTSObjectId('XTSGender')
    employeeResponsible: XTSObjectId = new XTSObjectId('XTSEmployeeResponsible')
    dateOfBirth: string = '0001-01-01T00:00:00'
    comment: string = ''
    taxIdentifactionNumber: string = ''
    invalid: boolean = false
    mainInfo: string = ''
    customer: boolean = false
    vendor: boolean = false
    otherRelations: boolean = false
    phone: string = ''
    email: string = ''
    address: string = ''
    addressValue: string = ''
    picture: XTSObjectId = new XTSObjectId('XTSCounterpartyAttachedFile')

    margin: number = 0

    constructor() {
        super('XTSCounterparty')
    }

    dateFields(): string[] {
        const result: string[] = ['dateOfBirth']
        return result
    }
}

// OK
export class XTSCounterpartyContract extends XTSObject {

    code: string = ''
    description: string = ''
    priceKind: XTSObjectId = new XTSObjectId('XTSPriceKind')
    counterpartyPriceKind: XTSObjectId = new XTSObjectId('XTSCounterpartyPriceKind')
    settlementsCurrency: XTSObjectId = new XTSObjectId('XTSCurrency')
    comment: string = ''
    contractDate: string = '0001-01-01T00:00:00'
    contractNumber: string = ''
    contractKind: XTSObjectId = new XTSObjectId('XTSContractKind')
    company: XTSObjectId = new XTSObjectId('XTSCompany')

    constructor() {
        super('XTSCounterpartyContract')
    }
}

// OK
export class XTSOrder extends XTSObject {

    date: string = '0001-01-01T00:00:00'
    number: string = ''

    operationKind: XTSObjectId = new XTSObjectId('XTSOperationKindsSalesOrder')
    orderKind: XTSObjectId = new XTSObjectId('XTSSalesOrderKind')
    priceKind: XTSObjectId = new XTSObjectId('XTSPriceKind')
    orderState: XTSObjectId = new XTSObjectId('XTSSalesOrderState')

    company: XTSObjectId = new XTSObjectId('XTSCompany')
    customer: XTSObjectId = new XTSObjectId('XTSCounterparty')
    contract: XTSObjectId = new XTSObjectId('XTSCounterpartyContract')
    documentCurrency: XTSObjectId = new XTSObjectId('XTSCurrency')
    documentAmount: number = 0
    vatTaxation: XTSObjectId = new XTSObjectId('XTSVATTaxation')
    rate: number = 1
    multiplicity: number = 1
    comment: string = ''
    author: XTSObjectId = new XTSObjectId('XTSUser')
    shipmentDate: string = '0001-01-01T00:00:00'
    deliveryAddress: string = ''
    deliveryAddressValue: string = ''
    cash: number = 0
    bankTransfer: number = 0
    postPayment: number = 0
    paymentNote: string = ''
    inventory: XTSOrderProductRow[] = []
    externalAccount: XTSObjectId = new XTSObjectId('XTSExternalAccount')
    employeeResponsible: XTSObjectId = new XTSObjectId('XTSEmployee')
    _receiptableIncrease: number = 0
    _receiptableDecrease: number = 0
    _receiptableBalance: number = 0

    constructor() {
        super('XTSOrder')
    }
}

// OK
export class XTSOrderProductRow extends XTSObjectRow {

    _lineNumber: number = 0
    product: XTSObjectId = new XTSObjectId('XTSProduct')
    characteristic: XTSObjectId = new XTSObjectId('XTSProductCharacteristic')
    vatRate: XTSObjectId = new XTSObjectId('XTSVATRate')
    uom: XTSObjectId = new XTSObjectId('XTSMeasurementUnit')
    quantity: number = 1
    comment: string = ''
    price: number = 0
    amount: number = 0
    automaticDiscountAmount: number = 0
    discountsMarkupsAmount: number = 0
    vatAmount: number = 0
    total: number = 0

    _sku: string = ''
    _coefficient: number = 0
    _price: number = 0
    _vatRateRate: number = 0
    _picture: XTSObjectId = new XTSObjectId('XTSFile')

    constructor() {
        super('XTSOrderProductRow')
    }
}

// OK
export class XTSUOMClassifier extends XTSObject {

    description: string = ''
    code: string = ''

    constructor() {
        super('XTSUOMClassifier')
    }
}

// OK
export class XTSMeasurementUnit extends XTSObject {

    description: string = ''
    coefficient: number = 0

    constructor() {
        super('XTSMeasurementUnit')
    }
}

// OK
export class XTSCompany extends XTSObject {

    description: string = ''
    phone: string = ''
    address: string = ''
    email: string = ''

    constructor() {
        super('XTSCompany')
    }
}

// OK
export class XTSIndividual extends XTSObject {

    description: string = ''
    fullName: string = ''
    dateOfBirth: string = '0001-01-01T00:00:00'
    phone: string = ''
    email: string = ''
    address: string = ''

    constructor() {
        super('XTSIndividual')
    }
}

// OK
export class XTSCart extends XTSRecord {

    recordKey?: XTSRecordKey

    date: string = ''
    externalAccount: XTSObjectId = new XTSObjectId('XTSExternalAccount')
    company: XTSObjectId = new XTSObjectId('XTSCompany')
    customer: XTSObjectId = new XTSObjectId('XTSCounterparty')
    product: XTSObjectId = new XTSObjectId('XTSProduct')
    characteristic: XTSObjectId = new XTSObjectId('XTSProductCharacteristic')
    uom: XTSObjectId = new XTSObjectId('XTSUOMClassifier')
    vatRate: XTSObjectId = new XTSObjectId('XTSVATRate')
    coefficient: number = 0
    quantity: number = 0
    price: number = 0
    amount: number = 0
    total: number = 0
    selected: boolean = false
    _picture: XTSObjectId = new XTSObjectId('XTSFile')

    constructor() {
        super('XTSCart')
    }
}

// OK
export class XTSExternalAccount extends XTSObject {

    description: string = ''
    customer: XTSObjectId = new XTSObjectId('XTSCounterparty')
    user: XTSObjectId = new XTSObjectId('XTSUser')
    id: string = ''

    constructor() {
        super('XTSExternalAccount')
    }
}

// OK
export class XTSConnectUserRequest extends XTSRequest {

    externalAccount: XTSObjectId = new XTSObjectId('XTSExternalAccount')
    customer?: XTSObjectId = new XTSObjectId('XTSConterparty')
    user?: XTSObjectId = new XTSObjectId('XTSUser')

    constructor() {
        super('XTSConnectUserRequest')
    }
}

// OK
export class XTSConnectUserResponse extends XTSResponse {

    externalAccount: XTSObjectId = new XTSObjectId('XTSExternalAccount')
    customer?: XTSObjectId = new XTSObjectId('XTSConterparty')
    employee?: XTSObjectId = new XTSObjectId('XTSEmployee')
    user?: XTSObjectId = new XTSObjectId('XTSUser')
    defaultValues?: any

    constructor() {
        super('XTSConnectUserResponse')
    }
}

// OK
export class XTSEmployee extends XTSObject {

    description: string = ''
    invalid: boolean = false
    individual: XTSObjectId = new XTSObjectId('XTSIndividual')
    parentCompany: XTSObjectId = new XTSObjectId('XTSCompany')
    headEmployee: XTSObjectId = new XTSObjectId('XTSEmployee')

    constructor() {
        super('XTSEmployee')
    }
}

// 
export class XTSStructuralUnit extends XTSObject {

    description: string = ''
    structuralUnitType: XTSObjectId = new XTSObjectId('XTSStructuralUnitType')
    orderWarehouse: boolean = false
    company: XTSObjectId = new XTSObjectId('XTSCompany')
    financiallyLiablePerson: XTSObjectId = new XTSObjectId('XTSIndividual')
    invalid: boolean = false

    constructor() {
        super('XTSStructuralUnit')
    }
}

// 
export class XTSCurrency extends XTSObject {

    code: string = ''
    description: string = ''
    descriptionFull: string = ''
    symbolicPresentation: string = ''
    mainCurrency: XTSObjectId = new XTSObjectId('XTSCurrency')
    markup: number = 1

    constructor() {
        super('XTSCurrency')
    }
}

// 
export class XTSSalesInvoice extends XTSObject {

    date: string = '0001-01-01T00:00:00'
    number: string = ''

    operationKind: XTSObjectId = new XTSObjectId('XTSOperationKindsSalesInvoice')
    priceKind: XTSObjectId = new XTSObjectId('XTSPriceKind')
    // orderKind: XTSObjectId = new XTSObjectId('XTSSalesOrderKind')
    // orderState: XTSObjectId = new XTSObjectId('XTSSalesOrderState')

    company: XTSObjectId = new XTSObjectId('XTSCompany')
    counterparty: XTSObjectId = new XTSObjectId('XTSCounterparty')
    contract: XTSObjectId = new XTSObjectId('XTSCounterpartyContract')
    documentCurrency: XTSObjectId = new XTSObjectId('XTSCurrency')
    documentAmount: number = 0
    vatTaxation: XTSObjectId = new XTSObjectId('XTSVATTaxation')
    rate: number = 1
    multiplicity: number = 1
    comment: string = ''
    author: XTSObjectId = new XTSObjectId('XTSUser')
    deliveryAddress: string = ''
    deliveryAddressValue: string = ''
    structuralUnit: XTSObjectId = new XTSObjectId('XTSStructuralUnit')
    department: XTSObjectId = new XTSObjectId('XTSStructuralUnit')
    employeeResponsible: XTSObjectId = new XTSObjectId('XTSEmployee')
    documentBasis: XTSObjectId = new XTSObjectId('')
    docOrder: XTSObjectId = new XTSObjectId('XTSOrder')

    inventory: XTSSalesInvoiceInventory[] = []

    constructor() {
        super('XTSSalesInvoice')
    }
}

// OK
export class XTSSalesInvoiceInventory extends XTSObjectRow {

    _lineNumber: number = 0
    product: XTSObjectId = new XTSObjectId('XTSProduct')
    characteristic: XTSObjectId = new XTSObjectId('XTSProductCharacteristic')
    vatRate: XTSObjectId = new XTSObjectId('XTSVATRate')
    uom: XTSObjectId = new XTSObjectId('XTSMeasurementUnit')
    quantity: number = 1
    comment: string = ''
    price: number = 0
    amount: number = 0
    automaticDiscountAmount: number = 0
    discountsMarkupsAmount: number = 0
    vatAmount: number = 0
    total: number = 0

    _sku: string = ''
    _coefficient: number = 0
    _price: number = 0
    _vatRateRate: number = 0
    _picture: XTSObjectId = new XTSObjectId('XTSFile')

    constructor() {
        super('XTSSalesInvoiceInventory')
    }
}

// 
export class XTSSupplierInvoice extends XTSObject {

    date: string = '0001-01-01T00:00:00'
    number: string = ''
    posted: boolean = false

    operationKind: XTSObjectId = new XTSObjectId('XTSOperationKindsSupplierInvoice')
    counterpartyPriceKind: XTSObjectId = new XTSObjectId('XTSCounterpartyPriceKind')
    returnPriceKind: XTSObjectId = new XTSObjectId('XTSCounterpartyPriceKind')
    // orderKind: XTSObjectId = new XTSObjectId('XTSSalesOrderKind')
    // orderState: XTSObjectId = new XTSObjectId('XTSSalesOrderState')

    company: XTSObjectId = new XTSObjectId('XTSCompany')
    counterparty: XTSObjectId = new XTSObjectId('XTSCounterparty')
    contract: XTSObjectId = new XTSObjectId('XTSCounterpartyContract')
    documentCurrency: XTSObjectId = new XTSObjectId('XTSCurrency')
    documentAmount: number = 0
    vatTaxation: XTSObjectId = new XTSObjectId('XTSVATTaxation')
    rate: number = 1
    multiplicity: number = 1
    comment: string = ''
    author: XTSObjectId = new XTSObjectId('XTSUser')
    deliveryAddress: string = ''
    deliveryAddressValue: string = ''
    structuralUnit: XTSObjectId = new XTSObjectId('XTSStructuralUnit')
    department: XTSObjectId = new XTSObjectId('XTSStructuralUnit')
    employeeResponsible: XTSObjectId = new XTSObjectId('XTSEmployee')
    documentBasis: XTSObjectId = new XTSObjectId('')
    docOrder: XTSObjectId = new XTSObjectId('XTSOrder')

    inventory: XTSSalesInvoiceInventory[] = []

    constructor() {
        super('XTSSupplierInvoice')
    }
}

// 
export class XTSSupplierInvoiceInventory extends XTSObjectRow {

    _lineNumber: number = 0
    product: XTSObjectId = new XTSObjectId('XTSProduct')
    characteristic: XTSObjectId = new XTSObjectId('XTSProductCharacteristic')
    vatRate: XTSObjectId = new XTSObjectId('XTSVATRate')
    uom: XTSObjectId = new XTSObjectId('XTSMeasurementUnit')
    quantity: number = 1
    comment: string = ''
    price: number = 0
    amount: number = 0
    discountsMarkupsAmount: number = 0
    vatAmount: number = 0
    total: number = 0

    _sku: string = ''
    _coefficient: number = 0
    _price: number = 0
    _vatRateRate: number = 0
    _picture: XTSObjectId = new XTSObjectId('XTSFile')

    constructor() {
        super('XTSSupplierInvoiceInventory')
    }
}

// 
export class XTSCashReceipt extends XTSObject {

    date: string = '0001-01-01T00:00:00'
    number: string = ''

    operationKind: XTSObjectId = new XTSObjectId('XTSOperationKindsCashReceipt')
    // orderKind: XTSObjectId = new XTSObjectId('XTSSalesOrderKind')
    // counterpartyPriceKind: XTSObjectId = new XTSObjectId('XTSCounterpartyPriceKind')
    // orderState: XTSObjectId = new XTSObjectId('XTSSalesOrderState')

    company: XTSObjectId = new XTSObjectId('XTSCompany')
    counterparty: XTSObjectId = new XTSObjectId('XTSCounterparty')
    cashCurrency: XTSObjectId = new XTSObjectId('XTSCurrency')
    documentAmount: number = 0
    accountingAmount: number = 0
    rate: number = 1
    multiplicity: number = 1
    comment: string = ''
    author: XTSObjectId = new XTSObjectId('XTSUser')
    structuralUnit: XTSObjectId = new XTSObjectId('XTSStructuralUnit')
    department: XTSObjectId = new XTSObjectId('XTSStructuralUnit')
    employeeResponsible: XTSObjectId = new XTSObjectId('XTSEmployee')
    cashAccount: XTSObjectId = new XTSObjectId('XTSPettyCash')
    cashFlowItem: XTSObjectId = new XTSObjectId('XTSCashFlowItem')
    documentBasis: XTSObjectId = new XTSObjectId('')

    // documentBasis: XTSObjectId = new XTSObjectId('XTS')
    // docOrder: XTSObjectId = new XTSObjectId('XTSPurchaseOrder')
    paymentDetails: XTSCashReceiptPaymentDetails[] = []

    constructor() {
        super('XTSCashReceipt')
    }
}

// 
export class XTSCashReceiptPaymentDetails extends XTSObjectRow {

    _lineNumber: number = 0
    contract: XTSObjectId = new XTSObjectId('XTSCounterpartyContract')
    document: XTSObjectId = new XTSObjectId('')
    paymentAmount: number = 0
    settlementsAmount: number = 0
    rate: number = 0
    multiplicity: number = 0
    advanceFlag: boolean = false
    docOrder: XTSObjectId = new XTSObjectId('XTSOrder')

    constructor() {
        super('XTSCashReceiptPaymentDetails')
    }
}

// 
export class XTSPaymentReceipt extends XTSObject {

    date: string = '0001-01-01T00:00:00'
    number: string = ''

    operationKind: XTSObjectId = new XTSObjectId('XTSOperationKindsPaymentReceipt')
    // orderKind: XTSObjectId = new XTSObjectId('XTSSalesOrderKind')
    // counterpartyPriceKind: XTSObjectId = new XTSObjectId('XTSCounterpartyPriceKind')
    // orderState: XTSObjectId = new XTSObjectId('XTSSalesOrderState')

    company: XTSObjectId = new XTSObjectId('XTSCompany')
    counterparty: XTSObjectId = new XTSObjectId('XTSCounterparty')
    cashCurrency: XTSObjectId = new XTSObjectId('XTSCurrency')
    documentAmount: number = 0
    accountingAmount: number = 0
    rate: number = 1
    multiplicity: number = 1
    comment: string = ''
    author: XTSObjectId = new XTSObjectId('XTSUser')
    bankAccount: XTSObjectId = new XTSObjectId('XTSPettyCash')
    cashFlowItem: XTSObjectId = new XTSObjectId('XTSCashFlowItem')
    documentBasis: XTSObjectId = new XTSObjectId('')

    // documentBasis: XTSObjectId = new XTSObjectId('XTS')
    // docOrder: XTSObjectId = new XTSObjectId('XTSPurchaseOrder')
    paymentDetails: XTSPaymentReceiptPaymentDetails[] = []

    constructor() {
        super('XTSPaymentReceipt')
    }
}

// 
export class XTSPaymentReceiptPaymentDetails extends XTSObjectRow {

    _lineNumber: number = 0
    contract: XTSObjectId = new XTSObjectId('XTSCounterpartyContract')
    document: XTSObjectId = new XTSObjectId('')
    paymentAmount: number = 0
    settlementsAmount: number = 0
    rate: number = 0
    multiplicity: number = 0
    advanceFlag: boolean = false
    docOrder: XTSObjectId = new XTSObjectId('XTSOrder')

    constructor() {
        super('XTSPaymentReceiptPaymentDetails')
    }
}

// 
export class XTSPriceRegistration extends XTSObject {

    date: string = '0001-01-01T00:00:00'
    number: string = ''

    author: XTSObjectId = new XTSObjectId('XTSUser')
    comment: string = ''
    documentBasis: XTSObjectId = new XTSObjectId('')

    inventory: XTSPriceRegistrationInventory[] = []

    constructor() {
        super('XTSPriceRegistration')
    }
}

// 
export class XTSPriceRegistrationInventory extends XTSObjectRow {

    _lineNumber: number = 0
    product: XTSObjectId = new XTSObjectId('XTSProduct')
    characteristic: XTSObjectId = new XTSObjectId('XTSProductCharacteristic')
    uom: XTSObjectId = new XTSObjectId('XTSUOMClassifier')
    priceKind: XTSObjectId = new XTSObjectId('XTSPriceKind')
    price: number = 0
    priceOld: number = 0
    currency: XTSObjectId = new XTSObjectId('XTSCurrency')
    currencyOld: XTSObjectId = new XTSObjectId('XTSCurrency')

    constructor() {
        super('XTSPriceRegistrationInventory')
    }
}