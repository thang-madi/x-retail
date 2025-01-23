/////////////////////////////////////////////
// Standard's

import React, { Children } from 'react'
import { Form, Button, Space, Card, List, Descriptions, Image, Avatar } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Application's

import { XTSCounterparty, XTSCurrency, XTSStructuralUnit } from '../../data-objects/types-application'
import { createXTSObject, isEmptyObjectId } from '../../data-objects/common-use'
import { ITEM_VALUE_ACTIONS, XTSObjectCardProps } from '../../data-objects/types-components'
import { useSelector } from 'react-redux'
import { RootState } from '../../data-storage'
// import { newItemValue, xtsObjectToFormData } from '../../data-exchange/common-use'

/////////////////////////////////////////////
// Object's

// import pictureMale from '../../assets/male.png'
// import pictureFemale from '../../assets/female.png'
// import pictureUnknown from '../../assets/unknown.png'
// import { displayPartsToString } from 'typescript'

import './index.css'

/////////////////////////////////////////////
// Main component

// OK
const ObjectCard: React.FC<XTSObjectCardProps> = (props) => {

    const { item, itemName } = props
    const formData = item as XTSCurrency                            //

    const doItem = (action: ITEM_VALUE_ACTIONS): void => {
        if (props.choiceItemValue) {
            const itemValue = createXTSObject('XTSItemValue')
            Object.assign(itemValue, item.objectId)
            itemValue.dataItem = item
            itemValue.action = action
            itemValue.itemName = props.itemName
            props.choiceItemValue(itemValue)
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
    // Pictures

    // var imageSrc = ''
    // const fileStorageURL = useSelector((state: RootState) => state.session.fileStorageURL)
    // const picture = formData.picture

    // if (isEmptyObjectId(picture)) {
    //     if (formData.gender?.id === 'Male') {
    //         imageSrc = pictureMale
    //     } else if (formData.gender?.id === 'Female') {
    //         imageSrc = pictureFemale
    //     } else {
    //         imageSrc = pictureUnknown
    //     }
    // } else if (picture.presentation.indexOf(picture?.id) !== -1) {
    //     imageSrc = fileStorageURL + picture.presentation
    // }

    /////////////////////////////////////////////
    // 

    return (
        <Card
            className='currency-item-card'
            onClick={clickItem}
        >
            {/* <Avatar
                className='item-card-avatar'
                size={90}
                src={imageSrc}
            /> */}

            <div className='currency-item-card-content' >
                <div><b>{formData.description}</b></div>
                <div>Tên gọi đầy đủ: {formData.descriptionFull}</div>
                <div>Mã: {formData.code}</div>
                <div>Ký hiệu: {formData?.symbolicPresentation}</div>
                <div>Tiền tệ tỷ giá: {formData.mainCurrency?.presentation}</div>
                <pre className='currency-item-card-content-comment'>
                    {/* Ghi chú: {formData.comment} */}
                </pre>

                <Button
                    className='currency-item-card-button-choice'
                    style={{ display: (props.itemName) && 'block' || 'none' }}
                    htmlType='button'
                    onClick={choiceItem}
                // icon={<SelectOutlined />}
                >
                    Chọn
                </Button>
            </div>

        </Card >
    )
}

/////////////////////////////////////////////
// Export's

export default ObjectCard