/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

/////////////////////////////////////////////
// Application's

import { useIndexPage, UseIndexPageParams } from '../../hooks/usePage'
import { ITEM_VALUE_ACTIONS, USAGE_MODES, XTSObjectIndexProps } from '../../data-objects/types-components'

/////////////////////////////////////////////
// Object's

import ListPage from './ObjectList'
import ViewPage from './ObjectView'
import EditPage from './ObjectEdit'
// import PrintPage from './OrderPrint'
// import RelatedPage from './OrderRelatedDocuments'

/////////////////////////////////////////////
// Main component

// OK
export const dataType = 'XTSOrder'

// OK
export function getPages() {
    return {
        IndexPage: OrdersPage,
        ViewPage,
        EditPage,
        ListPage,
    }
}

//
const OrdersPage: React.FC<XTSObjectIndexProps> = (props) => {          // 

    // const navigate = useNavigate()
    const { itemName } = props

    // const [searchParams, setSearchParams] = useSearchParams()
    // const id = searchParams.get('id') || undefined
    // let action = (id) && ITEM_VALUE_ACTIONS.VIEW || undefined
    // if (searchParams.get('edit') === 'true') {
    //     action = ITEM_VALUE_ACTIONS.EDIT
    // }
    // const [searchParams, setSearchParams] = useSearchParams()

    // // id
    // const id = searchParams.get('id') || props.id

    // // action
    // let action = ITEM_VALUE_ACTIONS.LIST
    // if (!props.itemName && searchParams.get('edit')) {
    //     action = ITEM_VALUE_ACTIONS.EDIT
    // } else if (!props.itemName && id) {
    //     action = ITEM_VALUE_ACTIONS.VIEW
    // }

    // // usageMode
    // let usageMode = USAGE_MODES.DEFAULT
    // if (id) {
    //     usageMode = USAGE_MODES.ITEM_VIEW
    // } else if (searchParams.get('mode') === USAGE_MODES.LIST_VIEW) {
    //     usageMode = USAGE_MODES.LIST_VIEW
    // }

    const afterSave = (tempData: any): void => {

    }

    const params: UseIndexPageParams = {
        dataType,
        id: props.id,
        itemName,
        // action,
        // reopen: props.reopen,
        choiceItemValue: props.choiceItemValue,
        afterSave,                   // Tạm thời chưa khả dụng, cần xem xét lại
        // navigate,
    }
    const { itemValue, pageId, usageMode, stepBack, choiceItemValue } = useIndexPage(params)

    switch (itemValue.action) {
        case ITEM_VALUE_ACTIONS.EDIT:
            return (
                <EditPage
                    pageId={pageId}
                    itemValue={itemValue}
                    itemName={props.itemName}
                    choiceItemValue={choiceItemValue}
                    stepBack={stepBack}
                />
            )
        case ITEM_VALUE_ACTIONS.VIEW:
            // console.log('View document')
            return (
                <ViewPage
                    pageId={pageId}
                    itemValue={itemValue}
                    itemName={props.itemName}
                    usageMode={usageMode}
                    renderKey={props.renderKey}
                    choiceItemValue={choiceItemValue}
                    stepBack={stepBack}
                />
            )
        // case ITEM_VALUE_ACTIONS.PRINT:
        //     return (
        //         <PrintPage
        //             pageId={pageId}
        //             itemValue={itemValue}
        //             itemName={props.itemName}
        //             choiceItemValue={choiceItemValue}
        //             stepBack={stepBack}
        //         />
        //     )
        // case ITEM_VALUE_ACTIONS.GET_RELATED:
        //     console.log('Related documents')
        //     return (
        //         <RelatedPage
        //             pageId={pageId}
        //             itemValue={itemValue}
        //             itemName={props.itemName}
        //             choiceItemValue={choiceItemValue}
        //             stepBack={stepBack}
        //         />
        //     )
        default:
            return (
                <ListPage
                    pageId={pageId}
                    itemName={props.itemName}
                    choiceItemValue={choiceItemValue}
                    stepBack={stepBack}
                    renderKey={props.renderKey}
                />
            )
    }

}

/////////////////////////////////////////////
// Export

export default OrdersPage                                   // 