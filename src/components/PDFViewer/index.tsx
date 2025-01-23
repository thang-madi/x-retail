
import React, { useEffect, useState } from 'react'

import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin, SidebarTab, ToolbarProps, ToolbarSlot } from '@react-pdf-viewer/default-layout'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { isAndroid, isIOS } from '../../commons/telegram'

import './index.css'

interface PDFViewerProps {
    fileUrl: string
}

export interface printFormParams {
    id: string
    dataType: string
    templateName: string
}

export interface printFormParams {
    id: string
    dataType: string
    templateName: string
}

export interface reportParams {
    id: string
    paramsJSON: string
}

export const printFormURL = (params: printFormParams): string => {

    const URL = process.env.REACT_APP_URL_FILES as string
    return `${URL}/${params.id}.pdf?print-form-id=${params.id}&data-type=${params.dataType}&template-name=${params.templateName}`
}

export const reportURL = (params: reportParams): string => {

    const URL = process.env.REACT_APP_URL_FILES as string
    return `${URL}/${params.id}.pdf?report-id=${params.id}&report-params=${params.paramsJSON}`
}

const PDFViewer: React.FC<PDFViewerProps> = (props: PDFViewerProps) => {

    // const defaultLayoutPluginInstance = defaultLayoutPlugin()
    const renderToolbar = (Toolbar: (props: ToolbarProps) => React.ReactElement) => (
        <Toolbar>
            {(slots: ToolbarSlot) => {
                const {
                    // CurrentPageInput,
                    Download,
                    // EnterFullScreen,
                    // GoToNextPage,
                    // GoToPreviousPage,
                    // NumberOfPages,
                    Print,
                    // ShowSearchPopover,
                    Zoom,
                    ZoomIn,
                    ZoomOut,
                } = slots
                return (
                    <div className='toolbar'>
                        <div className='toolbar-button'>
                            <Download />
                        </div>
                        {/* <div className='toolbar-button'>
                            <ShowSearchPopover />
                        </div> */}
                        <div className='toolbar-button'>
                            <ZoomOut />
                        </div>
                        <div className='toolbar-button'>
                            <Zoom />
                        </div>
                        <div className='toolbar-button'>
                            <ZoomIn />
                        </div>
                        {/* <div className='toolbar-button'>
                            <GoToPreviousPage />
                        </div> */}
                        {/* <div className='toolbar-button'>
                            <CurrentPageInput /> / <NumberOfPages />
                        </div> */}
                        {/* <div className='toolbar-button'>
                            <GoToNextPage />
                        </div> */}
                        {/* <div className='toolbar-button'>
                            <EnterFullScreen />
                        </div> */}
                        <div className={(isIOS() || isAndroid()) && 'toolbar-button-hidden' || 'toolbar-button'}>
                            <Print />
                        </div>
                    </div>
                )
            }}
        </Toolbar>
    )

    const sidebarTabs = (defaultTabs: SidebarTab[]) => [];

    const defaultLayoutPluginInstance = defaultLayoutPlugin({ renderToolbar, sidebarTabs });


    return (
        <Worker workerUrl='https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.js' >
            <div
                style={{
                    height: '100%',
                    // width: '100%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
            >
                <Viewer
                    // fileUrl={`${process.env.PUBLIC_URL}/pdf-open-parameters.pdf`}
                    fileUrl={props.fileUrl}
                    plugins={[defaultLayoutPluginInstance]}
                    theme='dark'
                    defaultScale={1.0}
                />
            </div>
        </Worker >
    )
}

const PDFViewer_Object: React.FC<PDFViewerProps> = (props: PDFViewerProps) => {

    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    useEffect(() => {
        const url = props.fileUrl
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const pdfUrl = URL.createObjectURL(blob)
                setPdfUrl(pdfUrl);
            })
            .catch((error) => {
                console.error('Error fetching PDF:', error)
            });

        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl)
            }
        }
    }, [pdfUrl])

    return (
        <div>
            {pdfUrl ? (
                <object
                    data={pdfUrl}
                    type='application/pdf'
                    width='100%'
                    height='750px'
                >
                    <p>Trình duyệt của bạn không hỗ trợ nhúng file PDF. Bạn có thể tải về <a href={props.fileUrl}>tại đây</a>.</p>
                </object>
            ) : (<p>Đang tải PDF...</p>)}
        </div>
    )
}

const PDFViewer_iFrame: React.FC<PDFViewerProps> = (props) => (
    <div style={{ height: '100%' }} >
        <iframe
            src={props.fileUrl}
            width='100%'
            height='99%'
            style={{
                border: 'none'
            }}
            title='PDF Document'
        >
            Trình duyệt của bạn không hỗ trợ iframe.
        </iframe>
    </div >
)

export { PDFViewer }
