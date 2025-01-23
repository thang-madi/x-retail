/////////////////////////////////////////////
// Standard's

import { useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button, FloatButton } from 'antd'
import { ArrowLeftOutlined, EditOutlined, ReloadOutlined, SelectOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Application's

import { useGetDataObject, UseGetDataObjectParams, useOpenPage, UseOpenPageParams } from '../../hooks/usePage'
// import { xtsObjectToFormData } from '../../data-exchange/common-use'
import { ITEM_VALUE_ACTIONS, XTSObjectViewProps } from '../../data-objects/types-components'
import { createXTSObject } from '../../data-objects/common-use'
import { BottomBar } from '../../components/ContextMenu'
import { REQUEST_STATUSES } from '../../commons/enums'
import { Loader } from '../../components/Loader'
import { dataType } from './'
import './index.css'

/////////////////////////////////////////////
// Main component

//OK
const UOMClassifierViewPage: React.FC<XTSObjectViewProps> = (props) => {

    const { itemValue, pageId } = props

    const { id } = useParams()
    const object_id = (id) || itemValue?.id
    // const dataType = 'XTSUOMClassifier'
    // const tabNames = []

    const getDataObjectParams: UseGetDataObjectParams = {
        dataType,
        object_id,
        // tabNames,
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
            if (props.choiceItemValue) {
                const itemValue = createXTSObject('XTSItemValue')
                Object.assign(itemValue, dataObject.objectId)
                itemValue.dataItem = dataObject
                itemValue.action = action
                props.choiceItemValue(itemValue)
                // console.log('clickItem.choiceItemValue', choiceItemValue)
            }
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
        <div className='uom-classifier-view'>

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <div>
                <p>Tên gọi: {dataObject?.description}</p>
                <p>Mã: {dataObject?.code}</p>
            </div>

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

export default UOMClassifierViewPage