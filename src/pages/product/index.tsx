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


/////////////////////////////////////////////
// Main component

// OK
export const dataType = 'XTSProduct'

// OK
export function getPages() {
    return {
        IndexPage: ProductsPage,
        ViewPage,
        EditPage,
        ListPage,
    }
}

//                             
const ProductsPage: React.FC<XTSObjectIndexProps> = (props) => {

    // const navigate = useNavigate()
    const { itemName } = props

    // console.log('objectIds', props.objectIds)

    // const [searchParams, setSearchParams] = useSearchParams()

    // id
    // const id = props.id

    // // action
    // let action = ITEM_VALUE_ACTIONS.LIST
    // if (!props.itemName) {
    //     if (searchParams.get('edit') && dataType === searchParams.get('type')) {
    //         action = ITEM_VALUE_ACTIONS.EDIT
    //     } else if (id) {
    //         action = ITEM_VALUE_ACTIONS.VIEW
    //     }
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
        // usageMode,
        choiceItemValue: props.choiceItemValue,
        afterSave,              // Tạm thời chưa khả dụng, cần xem xét lại
        // navigate,
    }
    const { itemValue, pageId, stepBack, choiceItemValue, usageMode } = useIndexPage(params)       // pageId dùng cho ITEM_VALUE_ACTIONS.EDIT

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
                    usageMode={usageMode}
                    renderKey={props.renderKey}
                    choiceItemValue={choiceItemValue}
                    stepBack={stepBack}
                />
            )
        default:
            return (
                <ListPage
                    pageId={pageId}
                    itemName={props.itemName}
                    objectIds={props.objectIds}                 // Hiện tại mới chỉ dùng cho Product
                    usageMode={usageMode}
                    renderKey={props.renderKey}
                    choiceItemValue={choiceItemValue}
                    stepBack={stepBack}
                />
            )
    }
}

/////////////////////////////////////////////
// Export

export default ProductsPage                                // Products