/////////////////////////////////////////////
// Standard's

import { ReactNode, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Drawer, Modal } from 'antd'

/////////////////////////////////////////////
// Application's

// import { actions } from '../data-storage/slice-current'
import { ITEM_VALUE_ACTIONS, XTSChoicePageProps, XTSObjectEditProps, XTSObjectViewProps } from '../../data-objects/types-components'
import { XTSItemValue } from '../../data-objects/types-form'
import { createXTSObject } from '../../data-objects/common-use'

/////////////////////////////////////////////
// Object's

import './index.css'
import { XTSObject, XTSObjectId } from '../../data-objects/types-common'
import RelatedIndexPage from './RelatedIndex'

/////////////////////////////////////////////
// Main's

// OK
export interface XTSRelatedPageProps {
    objectId: XTSObjectId
    dataObject?: XTSObject
    title: string
    open: boolean
    pageName: string
    choiceItemValue: (itemValue: XTSItemValue) => void
}

// OK
const RelatedPage: React.FC<XTSRelatedPageProps> = (props) => {

    // const navigate = useNavigate()
    const { objectId } = props
    const [renderKey, setRenderKey] = useState(0)
    // const [itemValue, setItemValue] = useState<XTSItemValue>(createXTSObject('XTSItemValue', { action: ITEM_VALUE_ACTIONS.LIST }))

    const closeRelatedPage = () => {
        const itemValue = createXTSObject('XTSItemValue', { dataType: objectId.dataType, action: ITEM_VALUE_ACTIONS.ESCAPE })
        props.choiceItemValue(itemValue)
    }

    const choiceItemValue = (itemValue: XTSItemValue) => {
        props.choiceItemValue(itemValue)
    }

    useEffect(() => {
        if (props.open) {
            setRenderKey(prevValue => prevValue + 1)
        }
    }, [props.open])

    // console.log('props.dataObject', props.dataObject)

    /////////////////////////////////////////////
    // 

    return (
        <Drawer
            className='related-modal-page'
            title={props.title}
            open={props.open}
            width='100%'
            onClose={closeRelatedPage}
        >
            <RelatedIndexPage
                // pageId={pageId}
                objectId={objectId}
                dataObject={props.dataObject}
                choiceItemValue={choiceItemValue}
                // stepBack={stepBack}
                renderKey={renderKey}
            />
        </Drawer >
    )
}

export default RelatedPage
