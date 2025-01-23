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

    // console.log('CustomerViewPage.props', props)
    // console.log('initialItemValue', initialItemValue)
    // const { user, telegramId } = useSelector((state: any) => state.session)

    const object_id = itemValue.id
    // const dataType = 'XTSCounterparty'

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
    // Avatar 

    const dataType_AttachedFile = 'XTSCounterpartyAttachedFile'
    const [currentAvatar, setCurrentAvatar] = useState<XTSMediaItem>(createXTSMediaItem(undefined))

    const avatarProps = { dataType: dataType_AttachedFile, currentAvatar }

    useEffect(() => {
        // console.log('dataItem?.picture 1', dataItem.picture)
        if (dataObject?.picture) {
            setCurrentAvatar(dataObject.picture)
        }
        // console.log('dataObject', dataObject)

    }, [dataObject])

    /////////////////////////////////////////////
    //  

    return (
        <div className='customer-view' >

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <AppAvatar
                {...avatarProps}
            />

            <Card className='customer-view-card'>
                <div className='customer-view-description'>{dataObject.description}</div>
                <div className='customer-view-item'>
                    <span className='view-item-title'>Tên đầy đủ: </span>
                    <span className='customer-view-item-value'>{dataObject.descriptionFull}</span>
                </div>
                <div className='customer-view-item'>
                    <span className='customer-view-item-title'>Điện thoại: </span>
                    <span className='customer-view-item-value'>{dataObject.phone}</span>
                </div>
                <div className='customer-view-item'>
                    <span className='customer-view-item-title'>Email: </span>
                    <span className='customer-view-item-value'>{dataObject.email}</span>
                </div>
                <div className='customer-view-item'>
                    <span className='customer-view-item-title'>Giới tính: </span>
                    <span className='customer-view-item-value'>{dataObject.gender.presentation}</span>
                </div>
                <div className='customer-view-item'>
                    <span className='customer-view-item-title'>Ngày sinh: </span>
                    <span className='customer-view-item-value'>{(dataObject.dateOfBirth) && dayjs(dataObject.dateOfBirth).format('DD-MM-YYYY')}</span>
                </div>
                <div className='customer-view-item'>
                    <span className='customer-view-item-title'>Dạng đối tác: </span>
                    <span className='customer-view-item-value'>
                        <div>{(dataObject.customer) && 'Khách hàng' || ''}</div>
                        <div>{(dataObject.vendor) && 'Nhà cung cấp' || ''}</div>
                        <div>{(dataObject.otherRelation) && 'Khacs' || ''}</div>
                    </span>
                </div>
                <div className='customer-view-item'>
                    <span className='customer-view-item-title'>Ghi chú: </span>
                    <span className='customer-view-item-value'>{dataObject.descriptionFull}</span>
                </div>
                <div className='customer-view-item'>
                    <span className='customer-view-item-title'>Chăm sóc: </span>
                    <span className='customer-view-item-value'>{dataObject.employeeResponsible.presentation}</span>
                </div>

                <div className='customer-view-description'></div>
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