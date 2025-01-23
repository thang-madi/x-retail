/////////////////////////////////////////////
// Standard's

import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Button, Space, Card, List, Descriptions, Divider, Tag } from 'antd'

/////////////////////////////////////////////
// Application's

// import { setValue } from '../../data-storage/slice-current'
import { CheckOutlined, SelectOutlined } from '@ant-design/icons'
import { ITEM_VALUE_ACTIONS, XTSObjectCardProps } from '../../data-objects/types-components'
import { createXTSObject, objectPresentation } from '../../data-objects/common-use'

/////////////////////////////////////////////
// Object's

import { XTSCashReceipt, XTSPaymentReceipt, XTSSupplierInvoice } from '../../data-objects/types-application'
import './index.css'

/////////////////////////////////////////////
// Main component

const ObjectCard: React.FC<XTSObjectCardProps> = (props) => {

    const { item, itemName, additionals } = props
    const formData = item as XTSPaymentReceipt

    const doItem = (action: ITEM_VALUE_ACTIONS): void => {
        if (props.choiceItemValue) {
            const itemValue = createXTSObject('XTSItemValue')
            Object.assign(itemValue, item.objectId)
            itemValue.dataItem = item
            itemValue.action = action
            itemValue.itemName = itemName
            props.choiceItemValue(itemValue)
            // console.log('clickItem.choiceItemValue', itemValue)
            // console.log('clickItem.choiceItemValue', choiceItemValue)
        }
    }

    const clickItem = (e: React.MouseEvent) => {
        e.stopPropagation()
        doItem(ITEM_VALUE_ACTIONS.VIEW)
    }

    const choiceItem = (e: React.MouseEvent) => {
        e.stopPropagation()
        doItem(ITEM_VALUE_ACTIONS.CHOICE)
    }

    /////////////////////////////////////////////
    //

    return (
        <Card
            className='payment-receipt-card'
            onClick={clickItem}
        >
            <div className='payment-receipt-card-title' >
                {objectPresentation(formData.objectId)}
            </div>

            <Divider className='payment-receipt-card-divider' orientation='center' />

            <div className='payment-receipt-view-item'>
                <div className='payment-receipt-view-item-title'>Cơ sở: </div>
                <div>{objectPresentation(formData.documentBasis)}</div>
            </div>

            <div className='payment-receipt-card-row' >
                <div>Người trả: </div>
                <div>{formData.counterparty?.presentation}</div>
            </div>

            {/* <div className='payment-receipt-card-row'>
                <div>Địa chỉ giao hàng: </div>
                <div>{formData.deliveryAddress}</div>
            </div> */}

            <div className='payment-receipt-card-row'>
                <div>Ghi chú: </div>
                <div>{formData.comment}</div>
            </div>

            <Divider className='payment-receipt-card-divider' orientation='center' />

            <div className='payment-receipt-card-row'>
                <div>Số tiền: </div>
                <b>{formData.documentAmount?.toLocaleString('vi-VN')} {formData.cashCurrency?.presentation}</b>
            </div>

            <Button
                className='payment-receipt-card-choice-button'
                htmlType='button'
                onClick={choiceItem}
                style={{ display: (props.itemName) && 'block' || 'none' }}
            >
                <SelectOutlined />Chọn
            </Button>

        </Card >
    )
}

/////////////////////////////////////////////
// Export's

export default ObjectCard