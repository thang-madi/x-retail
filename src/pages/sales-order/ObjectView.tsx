/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Card, Descriptions, Divider, FloatButton, List, Modal, notification, Space, Tag } from 'antd'
import { ArrowLeftOutlined, CheckCircleOutlined, CheckOutlined, ContainerOutlined, CopyOutlined, DeleteOutlined, DollarCircleOutlined, EditOutlined, LinkOutlined, ReloadOutlined, SelectOutlined, ShoppingCartOutlined, TruckOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'


/////////////////////////////////////////////
// Application's

import { useGetDataObject, UseGetDataObjectParams, useOpenPage, UseOpenPageParams } from '../../hooks/usePage'
import { BottomBar } from '../../components/ContextMenu'
import { ITEM_VALUE_ACTIONS, USAGE_MODES, XTSObjectViewProps } from '../../data-objects/types-components'
import { SALES_ORDER_STATES } from './enums'
import { REQUEST_STATUSES } from '../../commons/enums'
import { createXTSObject, getXTSEnumItem, objectPresentation } from '../../data-objects/common-use'
import { RootState } from '../../data-storage'
import { XTSItemValue } from '../../data-objects/types-form'
import { Loader } from '../../components/Loader'
import { PDFViewer, printFormURL } from '../../components/PDFViewer'
import SubPage from '../../hocs/SubPage'
import { requestData_ByDataItem, requestData_SaveObject, requestData_UpdateObject } from '../../data-objects/request-data'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { copyToClipboard, VND } from '../../commons/common-use'
import { TWA } from '../../commons/telegram'

/////////////////////////////////////////////
// Object's

import { apiRequest, actions } from '../../data-storage/slice-sales-order'
import PrintPage from '../../hocs/PrintPage'
import RelatedPage from '../../hocs/RelatedPage'
import OrderStateTag from './OrderStateTag'
import { dataType } from './'
import './index.css'
import { OrderInventoryView } from './ObjectInventory'

/////////////////////////////////////////////
// Main component

const ObjectViewPage: React.FC<XTSObjectViewProps> = (props) => {

    const { itemValue, pageId, usageMode } = props

    const dispatch = useDispatch()

    const object_id = itemValue.id
    // const dataType = 'XTSOrder'

    const getDataObjectParams: UseGetDataObjectParams = {
        dataType,
        object_id,
        refresh: false,
    }

    const {
        dataObject,
        refreshObject,
        status
    } = useGetDataObject(getDataObjectParams)

    // console.log('dataObject', dataObject)
    const openPageParams: UseOpenPageParams = {
        pageId,
        pageName: dataType,
        pageTitle: (dataObject?.objectId.presentation) || '',
        // renderKey: 0,
    }
    // console.log('openPageParams', openPageParams)
    const { setPageInfo } = useOpenPage(openPageParams)

    /////////////////////////////////////////////
    // 

    const doItem = (action: ITEM_VALUE_ACTIONS): void => {
        if (props.choiceItemValue) {
            const itemValue = createXTSObject('XTSItemValue')
            Object.assign(itemValue, dataObject.objectId)
            itemValue.dataItem = dataObject
            itemValue.action = action
            itemValue.itemName = props.itemName
            props.choiceItemValue(itemValue)
            // console.log('doItem.itemValue', itemValue, action, props.choiceItemValue)
        }
    }

    const editItem = () => {
        doItem(ITEM_VALUE_ACTIONS.EDIT)
    }

    const choiceItem = () => {
        doItem(ITEM_VALUE_ACTIONS.CHOICE)
    }

    const viewRelatedItems = () => {
        setRelatedOpen(true)
    }

    const printItem = () => {
        if (TWA.platform === 'ios') {
            const printFormParams = {
                dataType: itemValue.dataType,
                id: itemValue.id,
                templateName: 'ExternalPrintForm.PF_SalesOrder',
            }
            const url = printFormURL(printFormParams)
            TWA.openLink(url)
        } else {
            setPrintOpen(true)
        }
    }

    /////////////////////////////////////////////
    // Delivered

    const doDelivered = () => {
        const orderState = dataObject['orderState']
        if (orderState.presentation === SALES_ORDER_STATES.PREPARING || orderState.presentation === SALES_ORDER_STATES.TRANSPORTING) {
            const attributeValues = {
                _type: dataType,
                objectId: dataObject.objectId,
                orderState: getXTSEnumItem('XTSSalesOrderState', 'Delivered')
            }
            const requestData = requestData_UpdateObject(attributeValues)

            const { apiRequest, actions } = getXTSSlice(dataType)
            dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setTemp(null))
            dispatch(apiRequest(requestData))
        }
    }

    /////////////////////////////////////////
    // Payment

    const { user, company } = useSelector((state: RootState) => state.session)

    const [editButton, setEditButton] = useState<boolean>(false)
    const [paymentButton, setPaymentButton] = useState<boolean>(false)
    const [printButton, setPrintButton] = useState<boolean>(false)
    const [paymentOpen, setPaymentOpen] = useState<boolean>(false)
    const [deliveredButton, setDeliveredButton] = useState<boolean>(false)

    const onChangeDataObject = (object: any) => {
        if (!object.documentAmount) {
            setPaymentButton(false)
        } else if (!company) {
            setPaymentButton(false)
            // } else if (object.cash > 0 || object.bankTransfer > 0 || object.postPayment > 0) {
            //     setPaymentButton(false)
        } else if (object.orderState.presentation !== SALES_ORDER_STATES.TO_PREPAY) {
            setPaymentButton(false)
        } else {
            setPaymentButton(true)
        }

        if ((object.cash === 0 && object.bankTransfer === 0 && object.openPayment === 0)) {
            setPrintButton(false)
        } else if (object.orderState.presentation === SALES_ORDER_STATES.EDITING ||
            object.orderState.presentation === SALES_ORDER_STATES.TO_PREPAY) {
            setPrintButton(false)
        } else if (!user) {
            setPrintButton(false)
        } else {
            setPrintButton(true)
        }

        if (object['orderState'].presentation === SALES_ORDER_STATES.EDITING) {
            setEditButton(true)
        } else if (company) {
            setEditButton(true)
        } else {
            setEditButton(false)
        }

        if (!user) {
            setDeliveredButton(false)
        } else if (dataObject['orderState'].presentation === SALES_ORDER_STATES.PREPARING) {
            setDeliveredButton(true)
        } else if (dataObject['orderState'].presentation === SALES_ORDER_STATES.TRANSPORTING) {
            setDeliveredButton(true)
        } else {
            setDeliveredButton(false)
        }
    }

    useEffect(() => {
        onChangeDataObject(dataObject)
    }, [dataObject])

    const openPayment = () => {
        setPaymentOpen(true)
    }

    const handleCancel = () => {
        setPaymentOpen(false)
    }

    // Hoàn tất việc thanh toán
    // Lưu ý là để chuyển giữa các Page thì đang dùng doItem bên trên
    const choiceItemValue = (itemValue: XTSItemValue) => {
        if (paymentOpen) {
            setPaymentOpen(false)
            if (itemValue.dataType === 'XTSOrder') {
                // props.choiceItemValue(itemValue)
            }
        } else if (printOpen) {
            setPrintOpen(false)
        } else if (relatedOpen) {
            setRelatedOpen(false)
        }
        setPageInfo()
    }

    const modalProps = {
        title: 'Trả trước',
        height: '80vh',
        width: '100%',
        open: paymentOpen,
        onCancel: handleCancel,
        footer: [],
        style: { marginTop: 0 },
    }

    /////////////////////////////////////////
    // Update after save

    // ???
    // Xem xét lại, vì dữ liệu đã được update vào dataObject rồi, nên không cần phải theo dõi đoạn trả về nữa

    const tempData = useSelector((state: RootState) => state.salesOrders.tempData)
    useEffect(() => {
        const responseTypes = ['XTSCreateObjectsResponse', 'XTSUpdateObjectsResponse']
        if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.includes(tempData['_type'])) {
            dispatch(actions.setStatus(REQUEST_STATUSES.IDLE))
            onChangeDataObject(tempData.objects[0])     // Xem xét lại, có thể không cần thì đã dùng useEffect sau khi thay đổi dataObject
        }
    }, [status, tempData])

    /////////////////////////////////////////
    // Print page

    const [printOpen, setPrintOpen] = useState(false)

    /////////////////////////////////////////
    // Related page

    const [relatedOpen, setRelatedOpen] = useState(false)

    /////////////////////////////////////////////
    // Copy Link

    const copyLink = () => {
        // const url = `http://localhost:3000/products?id=${dataObject.objectId.id}`
        // const url = `https://t.me/XTSRetail_bot?startapp=products__${dataObject.objectId.id}`
        const url = `${window.location.protocol}//${window.location.hostname}/view?id=${dataObject.objectId.id}&type=XTSOrder`
        copyToClipboard(url)
    }

    /////////////////////////////////////////
    // 

    return (

        <div className='sales-order-view'>

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <Card style={{ margin: 5 }}>

                <div style={{ fontWeight: 'bold' }}>
                    {objectPresentation(dataObject.objectId)}
                </div>

                <Divider className='sales-order-view-divider' orientation='center' />

                <div className='sales-order-view-item'>
                    <div className='sales-order-view-item-title'
                    >Khách hàng: </div>
                    <div>{dataObject.customer.presentation}</div>
                </div>

                <div className='sales-order-view-item'>
                    <div className='sales-order-view-item-title'
                    >Địa chỉ giao hàng: </div>
                    <div>{dataObject.deliveryAddress}</div>
                </div>

                <div className='sales-order-view-item'>
                    <div className='view-page-item-title'>Ghi chú: </div>
                    <div>{dataObject.comment}</div>
                </div>

                <div className='sales-order-view-item'>
                    <div>Trạng thái đơn hàng: </div>
                    <OrderStateTag value={dataObject.orderState?.presentation} />
                </div>

                <Divider className='sales-order-view-divider' orientation='center' />

                <div className='sales-order-view-item'>
                    <div>Giá trị giao hàng: </div>
                    <div>{VND(dataObject._receiptableIncrease)}</div>
                </div>
                <div className='sales-order-view-item'>
                    <div>Số tiền đã thu: </div>
                    <div>{VND(dataObject._receiptableDecrease)}</div>
                </div>
                <div className='sales-order-view-item'>
                    <div>Số tiền phải thu: </div>
                    <div className={(dataObject._receiptableBalance > 0) && 'sales-order-view-item-hight-light' || ''}>
                        {VND(dataObject._receiptableBalance)}
                    </div>
                </div>


                {/* <div className='sales-order-view-item'>
                    <div>Tỷ lệ thanh toán: </div>
                    <div>{'__ %'}</div>
                </div>

                <div className='sales-order-view-item'>
                    <div>Tỷ lệ giao hàng: </div>
                    <div>{'__ %'}</div>
                </div> */}

                <Divider className='sales-order-view-divider' orientation='center' />

                <div className='sales-order-view-item'>
                    <div>Số tiền đơn hàng: </div>
                    <b>{VND(dataObject.documentAmount)}</b>
                </div>
                {/* <div className='sales-order-view-item'>
                    <div>Thu tiền khi chốt đơn:</div>
                    <div>
                        {(dataObject.cash) && `TM: ${dataObject.cash} ` || ''}
                        {(dataObject.bankTransfer) && `CK: ${dataObject.bankTransfer} ` || ''}
                        {(dataObject.postPayment) && ` Trả sau: ${dataObject.postPayment} ` || ''}
                    </div>
                </div> */}
            </Card >

            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 3,
                    xl: 4,
                    xxl: 5,
                }}
                dataSource={dataObject.inventory}
                renderItem={(dataRow) => (
                    <List.Item style={{ padding: '0px', marginBottom: '3px' }}>
                        <OrderInventoryView
                            dataRow={dataRow}
                            setPageInfo={setPageInfo}
                        />
                    </List.Item>
                )}
                style={{ margin: '4px' }}
                locale={{ emptyText: 'Không có sản phẩm nào được chọn' }}
            />

            <SubPage
                modalProps={modalProps}
                pageName='Payment'
                itemValue={itemValue}
                choiceItemValue={choiceItemValue}
            />

            <PrintPage
                objectId={dataObject.objectId}
                title='In đơn hàng'
                open={printOpen}
                pageName='Print order'
                choiceItemValue={choiceItemValue}
            />

            <RelatedPage
                objectId={dataObject.objectId}
                dataObject={dataObject}
                title='Chứng từ liên quan'
                open={relatedOpen}
                pageName='Related documents'
                choiceItemValue={choiceItemValue}
            />

            <BottomBar
                stepBack={{ onClick: props.stepBack, visible: Boolean(props.stepBack) }}
                editItem={{ onClick: editItem, visible: editButton && usageMode !== USAGE_MODES.ITEM_VIEW }}
                choiceItem={{ onClick: choiceItem, visible: Boolean(props.itemName) }}
                relatedDocuments={{ onClick: viewRelatedItems }}
                refresh={{ onClick: refreshObject, }}
                action1={{ onClick: openPayment, title: 'Thanh toán', icon: <DollarCircleOutlined className='context-menu-button-icon' />, visible: paymentButton }}
                action2={{ onClick: printItem, title: 'In đơn', icon: <ContainerOutlined className='context-menu-button-icon' />, visible: printButton }}
                action3={{ onClick: doDelivered, title: 'Giao hàng', icon: <TruckOutlined className='context-menu-button-icon' />, visible: deliveredButton }}
                action4={{ onClick: copyLink, icon: <LinkOutlined className='context-menu-button-icon' />, title: 'Link' }}
            />

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default ObjectViewPage