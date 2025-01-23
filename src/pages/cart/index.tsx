/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/////////////////////////////////////////////
// Application's

import { useIndexPage } from '../../hooks/usePage'
import { ITEM_VALUE_ACTIONS, XTSObjectIndexProps } from '../../data-objects/types-components'

/////////////////////////////////////////////
// Object's

import ListPage from './CartList'                          // 
// import ViewPage from './cart-view'                      // 
// import EditPage from './cart-edit'                      // 

/////////////////////////////////////////////
// Main component

// OK
const CartsPage: React.FC<XTSObjectIndexProps> = (props) => {                 // 

    const navigate = useNavigate()
    const { itemName } = props

    let action = ITEM_VALUE_ACTIONS.LIST

    const afterSave = (tempData: any): void => {

    }

    const params = {
        dataType: 'XTSCounterparty',
        itemName,
        action,
        choiceItemValue: props.choiceItemValue,
        afterSave,                      // Tạm thời chưa khả dụng, cần xem xét lại
        navigate,
    }
    const { itemValue, pageId, stepBack, choiceItemValue } = useIndexPage(params)

    switch (itemValue.action) {
        case ITEM_VALUE_ACTIONS.EDIT:
            return (
                <div>
                </div>
                // {/* <EditPage
                //         pageId={pageId}
                //         itemValue={itemValue}
                //         itemName={props.itemName}
                //         choiceItemValue={choiceItemValue}
                //         stepBack={stepBack}
                //     /> */}
            )
        case ITEM_VALUE_ACTIONS.VIEW:
            return (
                <div>
                </div>
                // <ViewPage
                //     itemValue={itemValue}
                //     itemName={props.itemName}
                //     choiceItemValue={choiceItemValue}
                //     stepBack={stepBack}
                // />
            )
        default:
            return (
                <ListPage
                    pageId={pageId}
                    itemName={props.itemName}
                    choiceItemValue={choiceItemValue}
                    stepBack={stepBack}
                />
            )
    }
}

/////////////////////////////////////////////
// Export

export default CartsPage                                // 