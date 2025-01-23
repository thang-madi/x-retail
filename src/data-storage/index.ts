/////////////////////////////////////////////
// Standard's

import { configureStore } from '@reduxjs/toolkit'

/////////////////////////////////////////////
// Object's

import reducerSession from './slice-session'
import reducerCurrentData from './slice-current'
import reducerReports from './slice-report'

import reducerProducts from './slice-product'
import reducerSalesOrders from './slice-sales-order'
import reducerCustomers from './slice-customer'
import reducerUsers from './slice-user'
import reducerUOMClassifier from './slice-uom-classifier'
import reducerMeasurementUnits from './slice-measurement-unit'
import reducerIndividuals from './slice-individual'
import reducerEmployees from './slice-employee'
import reducerCarts from './slice-cart'

import reducerStructuralUnits from './slice-structural-unit'
import reducerSalesInvoices from './slice-sales-invoice'
import reducerSupplierInvoices from './slice-supplier-invoice'
import reducerCashReceipts from './slice-cash-receipt'
import reducerPaymentReceipts from './slice-payment-receipt'
import reducerCurrencies from './slice-currency'
import reducerPriceRegistrations from './slice-price-registration'

// import reducerUserProfiles from './slice-user-profiles'

/////////////////////////////////////////////
// Export's

const store = configureStore({
    reducer: {
        session: reducerSession,
        currentData: reducerCurrentData,
        reports: reducerReports,

        products: reducerProducts,
        salesOrders: reducerSalesOrders,
        customers: reducerCustomers,
        users: reducerUsers,
        uomClassifier: reducerUOMClassifier,
        measurementUnits: reducerMeasurementUnits,
        individuals: reducerIndividuals,
        employees: reducerEmployees,

        carts: reducerCarts,

        structuralUnits: reducerStructuralUnits,
        salesInvoices: reducerSalesInvoices,
        supplierInvoices: reducerSupplierInvoices,
        cashReceipts: reducerCashReceipts,
        paymentReceipts: reducerPaymentReceipts,

        currencies: reducerCurrencies,
        priceRegistrations: reducerPriceRegistrations,
        // userProfiles: reducerUserProfiles,
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>;

