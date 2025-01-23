/////////////////////////////////////////////
// Standard's

import { ReactNode, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Drawer, Modal } from 'antd'

/////////////////////////////////////////////
// Application's

// import { actions } from '../data-storage/slice-current'
import { ITEM_VALUE_ACTIONS, XTSChoicePageProps, XTSObjectPrintProps, XTSPrintPageProps } from '../../data-objects/types-components'
import { XTSItemValue } from '../../data-objects/types-form'
import { createXTSObject } from '../../data-objects/common-use'

import OrderPrintPage from '../../pages/sales-order/ObjectPrint'

/////////////////////////////////////////////
// Object's

import './index.css'
import { generateUUID } from '../../commons/common-use'
import { useOpenPage, UseOpenPageParams, useStepBack } from '../../hooks/usePage'
import { BottomBar } from '../../components/ContextMenu'

/////////////////////////////////////////////
// Main's

// OK
function getPrintPage(dataType: string): React.FC<XTSObjectPrintProps> {

    const mapPages: { [key: string]: React.FC<XTSObjectPrintProps> } = {
        XTSOrder: OrderPrintPage,
        // XTSCounterparty: CustomersPage,
        // XTSProduct: ProductsPage,
        // XTSUOMClassifier: UOMClassifierPage,
        // XTSEmployee: EmployeesPage,

        // Thêm các trang nữa
        // ...
    }

    const result = mapPages[dataType] || <></>

    return result
}

// OK
const PrintPage: React.FC<XTSPrintPageProps> = (props) => {

    const { objectId, title, open, pageName } = props
    const { dataType } = objectId
    const [renderKey, setRenderKey] = useState(0)

    const closePrintPage = () => {
        const itemValue = createXTSObject('XTSItemValue', { dataType, action: ITEM_VALUE_ACTIONS.ESCAPE })
        props.choiceItemValue(itemValue)
    }

    const [pageId] = useState(generateUUID())
    useStepBack({ pageId, stepBack: closePrintPage })

    const openPageParams: UseOpenPageParams = {
        pageId,
        pageName: props.pageName,
        pageTitle: props.title,
        renderKey: renderKey
    }
    useOpenPage(openPageParams)

    /////////////////////////////////////////////
    //

    const ObjectPrintPage = getPrintPage(dataType)

    useEffect(() => {
        if (props.open) {
            setRenderKey(prevValue => prevValue + 1)
        }
    }, [props.open])

    /////////////////////////////////////////////
    // 

    return (

        <Drawer
            className='modal-page'
            title={props.title}
            open={props.open}
            width='100%'
            onClose={closePrintPage}
        >
            <div className='modal-page-index-page' >
                <ObjectPrintPage
                    objectId={objectId}
                    choiceItemValue={closePrintPage}
                    pageId={pageId}
                // renderKey={renderKey}
                />
                <BottomBar
                    stepBack={{ onClick: closePrintPage }}
                />
            </div>
        </Drawer >
    )
}

export default PrintPage
