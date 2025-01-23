/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

/////////////////////////////////////////////
// Application's

// import { useStepBack } from '../../hooks/usePage'
// import { ITEM_VALUE_ACTIONS, XTSObjectIndexProps } from '../../data-objects/types-components'

/////////////////////////////////////////////
// Object's

import SalesOrderViewPage from './sales-order/ObjectView'
import ProductViewPage from './product/ObjectView'

import { XTSItemValue } from '../../data-objects/types-form'
import { generateUUID } from '../../commons/common-use'
import { createXTSObject } from '../../data-objects/common-use'
import { useStepBack } from '../../hooks/usePage'
import { getIndexPage } from '../../hocs/pages'

/////////////////////////////////////////////
// Main component

export interface ViewPageProps {
    // id: string
    // choiceItemValue: (itemValue: XTSItemValue) => void
}

// OK
export interface UseViewPageParams {
    id: string
    dataType: string
}

// OK
function getViewPage(dataType: string) {
    switch (dataType) {
        case 'XTSOrder':
            return SalesOrderViewPage

        case 'XTSProduct':
            return ProductViewPage

        default:
            return SalesOrderViewPage
    }
}

// OK
export function useViewPage(params: UseViewPageParams) {

    const { dataType, id } = params
    const [objectId, setObjectId] = useState({ id, dataType })

    const stepBack = () => {
        // console.log('itemValue', itemValue)
        const newItemValue = createItemValue(itemValue)
        if (itemValue.dataType === 'XTSProduct') {
            newItemValue.id = objectId.id
            newItemValue.dataType = objectId.dataType
            setItemValue(newItemValue)
        }
    }

    const choiceItemValue = (value: XTSItemValue): void => {
        setItemValue(value)
    }

    const [pageId] = useState(generateUUID())
    useStepBack({ pageId, stepBack })

    /////////////////////////////////////////////
    // Khởi tạo giá trị itemValue

    const createItemValue = (itemValue: { [key: string]: any }): XTSItemValue => {
        const result = createXTSObject('XTSItemValue', itemValue)
        return result
    }

    const [itemValue, setItemValue] = useState<XTSItemValue>(createItemValue({ dataType, id }))

    return { itemValue, pageId, choiceItemValue, stepBack }
}

// // OK
// const ViewPage: React.FC<ViewPageProps> = () => {

//     const [searchParams, setSearchParams] = useSearchParams()
//     const id = searchParams.get('id') || ''
//     const dataType = searchParams.get('type') || ''

//     const params = {
//         id,
//         dataType,
//     }
//     const { itemValue, pageId, stepBack, choiceItemValue } = useViewPage(params)

//     /////////////////////////////////////////////
//     // 

//     const _ViewPage = getViewPage(itemValue.dataType)

//     return (
//         <_ViewPage
//             pageId={pageId}
//             itemValue={itemValue}
//             choiceItemValue={choiceItemValue}
//             stepBack={stepBack}
//         />
//     )
// }

// OK
const ViewPage: React.FC<ViewPageProps> = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const id = searchParams.get('id') || ''
    const dataType = searchParams.get('type') || ''

    const params = {
        id,
        dataType,
    }
    const { itemValue, pageId, stepBack, choiceItemValue } = useViewPage(params)

    /////////////////////////////////////////////
    // 

    // const _ViewPage = getViewPage(itemValue.dataType)
    const ObjectIndexPage = getIndexPage(dataType)

    return (
        <ObjectIndexPage
            id={id}
        // choiceItemValue={choiceItemValue}
        // renderKey={renderKey}
        />
    )
}

/////////////////////////////////////////////
// Export

export default ViewPage