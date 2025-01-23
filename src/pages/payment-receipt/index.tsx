/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

/////////////////////////////////////////////
// Application's

import { useIndexPage, UseIndexPageParams } from '../../hooks/usePage'
import { ITEM_VALUE_ACTIONS, XTSObjectIndexProps } from '../../data-objects/types-components'

/////////////////////////////////////////////
// Object's

import ListPage from './ObjectList'
import ViewPage from './ObjectView'
import EditPage from './ObjectEdit'

import './index.css'

/////////////////////////////////////////////
// Main component

// OK
export const dataType = 'XTSPaymentReceipt'

// OK
export function getPages() {
    return {
        IndexPage: PaymentReceiptsPage,
        ViewPage,
        EditPage,
        ListPage,
    }
}

//
const PaymentReceiptsPage: React.FC<XTSObjectIndexProps> = (props) => {

    // const navigate = useNavigate()
    const { itemName } = props

    // const [searchParams, setSearchParams] = useSearchParams()
    // const id = searchParams.get('id') || undefined
    // let action = ITEM_VALUE_ACTIONS.LIST
    // if (!props.itemName && searchParams.get('edit')) {
    //     action = ITEM_VALUE_ACTIONS.EDIT
    // } else if (!props.itemName && id) {
    //     action = ITEM_VALUE_ACTIONS.VIEW
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
    const { itemValue, pageId, stepBack, choiceItemValue } = useIndexPage(params)

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
            return (
                <ViewPage
                    pageId={pageId}
                    itemValue={itemValue}
                    itemName={props.itemName}
                    choiceItemValue={choiceItemValue}
                    stepBack={stepBack}
                />
            )
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

export default PaymentReceiptsPage