/////////////////////////////////////////////
// Standard's

import { ReactNode, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Modal } from 'antd'

/////////////////////////////////////////////
// Application's

// import { actions } from '../data-storage/slice-current'
import { ITEM_VALUE_ACTIONS, XTSChoicePageProps, XTSSubPageProps } from '../../data-objects/types-components'
import { XTSItemValue } from '../../data-objects/types-form'
import { createXTSObject } from '../../data-objects/common-use'

import CustomersPage from '../../pages/customer'
import OrdersPage from '../../pages/sales-order'
import ProductsPage from '../../pages/product'
import UOMClassifierPage from '../../pages/uom-classifier'
import EmployeesPage from '../../pages/employee'
import PaymentEditPage from '../../pages/sales-order/PaymentEdit'
import { generateUUID } from '../../commons/common-use'

/////////////////////////////////////////////
// Object's

import './index.css'

/////////////////////////////////////////////
// Main's

function getObjectPage(pageName: string): React.FC<any> {

    const mapPages: { [key: string]: React.FC<any> } = {
        Payment: PaymentEditPage,

        // Thêm các trang nữa
        // ...
    }

    const result = mapPages[pageName] || <></>

    return result
}

// OK
const SubPage: React.FC<XTSSubPageProps> = (props) => {

    const { modalProps, itemValue, pageName } = props

    // const dispatch = useDispatch()

    // choiceItemValue
    // Hàm sự kiện để xử lý kết quả chọn giá trị ChoicePage vào Attribute của Form
    const choiceItemValue = (itemValue: XTSItemValue) => {
        // const { itemName } = itemValue
        // console.log('pageOwnerId', props)
        // dispatch(actions.setParams({ pageId: pageOwnerId }))
        // props.setPageInfo()
        props.choiceItemValue(itemValue)
    }

    const closeSubPage = () => {
        // const itemValue = createXTSObject('XTSItemValue', { dataType, action: ITEM_VALUE_ACTIONS.ESCAPE })
        // itemValue.action = ITEM_VALUE_ACTIONS.ESCAPE
        props.choiceItemValue(itemValue)
        // console.log('closeModal')
    }

    // const choiceProps = { itemValue, choiceItemValue }
    // const { dataType } = initialItemValue

    const SubEditPage = getObjectPage(pageName)

    const [pageId, setPageId] = useState(generateUUID())
    useEffect(() => {
        if (modalProps.open) {
            setPageId(generateUUID())
        }
    }, [modalProps.open])

    return (
        <Modal
            className='modal-page'
            {...modalProps}
            centered
            // width='100%'
            // height='100%'
            onCancel={closeSubPage}
        >
            <div className='modal-page-sub-page' >
                <SubEditPage
                    pageId={pageId}
                    itemValue={itemValue}
                    choiceItemValue={choiceItemValue}
                />
            </div>
        </Modal >
    )
}

export default SubPage
