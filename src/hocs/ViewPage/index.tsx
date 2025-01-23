/////////////////////////////////////////////
// Standard's

import { ReactNode, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Drawer, Modal } from 'antd'

/////////////////////////////////////////////
// Application's

// import { actions } from '../data-storage/slice-current'
import { ITEM_VALUE_ACTIONS, XTSChoicePageProps, XTSViewPageProps } from '../../data-objects/types-components'
import { XTSItemValue } from '../../data-objects/types-form'
import { createXTSObject } from '../../data-objects/common-use'

import CustomersPage from '../../pages/customer'
import SalesOrdersPage from '../../pages/sales-order'
import ProductsPage from '../../pages/product'
import UOMClassifierPage from '../../pages/uom-classifier'
import EmployeesPage from '../../pages/employee'
import StructuralUnitsPage from '../../pages/structural-unit'

import CashReceiptsPage from '../../pages/cash-receipt'
import PaymentReceiptsPage from '../../pages/payment-receipt'
import SalesInvoicesPage from '../../pages/sales-invoice'
import SupplierInvoicesPage from '../../pages/supplier-invoice'
import CurrenciesPage from '../../pages/currency'
import PriceRegistrationsPage from '../../pages/price-registration'

/////////////////////////////////////////////
// Object's

import './index.css'
import { getIndexPage } from '../pages'

/////////////////////////////////////////////
// Main's

// OK
function getObjectPage(dataType: string): React.FC<any> {

    const mapPages: { [key: string]: React.FC } = {
        XTSCounterparty: CustomersPage,
        XTSOrder: SalesOrdersPage,
        XTSSalesInvoice: SalesInvoicesPage,
        XTSSupplierInvoice: SupplierInvoicesPage,
        XTSCashReceipt: CashReceiptsPage,
        XTSPaymentReceipt: PaymentReceiptsPage,
        XTSProduct: ProductsPage,
        XTSUOMClassifier: UOMClassifierPage,
        XTSEmployee: EmployeesPage,
        XTSStructuralUnit: StructuralUnitsPage,
        XTSCurrency: CurrenciesPage,
        XTSPriceRegistration: PriceRegistrationsPage,

        // XTSCashReceipt: CashReceiptPage,
        // XTSPaymentReceipt: PaymentReceiptPage,
        // XTSSalesInvoice: SalesInvoicePage,
        // XTSSupplierInvoice: SupplierInvoicePage,

        // Thêm các trang nữa
        // ...
    }

    const result = mapPages[dataType] || <></>

    return result
}

// OK
const ViewPage: React.FC<XTSViewPageProps> = (props) => {

    const { modalProps, dataType, id } = props
    const [renderKey, setRenderKey] = useState(0)
    // console.log('ChoicePage.props', props)

    // const dispatch = useDispatch()

    // choiceItemValue
    // Hàm sự kiện để xử lý kết quả chọn giá trị ChoicePage vào Attribute của Form
    const choiceItemValue = (itemValue: XTSItemValue) => {
        props.choiceItemValue(itemValue)
        // closeChoicePage()
    }

    const closeViewPage = () => {
        const itemValue = createXTSObject('XTSItemValue', { dataType, action: ITEM_VALUE_ACTIONS.ESCAPE })
        props.choiceItemValue(itemValue)
    }

    const ObjectIndexPage = getIndexPage(dataType)

    useEffect(() => {
        if (modalProps.open) {
            setRenderKey(prevValue => prevValue + 1)
        }
    }, [modalProps.open])

    /////////////////////////////////////////////
    // 

    return (

        <Drawer
            className='modal-page'
            {...modalProps}
            width='100%'
            onClose={closeViewPage}
        >
            <div className='modal-page-index-page' >
                <ObjectIndexPage
                    id={id}
                    choiceItemValue={choiceItemValue}
                    renderKey={renderKey}
                />
            </div>
        </Drawer >
    )
}

export default ViewPage
