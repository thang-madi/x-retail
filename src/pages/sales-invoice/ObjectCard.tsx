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

import { XTSSalesInvoice } from '../../data-objects/types-application'
import './index.css'

/////////////////////////////////////////////
// Main component

const ObjectCard: React.FC<XTSObjectCardProps> = (props) => {

    const { item, itemName, additionals } = props
    const formData = item as XTSSalesInvoice

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
            className='sales-invoice-card'
            onClick={clickItem}
        >
            <div className='sales-invoice-card-title' >
                {formData.objectId.presentation
                    .replace('Hóa đơn giao hàng', 'Giao hàng số ')
                    .replace('(chưa kết chuyển)', '(nháp)')}
            </div>

            <Divider className='sales-invoice-card-divider' orientation='center' />

            <div className='sales-invoice-card-row'>
                <div>Cơ sở: </div>
                <div>{objectPresentation(formData.docOrder)}</div>
            </div>

            <div className='sales-invoice-card-row' >
                <div>Khách hàng: </div>
                <div>{formData.counterparty?.presentation}</div>
            </div>

            <div className='sales-invoice-card-row'>
                <div>Địa chỉ giao hàng: </div>
                <div>{formData.deliveryAddress}</div>
            </div>

            <div className='sales-invoice-card-row'>
                <div>Ghi chú: </div>
                <div>{formData.comment}</div>
            </div>

            <Divider className='sales-invoice-card-divider' orientation='center' />

            <div className='sales-invoice-card-row'>
                <div>Số tiền giao hàng: </div>
                <b>{formData.documentAmount?.toLocaleString('vi-VN')} đồng</b>
            </div>

            <Button
                className='sales-invoice-card-choice-button'
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