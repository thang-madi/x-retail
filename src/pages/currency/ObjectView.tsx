/////////////////////////////////////////////
// Standard's

import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Avatar, Button, Card, Descriptions, FloatButton, Modal, Upload } from 'antd'
import { ArrowLeftOutlined, CameraOutlined, EditOutlined, ReloadOutlined, SelectOutlined, UploadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

/////////////////////////////////////////////
// Application's

import { useGetDataObject, UseGetDataObjectParams, useOpenPage, UseOpenPageParams } from '../../hooks/usePage'
import { ITEM_VALUE_ACTIONS, XTSMediaItem, XTSObjectViewProps } from '../../data-objects/types-components'
import { createXTSMediaItem, createXTSObject } from '../../data-objects/common-use'
import { BottomBar } from '../../components/ContextMenu'
import { AppAvatar } from '../../components/Avatar'
import { REQUEST_STATUSES } from '../../commons/enums'
import { Loader } from '../../components/Loader'

/////////////////////////////////////////////
// Object's

import { dataType } from './'
import './index.css'

/////////////////////////////////////////////
// Main component

// OK
const ObjectViewPage: React.FC<XTSObjectViewProps> = (props) => {

    const { itemValue, pageId } = props

    // const dataType = 'XTSCurrency'                        //
    const object_id = itemValue.id

    const getDataObjectParams: UseGetDataObjectParams = {
        dataType,
        object_id,
        refresh: true,
    }

    const {
        dataObject,
        refreshObject,
        status
    } = useGetDataObject(getDataObjectParams)

    const openPageParams: UseOpenPageParams = {
        pageId,
        pageName: dataType,
        pageTitle: (dataObject?.description) || '',
        // renderKey: 0,
    }
    useOpenPage(openPageParams)

    /////////////////////////////////////////////
    // 

    const doItem = (action: ITEM_VALUE_ACTIONS): void => {
        if (props.choiceItemValue) {
            const itemValue = createXTSObject('XTSItemValue')
            Object.assign(itemValue, dataObject.objectId)
            itemValue.dataItem = dataObject
            itemValue.action = action
            itemValue.itemName = props.itemName
            props.choiceItemValue(itemValue)
        }
    }

    const editItem = () => {
        doItem(ITEM_VALUE_ACTIONS.EDIT)
    }

    const choiceItem = () => {
        doItem(ITEM_VALUE_ACTIONS.CHOICE)
    }

    /////////////////////////////////////////////
    //  

    return (
        <div className='currency-view' >

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <Card className='currency-view-card'>
                <div className='currency-view-description'>{dataObject.description}</div>
                <div className='currency-view-item'>
                    <span className='currency-view-item-title'>Tên gọi: </span>
                    <span className='currency-view-item-value'>{dataObject.description}</span>
                </div>
                <div className='currency-view-item'>
                    <span className='currency-view-item-title'>Tên gọi đầy đủ: </span>
                    <span className='currency-view-item-value'>{dataObject.descriptionFull}</span>
                </div>
                <div className='currency-view-item'>
                    <span className='currency-view-item-title'>Ký hiệu: </span>
                    <span className='currency-view-item-value'>{dataObject.symbolicPresentation}</span>
                </div>
                <div className='currency-view-item'>
                    <span className='currency-view-item-title'>Tiền tệ tỷ giá: </span>
                    <span className='currency-view-item-value'>{dataObject.mainCurrency.presentation}</span>
                </div>

            </Card>

            <BottomBar
                stepBack={{ onClick: props.stepBack, visible: Boolean(props.stepBack) }}
                refresh={{ onClick: refreshObject, }}
                editItem={{ onClick: editItem }}
                choiceItem={{ onClick: choiceItem, visible: Boolean(props.itemName) }}
            />

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default ObjectViewPage