
/////////////////////////////////////////////
// Standard's

import { useEffect, useRef, useState } from 'react'
import { Form, Input, InputNumber, Button, Modal, Flex, Switch, DatePicker, Select, Upload, Space } from 'antd'
import { CheckCircleOutlined, RetweetOutlined, UploadOutlined } from '@ant-design/icons'
import Webcam from 'react-webcam'

/////////////////////////////////////////////
// Application's

/////////////////////////////////////////////
// Object's

import './index.css'

/////////////////////////////////////////////
// Main

export interface XTSAppWebcamProps {
    modalProps: any
    webcamProps: any
    setPicture: any
    setWebcamOpen: any
}

const AppWebcam: React.FC<XTSAppWebcamProps> = (props) => {

    const { modalProps = {}, webcamProps = {}, setPicture, setWebcamOpen } = props
    const webcamRef = useRef<Webcam>(null)

    const videoConstraintsSet = [
        {
            // width: 1280,
            // height: 720,
            facingMode: 'user'      // environment
        },
        {
            // width: 1280,
            // height: 720,
            facingMode: 'environment'
        }
    ]

    const [videoConstraints, setVideoConstraints] = useState(videoConstraintsSet[1])

    const handleCapture = () => {
        const imageSrc = webcamRef.current?.getScreenshot()
        setPicture(imageSrc)
        setWebcamOpen(false)
        // console.log('imageSrc', imageSrc)
    }

    const handleReturn = () => {
        if (videoConstraintsSet[0].facingMode === videoConstraints.facingMode) {
            setVideoConstraints(videoConstraintsSet[1])
        } else {
            setVideoConstraints(videoConstraintsSet[0])
        }
        // console.log('handleReturn')
    }

    return (
        <Modal
            {...modalProps}
            onCancel={() => setWebcamOpen(false)}
        >
            <Webcam
                {...webcamProps}
                audio={false}
                ref={webcamRef}
                // mirrored={mirror}
                videoConstraints={videoConstraints}
                screenshotFormat="image/jpeg"
                width='100%'
            />

            <div className='webcam-button-group'>
                <Button
                    className='webcam-capture-button'
                    onClick={handleCapture}
                    icon={<CheckCircleOutlined />}
                >
                    Chụp
                </Button>
                <Button
                    className='webcam-reweet-button'
                    onClick={handleReturn}
                    icon={<RetweetOutlined />}
                />
            </div>

        </Modal>
    )
}


/////////////////////////////////////////////
// Export's

export { AppWebcam }
