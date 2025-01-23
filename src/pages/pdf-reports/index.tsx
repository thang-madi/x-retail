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

import { useOpenPage, UseOpenPageParams, useStepBack } from '../../hooks/usePage'
import { PDFViewer, reportURL } from '../../components/PDFViewer'
import { BottomBar } from '../../components/ContextMenu'

/////////////////////////////////////////////
// Object's

import { XTSReportProps } from '../../data-objects/types-components'
import './index.css'
import { generateUUID } from '../../commons/common-use'

/////////////////////////////////////////////
// Main component

const PDFReport: React.FC<XTSReportProps> = (props) => {

    const navigate = useNavigate()

    const { reportTitle = 'Báo cáo' } = props

    const stepBack = () => {
        navigate('/home')
    }

    const [pageId] = useState(generateUUID())

    const openPageParams: UseOpenPageParams = {
        pageId,
        pageName: props.reportId,
        pageTitle: reportTitle,
    }
    useOpenPage(openPageParams)
    useStepBack({ pageId, stepBack })

    /////////////////////////////////////////
    // Report

    const reportParams = {
        id: props.reportId,
        paramsJSON: JSON.stringify(props.reportParams),
    }
    const url = reportURL(reportParams)
    console.log('reportURL', url)

    /////////////////////////////////////////
    // 

    return (
        <div className='report-page'>
            <PDFViewer fileUrl={url} />
            <BottomBar
                stepBack={{ onClick: stepBack }}
            />
        </div>
    )
}

/////////////////////////////////////////////
// Export's

export default PDFReport