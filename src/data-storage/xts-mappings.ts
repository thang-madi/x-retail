
/////////////////////////////////////////////
// Import's

import {
    apiRequest as apiRequest_Session,
    actions as actions_Session,
} from './slice-session'

import {
    apiRequest as apiRequest_Current,
    actions as actions_Current,
} from './slice-current'

import {
    apiRequest as apiRequest_Report,
    actions as actions_Report,
} from './slice-report'

import {
    apiRequest as apiRequest_Customers,
    actions as actions_Customers,
} from './slice-customer'

import {
    apiRequest as apiRequest_MeasurementUnits,
    actions as actions_MeasurementUnits,
} from './slice-measurement-unit'

import {
    apiRequest as apiRequest_Orders,
    actions as actions_Orders,
} from './slice-sales-order'

import {
    apiRequest as apiRequest_Products,
    actions as actions_Products,
} from './slice-product'

import {
    apiRequest as apiRequest_UOMClassifier,
    actions as actions_UOMClassifier,
} from './slice-uom-classifier'

import {
    apiRequest as apiRequest_Users,
    actions as actions_Users,
} from './slice-user'

import {
    apiRequest as apiRequest_Individuals,
    actions as actions_Individuals,
} from './slice-individual'

import {
    apiRequest as apiRequest_Employees,
    actions as actions_Employees,
} from './slice-employee'

import {
    apiRequest as apiRequest_Carts,
    actions as actions_Carts,
} from './slice-cart'

import {
    apiRequest as apiRequest_StructuralUnit,
    actions as actions_StructuralUnit,
} from './slice-structural-unit'

import {
    apiRequest as apiRequest_CashReceipt,
    actions as actions_CashReceipt,
} from './slice-cash-receipt'

import {
    apiRequest as apiRequest_PaymentReceipt,
    actions as actions_PaymentReceipt,
} from './slice-payment-receipt'

import {
    apiRequest as apiRequest_SalesInvoice,
    actions as actions_SalesInvoice,
} from './slice-sales-invoice'

import {
    apiRequest as apiRequest_SupplierInvoice,
    actions as actions_SupplierInvoice,
} from './slice-supplier-invoice'

import {
    apiRequest as apiRequest_Currency,
    actions as actions_Currency,
} from './slice-currency'

import {
    apiRequest as apiRequest_PriceRegistration,
    actions as actions_PriceRegistration,
} from './slice-price-registration'


/////////////////////////////////////////////
// Export's

export interface XTSSlice {
    sliceName: string,
    apiRequest: any,
    actions: any
}

/////////////////////////////////////////////
// Main's

const xtsSlicesMapping = {

    XTSSession: {
        sliceName: 'session',
        apiRequest: apiRequest_Session,
        actions: actions_Session
    },

    XTSCurrent: {
        sliceName: 'current',
        apiRequest: apiRequest_Current,
        actions: actions_Current
    },

    XTSReport: {
        sliceName: 'reports',
        apiRequest: apiRequest_Report,
        actions: actions_Report
    },

    XTSProduct: {
        sliceName: 'products',
        apiRequest: apiRequest_Products,
        actions: actions_Products
    },

    XTSCounterparty: {
        sliceName: 'customers',
        apiRequest: apiRequest_Customers,
        actions: actions_Customers
    },

    XTSOrder: {
        sliceName: 'salesOrders',
        apiRequest: apiRequest_Orders,
        actions: actions_Orders
    },

    XTSUser: {
        sliceName: 'users',
        apiRequest: apiRequest_Users,
        actions: actions_Users
    },

    XTSUOMClassifier: {
        sliceName: 'uomClassifier',
        apiRequest: apiRequest_UOMClassifier,
        actions: actions_UOMClassifier
    },

    XTSMeasurementUnit: {
        sliceName: 'measurementUnits',
        apiRequest: apiRequest_MeasurementUnits,
        actions: actions_MeasurementUnits
    },

    XTSIndividual: {
        sliceName: 'individuals',
        apiRequest: apiRequest_Individuals,
        actions: actions_Individuals
    },

    XTSEmployee: {
        sliceName: 'employees',
        apiRequest: apiRequest_Employees,
        actions: actions_Employees
    },

    XTSCart: {
        sliceName: 'carts',
        apiRequest: apiRequest_Carts,
        actions: actions_Carts
    },

    XTSStructuralUnit: {
        sliceName: 'structuralUnits',
        apiRequest: apiRequest_StructuralUnit,
        actions: actions_StructuralUnit
    },

    XTSCashReceipt: {
        sliceName: 'cashReceipts',
        apiRequest: apiRequest_CashReceipt,
        actions: actions_CashReceipt
    },

    XTSPaymentReceipt: {
        sliceName: 'paymentReceipts',
        apiRequest: apiRequest_PaymentReceipt,
        actions: actions_PaymentReceipt
    },

    XTSSalesInvoice: {
        sliceName: 'salesInvoices',
        apiRequest: apiRequest_SalesInvoice,
        actions: actions_SalesInvoice
    },

    XTSSupplierInvoice: {
        sliceName: 'supplierInvoices',
        apiRequest: apiRequest_SupplierInvoice,
        actions: actions_SupplierInvoice
    },

    XTSCurrency: {
        sliceName: 'currencies',
        apiRequest: apiRequest_Currency,
        actions: actions_Currency
    },

    XTSPriceRegistration: {
        sliceName: 'priceRegistrations',
        apiRequest: apiRequest_PriceRegistration,
        actions: actions_PriceRegistration
    },
}

export function getXTSSlice(dataType: string): XTSSlice {
    const xtsSlices = (xtsSlicesMapping as { [key: string]: XTSSlice })
    return xtsSlices[dataType]
}

