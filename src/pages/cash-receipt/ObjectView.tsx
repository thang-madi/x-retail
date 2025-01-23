/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Card, Descriptions, Divider, FloatButton, List, Modal, notification, Space, Tag } from 'antd'
import { ArrowLeftOutlined, CheckCircleOutlined, CheckOutlined, ContainerOutlined, CopyOutlined, DeleteOutlined, DollarCircleOutlined, EditOutlined, ReloadOutlined, SelectOutlined, ShoppingCartOutlined, TruckOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'


/////////////////////////////////////////////
// Application's

import { useGetDataObject, UseGetDataObjectParams, useOpenPage, UseOpenPageParams } from '../../hooks/usePage'
import { BottomBar } from '../../components/ContextMenu'

/////////////////////////////////////////////
// Object's

import { apiRequest, actions } from '../../data-storage/slice-cash-receipt'                   //
// import { ObjectInventoryView } from './ObjectInventory'
import { ITEM_VALUE_ACTIONS, XTSObjectViewProps } from '../../data-objects/types-components'
import { createXTSObject, getXTSEnumItem, objectPresentation } from '../../data-objects/common-use'
import { RootState } from '../../data-storage'
import { XTSItemValue } from '../../data-objects/types-form'
import { REQUEST_STATUSES } from '../../commons/enums'
import { Loader } from '../../components/Loader'
// import { FOOTER_HEIGHT } from '../../commons/constants'

// import { SALES_ORDER_STATES } from './enums'
import { downloadFile } from '../../commons/common-print'
import { PDFViewer, printFormURL } from '../../components/PDFViewer'
import SubPage from '../../hocs/SubPage'
// import OrderStateTag from './OrderStateTag'
import { requestData_ByDataItem, requestData_SaveObject, requestData_UpdateObject } from '../../data-objects/request-data'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { VND } from '../../commons/common-use'
import { TWA } from '../../commons/telegram'
import PrintPage from '../../hocs/PrintPage'
import RelatedPage from '../../hocs/RelatedPage'
import { dataType } from './'

import './index.css'
import { getLabels } from './common'

/////////////////////////////////////////////
// Main component

const ObjectViewPage: React.FC<XTSObjectViewProps> = (props) => {

    const { itemValue, pageId } = props

    const dispatch = useDispatch()

    const object_id = itemValue.id
    // const dataType = 'XTSCashReceipt'

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

    const labels = getLabels(dataObject)
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
            // const itemValue = createXTSObject('XTSItemValue', {
            //     id: dataObject.objectId.id,
            //     presentation: dataObject.presentation,
            //     dataType: dataObject.objectId.dataType,
            //     itemName: props.itemName,
            //     action,
            // })         
            // props.choiceItemValue(itemValue)
            const itemValue = createXTSObject('XTSItemValue')
            Object.assign(itemValue, dataObject.objectId)
            itemValue.dataItem = dataObject
            itemValue.action = action
            itemValue.itemName = props.itemName
            props.choiceItemValue(itemValue)
        }
        // console.log('doItem.itemValue', itemValue, action, props.choiceItemValue)
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
                templateName: 'ExternalPrintForm.PF_SupplierInvoice',
            }
            const url = printFormURL(printFormParams)
            TWA.openLink(url)
        } else {
            setPrintOpen(true)
        }
    }

    /////////////////////////////////////////
    // 

    const { user, company } = useSelector((state: RootState) => state.session)

    // const [editButton, setEditButton] = useState<boolean>(false)
    // const [paymentButton, setPaymentButton] = useState<boolean>(false)
    const [printButton, setPrintButton] = useState<boolean>(false)
    const [paymentOpen, setPaymentOpen] = useState<boolean>(false)
    // const [deliveredButton, setDeliveredButton] = useState<boolean>(false)

    // Hoàn tất việc thanh toán
    // Lưu ý là để chuyển giữa các Page thì đang dùng doItem bên trên
    const choiceItemValue = (itemValue: XTSItemValue) => {
        // if (paymentOpen) {
        //     setPaymentOpen(false)
        //     if (itemValue.dataType === 'XTSSalesInvoice') {
        //         // props.choiceItemValue(itemValue)
        //     }
        // } else 
        if (printOpen) {
            setPrintOpen(false)
        } else if (relatedOpen) {
            setRelatedOpen(false)
        }
        setPageInfo()
    }

    /////////////////////////////////////////
    // Update after save

    // ???
    // Xem xét lại, vì dữ liệu đã được update vào dataObject rồi, nên không cần phải theo dõi đoạn trả về nữa

    const tempData = useSelector((state: RootState) => state.cashReceipts.tempData)
    useEffect(() => {
        const responseTypes = ['XTSCreateObjectsResponse', 'XTSUpdateObjectsResponse']
        if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.includes(tempData['_type'])) {
            dispatch(actions.setStatus(REQUEST_STATUSES.IDLE))
            // onChangeDataObject(tempData.objects[0])     // Xem xét lại, có thể không cần thì đã dùng useEffect sau khi thay đổi dataObject
        }
    }, [status, tempData])

    /////////////////////////////////////////
    // Print page

    const [printOpen, setPrintOpen] = useState(false)

    /////////////////////////////////////////
    // Related page

    const [relatedOpen, setRelatedOpen] = useState(false)

    /////////////////////////////////////////
    // 

    return (

        <div className='cash-receipt-view'>

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <Card className='cash-receipt-view-header'>

                <div className='cash-receipt-view-title'>
                    {objectPresentation(dataObject.objectId, dataObject.operationKind)}
                </div>

                <Divider className='cash-receipt-view-divider' orientation='center' />

                <div className='cash-receipt-view-item'>
                    <div className='cash-receipt-view-item-title'
                    >Dạng giao dịch: </div>
                    <div>{dataObject.operationKind.presentation}</div>
                </div>

                <div className='cash-receipt-view-item'>
                    <div className='cash-receipt-view-item-title'
                    >{labels.counterpartyLabel}: </div>
                    <div>{dataObject.counterparty.presentation}</div>
                </div>

                <div className='cash-receipt-view-item'>
                    <div className='cash-receipt-view-item-title'
                    >Cơ sở: </div>
                    <div>{objectPresentation(dataObject.documentBasis)}</div>
                </div>

                {/* <div className='cash-receipt-view-item'>
                    <div className='cash-receipt-view-item-title'
                    >Địa chỉ giao hàng: </div>
                    <div>{dataObject.deliveryAddress}</div>
                </div> */}

                <div className='cash-receipt-view-item'>
                    <div className='cash-receipt-view-item-title'>Ghi chú: </div>
                    <div>{dataObject.comment}</div>
                </div>

                <Divider className='cash-receipt-view-divider' orientation='center' />

                {/* <div className='view-page-item'>
                    <div>Giá trị giao hàng: </div>
                    <div>{VND(dataObject._receiptableIncrease)}</div>
                </div>
                <div className='view-page-item'>
                    <div>Số tiền đã thu: </div>
                    <div>{VND(dataObject._receiptableDecrease)}</div>
                </div>
                <div className='view-page-item'>
                    <div>Số tiền phải thu: </div>
                    <div>{VND(dataObject._receiptableBalance)}</div>
                </div> */}


                {/* <div className='view-page-item'>
                    <div>Tỷ lệ thanh toán: </div>
                    <div>{'__ %'}</div>
                </div>

                <div className='view-page-item'>
                    <div>Tỷ lệ giao hàng: </div>
                    <div>{'__ %'}</div>
                </div> */}

                {/* <Divider className='cash-receipt-view-divider' orientation='center' /> */}

                <div className='cash-receipt-view-item'>
                    <div>Số tiền: </div>
                    <b>{dataObject.documentAmount?.toLocaleString('vi-VN')} {dataObject.cashCurrency?.presentation}</b>
                </div>
                {/* <div className='view-page-item'>
                    <div>Thu tiền khi chốt đơn:</div>
                    <div>
                        {(dataObject.cash) && `TM: ${dataObject.cash} ` || ''}
                        {(dataObject.bankTransfer) && `CK: ${dataObject.bankTransfer} ` || ''}
                        {(dataObject.postPayment) && ` Trả sau: ${dataObject.postPayment} ` || ''}
                    </div>
                </div> */}
            </Card >

            {/* <List
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
                        <ObjectInventoryView
                            dataRow={dataRow}
                            dataObject={dataObject}
                        />
                    </List.Item>
                )}
                style={{ margin: '4px' }}
                locale={{ emptyText: 'Không có sản phẩm nào được chọn' }}
            /> */}

            {/* <SubPage
                modalProps={modalProps}
                pageName='Payment'
                itemValue={itemValue}
                choiceItemValue={choiceItemValue}
            /> */}

            {/* <PrintPage
                objectId={dataObject.objectId}
                title='In đơn hàng'
                open={printOpen}
                pageName='Print order'
                choiceItemValue={choiceItemValue}
            /> */}

            <RelatedPage
                objectId={dataObject.objectId}
                title='Chứng từ liên quan'
                open={relatedOpen}
                pageName='Related documents'
                choiceItemValue={choiceItemValue}
            />

            <BottomBar
                stepBack={{ onClick: props.stepBack, visible: Boolean(props.stepBack) }}
                editItem={{ onClick: editItem }}
                choiceItem={{ onClick: choiceItem, visible: Boolean(props.itemName) }}
                // relatedDocuments={{ onClick: viewRelatedItems }}
                refresh={{ onClick: refreshObject, }}
            // action2={{ onClick: printItem, title: 'In đơn', icon: <ContainerOutlined className='context-menu-button-icon' />, visible: printButton }}
            />

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default ObjectViewPage