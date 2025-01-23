/////////////////////////////////////////////
// Standard's

import React, { Children } from 'react'
import { Form, Button, Space, Card, List, Descriptions, Image, Avatar } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Application's

import { XTSEmployee } from '../../data-objects/types-application'
import { createXTSObject, isEmptyObjectId } from '../../data-objects/common-use'
import { ITEM_VALUE_ACTIONS, XTSObjectCardProps } from '../../data-objects/types-components'
import { useSelector } from 'react-redux'
import { RootState } from '../../data-storage'
// import { newItemValue, xtsObjectToFormData } from '../../data-exchange/common-use'

/////////////////////////////////////////////
// Object's

import pictureMale from '../../assets/male.png'
import pictureFemale from '../../assets/female.png'
import pictureUnknown from '../../assets/unknown.png'

import './index.css'

/////////////////////////////////////////////
// Main component

// OK
const ObjectCard: React.FC<XTSObjectCardProps> = (props) => {

    const { item, itemName } = props
    const formData = item as XTSEmployee

    // const formData = xtsObjectToFormData(item)
    // console.log('itemName', itemName)
    // console.log('EmployeeCard.formData', formData)

    const doItem = (action: ITEM_VALUE_ACTIONS): void => {
        if (props.choiceItemValue) {
            const itemValue = createXTSObject('XTSItemValue')
            Object.assign(itemValue, item.objectId)
            itemValue.dataItem = item
            itemValue.action = action
            itemValue.itemName = props.itemName
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
    // Pictures

    // var imageSrc = ''
    // const fileStorageURL = useSelector((state: RootState) => state.session.fileStorageURL)
    // const picture = formData.picture
    // // console.log('item', item)

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
            className='employee-card'
            onClick={clickItem}
        // style={{ margin: '2px', height: '65px' }}
        // styles={{ body: { padding: '5px' } }}
        >
            {/* <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}> */}

            {/* <div style={{ width: '150px', height: '150px', minWidth: '150px', overflow: 'hidden' }}>
                    <Avatar
                        size={120}
                        src={imageSrc}
                        style={{ margin: '20px' }}
                    />
                </div> */}

            <div className='employee-card-row' >
                <b>{formData.description}</b>
                <div>Cá nhân: {formData.individual?.presentation}</div>
                {/* <div>Invalid: {formData.invalid}</div> */}
            </div>

            <Button
                className='employee-card-choice-button'
                htmlType='button'
                onClick={choiceItem}
                style={{ display: (props.itemName) && 'block' || 'none' }}
            // icon={<SelectOutlined />}
            >
                Chọn
            </Button>
            {/* </div > */}
        </Card >
    )
}

/////////////////////////////////////////////
// Export's

export default ObjectCard