/////////////////////////////////////////////
// Standard's

import { Routes, Route, Outlet } from 'react-router-dom'
import { Layout } from 'antd'

/////////////////////////////////////////////
// Object's

// import CheckAuth from '../hocs/auth-checking'
// import { ParamsProvider } from '../hocs/params-provider'

import HomePage from '../../pages/home'
// import AboutPage from '../../pages/others/about'
import LandingPage from '../../pages/landing'
import LoginPage from '../../pages/user/LogIn'
import LogoutPage from '../../pages/user/LogOut'
import ConnectPage from '../../pages/user/ConnectUser'
// import SupportPage from '../../pages/others/support'
import CartsPage from '../../pages/cart'

// import CustomersListPage from '../pages/customer/customer-list'

import CustomersPage from '../../pages/customer'
// import IndividualsPage from '../../pages/individual'
import ProductsPage from '../../pages/product'
import SalesOrderPage from '../../pages/sales-order'
// import ProductCharacteristicListPage from '../pages/product-characteristic/product-characteristic-list'
// import ProductCharacteristicPage from '../pages/product-characteristic/product-characteristic-view'
import UOMClassifierPage from '../../pages/uom-classifier'
import UserProfilePage from '../../pages/user/UserProfile'
import EmployeesPage from '../../pages/employee'
import SettingsPage from '../../pages/user/Settings'

import StructuralUnitsPage from '../../pages/structural-unit'
import SalesInvoicesPage from '../../pages/sales-invoice'
import SupplierInvoicesPage from '../../pages/supplier-invoice'
import CashReceiptsPage from '../../pages/cash-receipt'
import PaymentReceiptsPage from '../../pages/payment-receipt'
import CurrenciesPage from '../../pages/currency'
import PriceRegistrationPage from '../../pages/price-registration'

import CashReceiptPage from '../../pages/money/CashReceipt'
import CashExpensePage from '../../pages/money/Expense'

import PaymentReceiptPage from '../../pages/money/PaymentReceipt'
import PaymentExpensePage from '../../pages/money/Expense'

import ViewPage from '../../pages/views'

import AppHeader from '../AppHeader'
import AppFooter from '../AppFooter'
// import AppSider from './sider';

// import { HEADER_HEIGHT, FOOTER_HEIGHT, MENU_BACKGROUND_COLOR } from '../../commons/constants'

/////////////////////////////////////////////
// Object's

import CheckAuth from '../../hocs/CheckAuth'

import './index.css'
import AppStatusBar from '../AppStatusBar'
import AppNavBar from '../AppNavBar'
import { isAndroid, isFullscreenAndroid, isFullscreenIOS, isFullscreenTDesktop, isIOS } from '../../commons/telegram'
import DailyReport from '../../pages/pdf-reports/DailyReport'
import SettlementWithCustomersReport from '../../pages/pdf-reports/SettlementWithCustomers'

/////////////////////////////////////////////
// Test

// import TestPage from '../../pages/Test'        // Test
// import MobileTestPage from '../pages/mobile-test'

/////////////////////////////////////////////
// Main component

export const routeItems = () => {

    const { Header, Sider, Content, Footer } = Layout
    const element = (
        <Layout className='layout-app'>
            <CheckAuth >
                <Header className={`layout-app-header${(isFullscreenTDesktop()) && ' layout-app-header-desktop' || ''}${(isFullscreenAndroid() || isFullscreenIOS()) && ' layout-app-header-mobile' || ''}`}>
                    <AppStatusBar />
                    <AppHeader />
                </Header>
                <Content className='layout-app-content'>
                    <Outlet />
                </Content>
                <Footer className='layout-app-footer'>
                    <AppFooter />
                    <AppNavBar />
                </Footer>
            </CheckAuth>
        </Layout >
    )

    return [
        {
            path: '/',
            element,
            children: [
                { path: '/', element: < LandingPage /> },
                // { path: '/landing', element: < LandingPage /> },
                { path: '/home', element: < HomePage /> },
                // { path: '/support', element: < SupportPage /> },
                // { path: '/about', element: < AboutPage /> },
                { path: '/about', element: < LandingPage /> },
                { path: '/login', element: < LoginPage /> },
                { path: '/logout', element: < LogoutPage /> },
                { path: '/connect-user', element: < ConnectPage /> },
                { path: '/carts', element: < CartsPage /> },
                { path: '/customers', element: < CustomersPage /> },
                { path: '/sales-orders', element: < SalesOrderPage /> },
                // { path: '/order/:id', element: < OrderViewPage /> },
                { path: '/products', element: < ProductsPage /> },
                // { path: '/product/:id', element: < ProductViewPage /> },
                // { path: '/product-characteristics', element: < ProductCharacteristicListPage /> },
                // { path: '/product-characteristic/:id', element: < ProductCharacteristicPage /> },
                { path: '/uom-classifier', element: < UOMClassifierPage /> },
                { path: '/employees', element: < EmployeesPage /> },
                { path: '/user-profile', element: < UserProfilePage /> },
                // { path: '/individuals', element: < IndividualsPage /> },
                { path: '/settings', element: < SettingsPage /> },
                { path: '/daily-report', element: < DailyReport /> },
                { path: '/settlement-with-customers-report', element: < SettlementWithCustomersReport /> },

                { path: '/structural-units', element: < StructuralUnitsPage /> },
                { path: '/sales-invoices', element: < SalesInvoicesPage /> },
                { path: '/supplier-invoices', element: < SupplierInvoicesPage /> },
                { path: '/cash-receipts', element: < CashReceiptsPage /> },
                { path: '/payment-receipts', element: < PaymentReceiptsPage /> },
                { path: '/currencies', element: < CurrenciesPage /> },
                { path: '/price-registrations', element: < PriceRegistrationPage /> },

                { path: '/money-receipt-cash', element: < CashReceiptPage /> },
                { path: '/money-expense-cash', element: < CashExpensePage /> },

                { path: '/money-receipt-payment', element: < PaymentReceiptPage /> },
                { path: '/money-expense-payment', element: < PaymentExpensePage /> },

                { path: '/view', element: < ViewPage /> },
                // { path: '/product-view', element: < ProductsPage /> },

                // { path: '/test', element: < TestPage /> },
                // { path: '/test-mobile', element: < MobileTestPage /> },
            ]
        }
    ]
}
