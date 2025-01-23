/////////////////////////////////////////////
// Standard's

import { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Button, Space, List, Input, FloatButton, notification } from 'antd'
import { CheckSquareOutlined, FileTextOutlined, PlusCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Application's

// import { createXTSObject } from '../../data-exchange/objects'
import { useGetDataList, UseGetDataListParams, useGetRecordSet, UseGetRecordSetParams, useOpenPage, UseOpenPageParams, } from '../../hooks/usePage'
// import { createRequestDataByDataItem, createSaveObjectRequest, newItemValue } from '../../data-exchange/common-use'
// import { FormListSearch } from '../../components/ListSearch'

/////////////////////////////////////////////
// Object's

import { apiRequest, actions } from '../../data-storage/slice-cart'             // carts
import { VirtualGrid } from '../../components/Virtualized'
import CartCard from './CartCard'                                       // cart
import { BottomBar } from '../../components/ContextMenu'
import { ITEM_VALUE_ACTIONS, XTSRecordListProps } from '../../data-objects/types-components'
import { RootState } from '../../data-storage'
import { createXTSObject } from '../../data-objects/common-use'
import { requestData_SaveObject } from '../../data-objects/request-data'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { XTSCart } from '../../data-objects/types-application'
import { fillDefaultValues } from '../../data-objects/default-values'
import { REQUEST_STATUSES } from '../../commons/enums'
// import { FOOTER_HEIGHT } from '../../commons/constants'
import { useSaveCart } from '../../hooks/useCarts'
import { Loader } from '../../components/Loader'
import { generateUUID } from '../../commons/common-use'
// import { setPageInfo } from '../../data-storage/slice-current'

import './index.css'

/////////////////////////////////////////////
// Main component

const RecordListPage: React.FC<XTSRecordListProps> = (props) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const dataType = 'XTSCart'

    // Các tham số 
    //  - externalAccount
    const { externalAccount, customer } = useSelector((state: RootState) => state.session)
    const filter = createXTSObject('XTSRecordFilter')
    // filter.externalAccount = externalAccount
    filter.customer = customer
    const requestParams = { filter }

    const getRecordSetParams: UseGetRecordSetParams = {
        dataType,
        requestParams,
        refresh: true,
        sortBy: 'date',
    }
    const { dataList, refreshList } = useGetRecordSet(getRecordSetParams)

    /////////////////////////////////////////////
    //

    const openPageParams: UseOpenPageParams = {
        pageId: props.pageId,
        pageName: dataType,
        pageTitle: 'Giỏ hàng của khách',
        renderKey: props.renderKey,
    }
    useOpenPage(openPageParams)

    /////////////////////////////////////////////
    // 

    const { saveCarts } = useSaveCart()

    const selectAll = () => {
        // console.log('dataList', dataList)
        const cartItems = []
        for (let cartItem of dataList) {
            cartItems.push({ ...cartItem, selected: true })
        }
        saveCarts(cartItems)
    }

    // Tạo Order từ Cart
    const defaultValues = useSelector((state: RootState) => state.session.defaultValues)

    const createOrder = () => {

        if (status !== REQUEST_STATUSES.IDLE) {
            console.log('busy')
            return      // Nếu như đang ở trạng thái khác như: SENDING/LOADING/SUCCEEDED thì sẽ bỏ qua, cần đợi Request trước hoàn thành
        }

        if (dataList.findIndex((item: XTSCart) => item.selected) === -1) {
            console.log('Chưa chọn bất kỳ một hàng hóa nào cả')
            return
        }

        if (!defaultValues?.customer) {

            const messageText = 'Bạn chưa điền thông tin khách hàng. Vui lòng bổ sung trong phần "Hồ sơ người dùng"'
            notification.open({
                message: 'Tạo đơn hàng',
                description: messageText,
            })
            return
        }

        const dataObject = createXTSObject('XTSOrder')
        fillDefaultValues(dataObject, { ...defaultValues, externalAccount })

        dataObject._extraData_ = {
            externalAccount,
            fromCart: true,
        }

        const requestData = requestData_SaveObject(dataObject)

        // console.log('createOrder.dataObject:', dataObject)
        // console.log('createOrder.requestData', requestData)

        const { apiRequest, actions } = getXTSSlice('XTSOrder')

        // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(actions.setTemp(null))
        dispatch(apiRequest(requestData))
    }

    /////////////////////////////////////////////
    //

    const renderItem = (item: XTSCart) => {

        return (
            <CartCard
                item={item}
                itemName={props.itemName}
                // additionals={}
                choiceItemValue={props.choiceItemValue}
            />
        )
    }

    /////////////////////////////////////////////
    // 

    const { status, tempData } = useSelector((state: RootState) => state['salesOrders'])

    useEffect(() => {
        const responseTypes = ['XTSCreateObjectsResponse']
        // if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.find(item => item === tempData['_type'])) {
        if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.includes(tempData['_type'])) {
            const { objects } = tempData
            if (objects[0].objectId?.id) {         // id chính thức được lưu là nằm trong tempData
                const objectId = objects[0].objectId
                const searchParams = new URLSearchParams({
                    id: objectId.id
                }).toString()
                navigate(`/sales-orders?${searchParams}`, { replace: true })
            }
            dispatch(actions.setStatus(REQUEST_STATUSES.IDLE))
        }
    }, [status, tempData])

    const listGrid = {
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 3,
        xxl: 4,
    }

    /////////////////////////////////////////////
    // 

    return (
        <div className='cart-list-page'>

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <VirtualGrid
                dataType={dataType}
                items={dataList}
                renderItem={renderItem}
                rowHeight={108}
                listGrid={listGrid}
            // loadMore={loadMore}
            />

            <BottomBar
                stepBack={{ onClick: props.stepBack, visible: Boolean(props.stepBack) }}
                refresh={{ onClick: refreshList }}
                action1={{ onClick: selectAll, title: 'Chọn tất cả', icon: <CheckSquareOutlined className='context-menu-button-icon' /> }}
                action2={{ onClick: createOrder, title: 'Tạo đơn', icon: <FileTextOutlined className='context-menu-button-icon' />, visible: (status === REQUEST_STATUSES.IDLE) }}
            />

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default RecordListPage