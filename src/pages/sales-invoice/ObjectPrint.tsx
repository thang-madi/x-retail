/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Card, Descriptions, Divider, FloatButton, List, Modal, notification, Space } from 'antd'
import { ArrowLeftOutlined, CheckCircleOutlined, CheckOutlined, ContainerOutlined, CopyOutlined, DeleteOutlined, DollarCircleOutlined, EditOutlined, ReloadOutlined, SelectOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'


/////////////////////////////////////////////
// Application's

import { useGetDataObject, UseGetDataObjectParams, useOpenPage, UseOpenPageParams } from '../../hooks/usePage'
import { BottomBar, } from '../../components/ContextMenu'

/////////////////////////////////////////////
// Object's

import { apiRequest, actions } from '../../data-storage/slice-sales-invoice'                   // 
// import { OrderProductRowView } from './ObjectInventory'
// import PaymentEditPage from './PaymentEdit'
import { ITEM_VALUE_ACTIONS, XTSObjectPrintProps, XTSObjectViewProps } from '../../data-objects/types-components'
import { createXTSObject } from '../../data-objects/common-use'
import { RootState } from '../../data-storage'
import { XTSItemValue } from '../../data-objects/types-form'
import { REQUEST_STATUSES } from '../../commons/enums'
import { Loader } from '../../components/Loader'

import { downloadFile } from '../../commons/common-print'
import { PDFViewer, printFormURL } from '../../components/PDFViewer'
import { dataType } from './'

import './index.css'

/////////////////////////////////////////////
// Main component

const ObjectPrintPage: React.FC<XTSObjectPrintProps> = (props) => {

    const { objectId, pageId } = props

    const openPageParams: UseOpenPageParams = {
        pageId: '',
        pageName: dataType,
        pageTitle: 'In đối tượng',
        // renderKey: 0,
    }
    useOpenPage(openPageParams)

    /////////////////////////////////////////
    // Print 

    const printFormParams = {
        dataType: objectId.dataType,
        id: objectId.id,
        templateName: 'ExternalPrintForm.PF_SalesInvoice',
    }
    const url = printFormURL(printFormParams)
    // console.log('printFormURL', url)

    // useEffect(() => {
    //     if (url && TWA.platform !== 'desktop' && TWA.platform !== 'tdesktop' && TWA.platform !== 'unknown') {
    //         // console.log('TWA.platform', TWA.platform)
    //         TWA.openLink(url)
    //     }
    // }, [url])

    /////////////////////////////////////////
    // 

    return (
        <div className='sales-invoice-print'>
            <PDFViewer fileUrl={url} />
        </div>
    )
}

/////////////////////////////////////////////
// Export's

export default ObjectPrintPage