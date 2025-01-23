/////////////////////////////////////////////
// Standard's

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Menu, Space } from 'antd'
import {
    HomeOutlined,
    LogoutOutlined,
    QuestionCircleOutlined,
    InfoCircleOutlined,
    ProductOutlined,
    FileTextOutlined,
    TeamOutlined,
    BugOutlined,
    UserOutlined,
    SettingOutlined,
    BlockOutlined,
    CloseOutlined,
    LoginOutlined,
    ShoppingCartOutlined,
    ApiOutlined,
    VerticalAlignBottomOutlined,
    IdcardOutlined,
    ApartmentOutlined,
    TruckOutlined,
    TransactionOutlined,
    DollarOutlined,
    DockerOutlined,
} from '@ant-design/icons'

/////////////////////////////////////////////
// Object's

import './index.css'
// import { MENU_BACKGROUND_COLOR } from '../../commons/constants'
import { RootState } from '../../data-storage'

/////////////////////////////////////////////
// Constant's

const homeItem = { label: "Trang chính", key: "/home", icon: <HomeOutlined /> }
const cartItem = { label: "Giỏ hàng", key: "/carts", icon: <ShoppingCartOutlined /> }
const productItem = { label: "Sản phẩm", key: "/products", icon: <ProductOutlined /> }
const ordersItem = { label: "Đơn hàng", key: "/sales-orders", icon: <FileTextOutlined /> }
const customersItem = { label: "Khách hàng", key: "/customers", icon: <TeamOutlined /> }
const employeeItem = { label: "Nhân viên", key: "/employees", icon: <IdcardOutlined /> }
const settingsItem = { label: "Tùy chỉnh", key: "/settings", icon: <SettingOutlined /> }
const userProfileItem = { label: "Hồ sơ người dùng", key: "/user-profile", icon: < UserOutlined /> }
const loginItem = { label: "Đăng nhập", key: "/login", icon: <LoginOutlined />, style: { fontWeight: 'bold', color: 'blue' } }
const logoutItem = { label: "Đăng xuất", key: "/logout", icon: <LogoutOutlined />, danger: true }
const aboutItem = { label: "Về cửa hàng", key: "/about", icon: <InfoCircleOutlined /> }

const structuralUnitItem = { label: "Đơn vị", key: "/structural-units", icon: <ApartmentOutlined /> }
const salesInvoiceItem = { label: "Giao hàng", key: "/sales-invoices", icon: <TruckOutlined /> }
const supplierInvoiceItem = { label: "Nhận hàng", key: "/supplier-invoices", icon: <DockerOutlined /> }
const cashReceiptItem = { label: "Thu tiền mặt", key: "/cash-receipts", icon: <DollarOutlined /> }
const paymentReceiptItem = { label: "Thu chuyển khoản", key: "/payment-receipts", icon: <TransactionOutlined /> }

const currencyItem = { label: "Tiền tệ", key: "/currencies", icon: <TransactionOutlined /> }
const priceRegistrationItem = { label: "Đặt bảng giá", key: "/price-registrations", icon: <TransactionOutlined /> }

// const connectItem = { label: "Connect user", key: "/connect-user", icon: <ApiOutlined />, style: { color: 'blue' } }

const uomClassifierItem = { label: "UOM classifier", key: "/uom-classifier", icon: < SettingOutlined /> }
const testItem = { label: "Test", key: "/test", icon: <BugOutlined /> }

/////////////////////////////////////////////
// Main component

interface AppMenuProps {
    closeMenu: () => void
}

const AppMenu: React.FC<AppMenuProps> = (props) => {

    const navigate = useNavigate()

    // const TWA = (window as any).Telegram.WebApp
    // const telegramId = TWA.initDataUnsafe.user?.id || null

    // const userProfile = useSelector((state: RootState) => state.session.userProfile)
    // const appTitle = (userProfile) && userProfile.presentation || 'XTS Retail'

    const { userToken, userProfile, user, company, phone } = useSelector((state: RootState) => state.session)

    var menuItems = []

    if (!userToken) {
        menuItems = [
            // homeItem,
            // cartItem,
            // productItem,
            // ordersItem,
            // customersItem,
            // userProfileItem,
            aboutItem,
            loginItem,
            // logoutItem
        ]
    } else if (!userProfile) {
        menuItems = [
            // homeItem,
            cartItem,
            productItem,
            // ordersItem,
            // customersItem,
            userProfileItem,
            aboutItem,
            // loginItem,
            // logoutItem
        ]
    } else if (!user) {
        menuItems = [
            // homeItem,
            cartItem,
            productItem,
            ordersItem,
            // customersItem,
            userProfileItem,
            aboutItem,
            // loginItem,
            // logoutItem
        ]
    } else if (!company) {
        menuItems = [
            homeItem,
            // cartItem,
            productItem,
            ordersItem,
            customersItem,
            structuralUnitItem,
            salesInvoiceItem,
            supplierInvoiceItem,
            cashReceiptItem,
            paymentReceiptItem,
            currencyItem,
            priceRegistrationItem,

            // employeeItem,
            userProfileItem,
            aboutItem,
            // settingsItem,
            // loginItem,
            // logoutItem
        ]
    } else {
        menuItems = [
            homeItem,
            // cartItem,
            productItem,
            ordersItem,
            customersItem,
            employeeItem,
            structuralUnitItem,
            salesInvoiceItem,
            supplierInvoiceItem,
            cashReceiptItem,
            paymentReceiptItem,
            currencyItem,
            priceRegistrationItem,

            userProfileItem,
            aboutItem,
            // settingsItem,
            // loginItem,
            // logoutItem
        ]
    }

    if (phone) {
        menuItems.push(logoutItem)
    }

    return (

        <div className='app-menu' >

            <Menu
                className='menu-panel'
                mode={'inline'}
                defaultSelectedKeys={[window.location.pathname]}
                onClick={({ key }) => {
                    navigate(key)
                    props.closeMenu()
                }}
                items={menuItems}
            />

        </div>
    )
}


/////////////////////////////////////////////
// Export

export default AppMenu