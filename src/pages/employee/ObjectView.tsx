/////////////////////////////////////////////
// Standard's

import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Avatar, Button, Descriptions, FloatButton, Modal, Upload } from 'antd'
import { ArrowLeftOutlined, CameraOutlined, EditOutlined, ReloadOutlined, SelectOutlined, UploadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

/////////////////////////////////////////////
// Application's

import { useGetDataObject, UseGetDataObjectParams, useOpenPage, UseOpenPageParams } from '../../hooks/usePage'
import { ITEM_VALUE_ACTIONS, XTSMediaItem, XTSObjectViewProps } from '../../data-objects/types-components'
import { createXTSMediaItem, createXTSObject } from '../../data-objects/common-use'
import { BottomBar } from '../../components/ContextMenu'
// import { AppAvatar } from '../../components/Avatar'
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

    // console.log('EmployeeViewPage.props', props)
    // console.log('initialItemValue', initialItemValue)

    const object_id = itemValue.id
    // const dataType = 'XTSEmployee'

    const getDataObjectParams: UseGetDataObjectParams = {
        dataType,
        object_id,
        refresh: true,
    }

    const {
        dataObject,
        // formData,
        // valueTabs,
        refreshObject,
        // setValueTabs,
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

    const descriptionTitle = <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
        <div >{dataObject?.description}</div>
        {/* <div>{formData.code}</div> */}
    </div>

    const descriptionItems = [
        {
            label: 'Mã',
            children: dataObject?.code,
            labelStyle: { width: '80px' }
        },
        {
            label: 'Tên gọi',
            children: dataObject?.description,
            labelStyle: { width: '80px' }
        },
        {
            label: 'Cá nhân',
            children: dataObject?.individual.presentation,
            labelStyle: { width: '80px' }
        },
        {
            label: 'Company',
            children: dataObject?.parentCompany.presentation,
            labelStyle: { width: '80px' }
        },
        {
            label: 'Head employee',
            children: dataObject?.headEmployee.presentation,
            labelStyle: { width: '80px' }
        },
        {
            label: 'Đã xóa',
            children: dataObject.invalid,
            labelStyle: { width: '80px' }
        },
    ]

    /////////////////////////////////////////////
    // Avatar 

    // const dataType_AttachedFile = 'XTSEmployeeAttachedFile'
    // const [currentAvatar, setCurrentAvatar] = useState<XTSMediaItem>(createXTSMediaItem(undefined))

    // const avatarProps = { dataType: dataType_AttachedFile, currentAvatar }

    // useEffect(() => {
    //     if (dataObject?.picture) {
    //         setCurrentAvatar(dataObject.picture)
    //     }

    // }, [dataObject])

    /////////////////////////////////////////////
    //  

    return (
        <div className='employee-view' >
            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            {/* <AppAvatar
                {...avatarProps}
            /> */}

            <Descriptions
                title={descriptionTitle}
                bordered={false}
                column={{
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 3,
                    xl: 4,
                    xxl: 5,
                }}
                items={descriptionItems}
                style={{ padding: 20 }}
            />

            <BottomBar
                stepBack={{ onClick: props.stepBack, visible: Boolean(props.stepBack) }}
                refresh={{ onClick: refreshObject, }}
                // editItem={{ onClick: editItem }}
                choiceItem={{ onClick: choiceItem, visible: Boolean(props.itemName) }}
            />

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default ObjectViewPage