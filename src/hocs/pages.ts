
import { XTSObjectEditProps, XTSObjectIndexProps, XTSObjectViewProps } from '../data-objects/types-components'

// import * as getPages_XTSCashReceipt from '../pages/cash-receipt'
// import * as getPages_XTSCurrency from '../pages/currency'
// import * as getPages_XTSCounterparty from '../pages/customer'
// import * as getPages_XTSEmployee from '../pages/employee'
// import * as getPages_XTSPaymentReceipt from '../pages/payment-receipt'
// import * as getPages_XTSPriceRegistration from '../pages/price-registration'
// import * as getPages_XTSProduct from '../pages/product'
// import * as getPages_XTSSalesInvoice from '../pages/sales-invoice'
// import * as getPages_XTSSalesOrder from '../pages/sales-order'
// import * as getPages_XTSStructuralUnit from '../pages/structural-unit'
// import * as getPages_XTSSupplierInvoice from '../pages/supplier-invoice'
// import * as getPages_XTSUOMClassifier from '../pages/uom-classifier'

import { getPages as getPages_XTSCashReceipt } from '../pages/cash-receipt'
import { getPages as getPages_XTSCurrency } from '../pages/currency'
import { getPages as getPages_XTSCounterparty } from '../pages/customer'
import { getPages as getPages_XTSEmployee } from '../pages/employee'
import { getPages as getPages_XTSPaymentReceipt } from '../pages/payment-receipt'
import { getPages as getPages_XTSPriceRegistration } from '../pages/price-registration'
import { getPages as getPages_XTSProduct } from '../pages/product'
import { getPages as getPages_XTSSalesInvoice } from '../pages/sales-invoice'
import { getPages as getPages_XTSSalesOrder } from '../pages/sales-order'
import { getPages as getPages_XTSStructuralUnit } from '../pages/structural-unit'
import { getPages as getPages_XTSSupplierInvoice } from '../pages/supplier-invoice'
import { getPages as getPages_XTSUOMClassifier } from '../pages/uom-classifier'
// import ...

enum PAGE_TYPES {
    INDEX = 'IndexPage',
    EDIT = 'EditPage',
    VIEW = 'ViewPage',
    LIST = 'ListPage',
}

// 
function getPages(dataType: string) {

    const mapDataType: { [key: string]: any } = {
        XTSCashReceipt: getPages_XTSCashReceipt,
        XTSCurrency: getPages_XTSCurrency,
        XTSCounterparty: getPages_XTSCounterparty,
        XTSEmployee: getPages_XTSEmployee,
        XTSPaymentReceipt: getPages_XTSPaymentReceipt,
        XTSPriceRegistration: getPages_XTSPriceRegistration,
        XTSProduct: getPages_XTSProduct,
        XTSStructuralUnit: getPages_XTSStructuralUnit,
        XTSSupplierInvoice: getPages_XTSSupplierInvoice,
        XTSOrder: getPages_XTSSalesOrder,
        XTSSalesInvoice: getPages_XTSSalesInvoice,
        XTSUOMClassifier: getPages_XTSUOMClassifier,
        // ... Bổ sung thêm
    }

    const getPages = mapDataType[dataType]
    return getPages()
}

// OK
export function getPage(dataType: string, pageType: PAGE_TYPES): React.FC {
    const pages = getPages(dataType) as any
    return pages[pageType]
}

// OK
export function getViewPage(dataType: string): React.FC<XTSObjectViewProps> {
    return getPage(dataType, PAGE_TYPES.VIEW)
}

// OK
export function getEditPage(dataType: string): React.FC<XTSObjectEditProps> {
    return getPage(dataType, PAGE_TYPES.EDIT)
}

// OK
export function getListPage(dataType: string): React.FC<XTSObjectEditProps> {
    return getPage(dataType, PAGE_TYPES.LIST)
}

// OK
export function getIndexPage(dataType: string): React.FC<XTSObjectIndexProps> {
    return getPage(dataType, PAGE_TYPES.INDEX)
}
