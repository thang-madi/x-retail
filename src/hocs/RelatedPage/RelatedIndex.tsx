/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

/////////////////////////////////////////////
// Application's

import { useStepBack } from '../../hooks/usePage'
import { ITEM_VALUE_ACTIONS, XTSObjectIndexProps } from '../../data-objects/types-components'

/////////////////////////////////////////////
// Object's

import ListPage from './RelatedList'
// import ViewPage from './RelatedView'
// import EditPage from './RelatedEdit'
import { XTSItemValue } from '../../data-objects/types-form'
import { generateUUID } from '../../commons/common-use'
import { createXTSObject } from '../../data-objects/common-use'
import { XTSObject, XTSObjectId } from '../../data-objects/types-common'
import { getEditPage, getViewPage } from '../pages'

/////////////////////////////////////////////
// Main component

export interface XTSRelatedIndexProps {
    objectId: XTSObjectId
    dataObject?: XTSObject
    // dataType: string
    renderKey: number
    choiceItemValue: (itemValue: XTSItemValue) => void
}

// OK
export interface UseRelatedPageParams {
    // dataType: string
    // id?: string
    // itemName?: string
    // reopen?: boolean
    objectId: XTSObjectId
    dataObject?: XTSObject
    action?: ITEM_VALUE_ACTIONS
    choiceItemValue: (itemValue: XTSItemValue) => void
    // afterSave?: (tempData: any) => void
    // navigate: NavigateFunction
}

// OK
export function useRelatedIndexPage(params: UseRelatedPageParams) {

    // const { dataType, id, action, afterSave } = params

    // const { user } = useSelector((state: RootState) => state.session)
    // const dispatch = useDispatch()

    const stepBack = () => {
        // console.log('itemValue', itemValue)
        const newItemValue = createItemValue(itemValue)
        // if (itemValue.action === ITEM_VALUE_ACTIONS.PRINT) {
        //     newItemValue.action = ITEM_VALUE_ACTIONS.VIEW
        //     setItemValue(newItemValue)
        // } else if (itemValue.action === ITEM_VALUE_ACTIONS.GET_RELATED) {
        //     newItemValue.action = ITEM_VALUE_ACTIONS.VIEW
        //     setItemValue(newItemValue)
        if (itemValue.action === ITEM_VALUE_ACTIONS.VIEW) {
            newItemValue.action = ITEM_VALUE_ACTIONS.LIST
            setItemValue(newItemValue)
        } else if (itemValue.action === ITEM_VALUE_ACTIONS.EDIT) {
            if (itemValue.id) {
                newItemValue.action = ITEM_VALUE_ACTIONS.VIEW
                setItemValue(newItemValue)
            } else {
                newItemValue.action = ITEM_VALUE_ACTIONS.LIST
                setItemValue(newItemValue)
            }
        } else {
            // Đóng ChoiceModal\
            newItemValue.action = ITEM_VALUE_ACTIONS.ESCAPE
            choiceItemValue(newItemValue)
            // } else if (itemValue.action === ITEM_VALUE_ACTIONS.LIST) {
            //     // newItemValue.action = ITEM_VALUE_ACTIONS.ESCAPE
            //     console.log('Go home')
            // } else if (user) {
            //     navigate('/home')
            //     // console.log('Go home')
            //     // navigate(-1)
            // } else {
            //     navigate('/about')
        }
    }

    const choiceItemValue = (value: XTSItemValue): void => {

        if (value.action === ITEM_VALUE_ACTIONS.LIST) {
            setItemValue(value)
        } else if (value.action === ITEM_VALUE_ACTIONS.VIEW) {
            setItemValue(value)
        } else if (value.action === ITEM_VALUE_ACTIONS.EDIT) {
            setItemValue(value)
            // } else if (value.action === ITEM_VALUE_ACTIONS.PRINT) {
            //     setItemValue(value)
            // } else if (value.action === ITEM_VALUE_ACTIONS.GET_RELATED) {
            //     setItemValue(value)
        } else if (params.choiceItemValue) {
            params.choiceItemValue(value)
            itemValue.action = ITEM_VALUE_ACTIONS.LIST
        }
    }

    const [pageId] = useState(generateUUID())
    useStepBack({ pageId, stepBack })

    /////////////////////////////////////////////
    // Khởi tạo giá trị itemValue

    const createItemValue = (itemValue: { [key: string]: any }): XTSItemValue => {
        const result = createXTSObject('XTSItemValue', itemValue)
        return result
    }

    const [itemValue, setItemValue] = useState<XTSItemValue>(createItemValue({ itemName: '', dataItem: params.dataObject }))

    return { itemValue, pageId, choiceItemValue, stepBack }
}

// OK
const RelatedIndexPage: React.FC<XTSRelatedIndexProps> = (props) => {

    // const navigate = useNavigate()
    const { objectId } = props

    const [searchParams, setSearchParams] = useSearchParams()
    const id = searchParams.get('id')
    let action = (id) && ITEM_VALUE_ACTIONS.VIEW || ITEM_VALUE_ACTIONS.LIST
    if (searchParams.get('edit')) {
        action = ITEM_VALUE_ACTIONS.EDIT
    }

    const afterSave = (tempData: any): void => {

    }

    const params = {
        // dataType: objectId.dataType,
        // id: id || undefined,
        // itemName,
        objectId,
        dataObject: props.dataObject,
        action,
        choiceItemValue: props.choiceItemValue,
        // afterSave,                      // Tạm thời chưa khả dụng, cần xem xét lại
        // navigate,
    }
    const { itemValue, pageId, stepBack, choiceItemValue } = useRelatedIndexPage(params)

    /////////////////////////////////////////////
    // 

    // switch (itemValue.action) {
    //     case ITEM_VALUE_ACTIONS.EDIT:
    //         console.log('EditPage', EditPage)
    //         return (
    //             <EditPage
    //                 pageId={pageId}
    //                 itemValue={itemValue}
    //                 title='Chứng từ liên quan 222'
    //                 pageName='Chứng từ liên quan 222'
    //                 // itemName={props.itemName}
    //                 choiceItemValue={choiceItemValue}
    //                 stepBack={stepBack}
    //             />
    //         )
    //     case ITEM_VALUE_ACTIONS.VIEW:
    //         // const EditPage = getEditPage(itemValue.dataType)
    //         console.log('ViewPage', typeof ViewPage)
    //         return (
    //             <ViewPage
    //                 pageId={pageId}
    //                 itemValue={itemValue}
    //                 title='Chứng từ liên quan 111'
    //                 pageName='Chứng từ liên quan 111'
    //                 // itemName={props.itemName}
    //                 choiceItemValue={choiceItemValue}
    //                 stepBack={stepBack}
    //             />
    //         )
    //     default:
    //         return (
    //             <ListPage
    //                 pageId={pageId}
    //                 objectId={props.objectId}
    //                 title='Chứng từ liên quan..'
    //                 pageName='Danh sách chứng từ liên quan'
    //                 choiceItemValue={choiceItemValue}
    //                 stepBack={stepBack}
    //                 renderKey={props.renderKey}
    //             />
    //         )
    // }

    switch (itemValue.action) {
        case ITEM_VALUE_ACTIONS.EDIT:
            const EditPage = getEditPage(itemValue.dataType)
            // console.log('EditPage', EditPage)
            return (
                <EditPage
                    pageId={pageId}
                    itemValue={itemValue}
                    itemName=''
                    choiceItemValue={choiceItemValue}
                    stepBack={stepBack}
                />
            )
        case ITEM_VALUE_ACTIONS.VIEW:
            const ViewPage = getViewPage(itemValue.dataType)
            // console.log('ViewPage', ViewPage)
            return (
                <ViewPage
                    pageId={pageId}
                    itemValue={itemValue}
                    itemName=''
                    choiceItemValue={choiceItemValue}
                    stepBack={stepBack}
                />
            )
        default:
            return (
                <ListPage
                    pageId={pageId}
                    objectId={props.objectId}
                    dataObject={props.dataObject}
                    title='Chứng từ liên quan..'
                    pageName='Danh sách chứng từ liên quan'
                    choiceItemValue={choiceItemValue}
                    stepBack={stepBack}
                    renderKey={props.renderKey}
                />
            )
    }
}

/////////////////////////////////////////////
// Export

export default RelatedIndexPage