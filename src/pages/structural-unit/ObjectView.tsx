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

    // const dataType = 'XTSStructuralUnit'                        //
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
        <div className='structural-unit-view' >

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <Card className='structural-unit-view-card'>
                <div className='structural-unit-view-description'>{dataObject.description}</div>
                <div className='structural-unit-view-item'>
                    <span className='structural-unit-view-item-title'>Tên gọi: </span>
                    <span className='structural-unit-view-item-value'>{dataObject.description}</span>
                </div>
                <div className='structural-unit-view-item'>
                    <span className='structural-unit-view-item-title'>Dạng kho: </span>
                    <span className='structural-unit-view-item-value'>{dataObject.structuralUnitType.presentation}</span>
                </div>
                <div className='structural-unit-view-item'>
                    <span className='structural-unit-view-item-title'>Kho 2 pha: </span>
                    <span className='structural-unit-view-item-value'>{dataObject.orderWarehouse?.toString()}</span>
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