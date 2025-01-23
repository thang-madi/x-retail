/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Card, Descriptions, Divider, Drawer, FloatButton, List, Modal, notification, Space } from 'antd'
import { ArrowLeftOutlined, CheckCircleOutlined, CheckOutlined, ContainerOutlined, CopyOutlined, DeleteOutlined, DollarCircleOutlined, EditOutlined, FileTextOutlined, ReloadOutlined, RotateLeftOutlined, SelectOutlined, ShoppingCartOutlined, TruckOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'


/////////////////////////////////////////////
// Application's

import { useGetDataObject, UseGetDataObjectParams, useOpenPage, UseOpenPageParams, useStepBack } from '../../hooks/usePage'
import { BottomBar, ContextMenuButton, } from '../../components/ContextMenu'

/////////////////////////////////////////////
// Object's

import { createXTSObject, objectPresentation } from '../../data-objects/common-use'
import { RootState } from '../../data-storage'
import { XTSItemValue } from '../../data-objects/types-form'
import { REQUEST_STATUSES } from '../../commons/enums'
import { Loader } from '../../components/Loader'

import './index.css'
import { downloadFile } from '../../commons/common-print'
import { PDFViewer, printFormURL } from '../../components/PDFViewer'
import { ITEM_VALUE_ACTIONS } from '../../data-objects/types-components'
import { generateUUID } from '../../commons/common-use'
import { XTSObject, XTSObjectId } from '../../data-objects/types-common'
import { useGetRelatedDocuments, UseGetRelatedDocumentsParams } from '../../hooks/useRelatedDocuments'
import { XTSOrder, XTSRelatedDocument, XTSSupplierInvoice } from '../../data-objects/types-application'

/////////////////////////////////////////////
// Main component

interface XTSRelatedListPageProps {
    pageId: string
    objectId: XTSObjectId
    dataObject?: XTSObject
    title: string
    pageName: string
    renderKey: number
    // commands: ContextMenuButton[]
    choiceItemValue: (itemValue: XTSItemValue) => void
    stepBack: () => void
}

const RelatedListPage: React.FC<XTSRelatedListPageProps> = (props) => {

    const { renderKey } = props

    const choiceItemValue = (item: any) => {
        const itemValue = createXTSObject('XTSItemValue', item.document)
        itemValue.action = ITEM_VALUE_ACTIONS.VIEW
        props.choiceItemValue(itemValue)
    }

    const openPageParams: UseOpenPageParams = {
        pageId: props.pageId,
        pageName: props.pageName,
        pageTitle: props.title,
        renderKey: renderKey
    }
    useOpenPage(openPageParams)

    /////////////////////////////////////////
    // 

    const [isSalesOrder, setIsSalesOrder] = useState(props.objectId.dataType === 'XTSOrder')
    const [isSupplierInvoice, setIsSupplierInvoice] = useState(props.objectId.dataType === 'XTSSupplierInvoice')

    /////////////////////////////////////////
    // 

    const getRelatedDocumentsParams: UseGetRelatedDocumentsParams = {
        objectId: props.objectId,
    }

    /////////////////////////////////////////
    // 

    const { salesReturnOperationKind } = useSelector((state: RootState) => state.session.defaultValues as any)

    const createSalesInvoice = () => {
        // console.log('props', props)
        const itemValue = createXTSObject('XTSItemValue')
        itemValue.dataType = 'XTSSalesInvoice'
        itemValue.action = ITEM_VALUE_ACTIONS.EDIT

        const dataObject = props.dataObject as XTSOrder
        itemValue.dataItem = {
            company: dataObject?.company,
            counterparty: dataObject?.customer,
            docOrder: dataObject?.objectId,
        }
        props.choiceItemValue(itemValue)
    }

    const createSalesReturn = () => {
        const itemValue = createXTSObject('XTSItemValue')
        itemValue.dataType = 'XTSSupplierInvoice'
        itemValue.action = ITEM_VALUE_ACTIONS.EDIT

        const dataObject = props.dataObject as XTSOrder
        itemValue.dataItem = {
            company: dataObject?.company,
            counterparty: dataObject?.customer,
            docOrder: dataObject?.objectId,
            operationKind: salesReturnOperationKind,
        }
        props.choiceItemValue(itemValue)
    }

    const createSetPrice = () => {

    }

    /////////////////////////////////////////
    // 

    const { relatedDocuments, status, refreshList } = useGetRelatedDocuments(getRelatedDocumentsParams)
    return (

        <div className='related-modal-page'>
            <List
                className='related-modal-page-list'
                dataSource={relatedDocuments}
                renderItem={(item: XTSRelatedDocument) => (
                    <List.Item
                        className='related-modal-page-list-item'
                        onClick={() => choiceItemValue(item)}
                    >
                        <List.Item.Meta
                            avatar={<FileTextOutlined />}
                            // title={item.document?.presentation
                            //     .replace('Phiếu thu', 'Thu tiền mặt số')
                            //     .replace('Phiếu chi', 'Chi tiền mặt số')
                            //     .replace('Thu tiền vào tài khoản', 'Thu chuyển khoản số')
                            //     .replace('Chi tiền từ tài khoản', 'Chi chuyển khoản số')
                            //     .replace('Hóa đơn giao hàng', 'Giao hàng số')
                            //     .replace('Hóa đơn nhận hàng', 'Nhận hàng số')
                            // }
                            title={objectPresentation(item.document, item.operationKind)}
                        />
                        <div>
                            {item.documentAmount} {item.documentCurrency?.presentation}
                        </div>
                    </List.Item>
                )}
            />
            <div className='related-modal-page-empty-row'>

            </div>
            <BottomBar
                stepBack={{ onClick: props.stepBack }}
                action1={{ onClick: createSalesInvoice, title: 'Giao thêm', icon: <TruckOutlined className='context-menu-button-icon' />, visible: isSalesOrder }}
                action2={{ onClick: createSalesReturn, title: 'Trả hàng', icon: <RotateLeftOutlined className='context-menu-button-icon' />, visible: isSalesOrder }}
                action3={{ onClick: createSetPrice, title: 'Đặt giá', icon: <RotateLeftOutlined className='context-menu-button-icon' />, visible: isSupplierInvoice }}
                refresh={{ onClick: refreshList }}
            />

        </div >

    )
}

/////////////////////////////////////////////
// Export's

export default RelatedListPage