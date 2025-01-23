/////////////////////////////////////////////
// Standard's

import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Form, Input, InputNumber, Button, Modal, Flex, Switch, DatePicker, Select, Upload, Avatar, Space } from 'antd'
import { CameraOutlined, UploadOutlined } from '@ant-design/icons'


/////////////////////////////////////////////
// Application's

// import { AppWebcam } from './webcam'
// import { XTSMediaItem } from '../data-objects/types-components'
import type { RcFile } from 'antd/lib/upload/interface'
import { AppWebcam } from '../Webcam'
import { RootState } from '../../data-storage'
import { XTSMediaItem } from '../../data-objects/types-components'
import { createXTSMediaItem } from '../../data-objects/common-use'

/////////////////////////////////////////////
// Object's

import './index.css'

/////////////////////////////////////////////
// Main component

export interface XTSAppAvatarProps {
    dataType: string
    currentAvatar: XTSMediaItem
    newAvatar?: XTSMediaItem | undefined
    setNewAvatar?: any
}

// 
export const AppAvatar: React.FC<XTSAppAvatarProps> = (props) => {

    const { dataType, currentAvatar, newAvatar, setNewAvatar } = props
    const [avatar, setAvatar] = useState(createXTSMediaItem(undefined))
    const fileStorageURL = useSelector((state: RootState) => state.session.fileStorageURL)

    useEffect(() => {
        const tempAvatar = createXTSMediaItem(undefined)
        if (newAvatar?.imageSrc) {
            tempAvatar.imageSrc = newAvatar.imageSrc
        } else {
            tempAvatar.imageSrc = fileStorageURL + currentAvatar?.presentation
        }
        setAvatar(tempAvatar)
    }, [currentAvatar, newAvatar])

    /////////////////////////////////////////////
    // Choice picture

    const beforeUpload = (file: RcFile) => {
        const reader = new FileReader()
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (setNewAvatar) {
                const tempAvatar = createXTSMediaItem(undefined)
                tempAvatar.imageSrc = e.target?.result as string
                // tempAvatar.dataType = dataType
                setNewAvatar(tempAvatar)
            }
            // console.log('tempAvatar 2', tempAvatar)
        }
        reader.readAsDataURL(file)
        // console.log('beforeUpload.file', file)
        return false
    }

    /////////////////////////////////////////////
    // Webcam

    const [webcamOpen, setWebcamOpen] = useState(false)

    const captureImage = (file: RcFile) => {
        // const imageSrc = webcamRef.current.getScreenshot()
        setNewAvatar({ id: null, dataType, imageSrc: file })
        // setWebcamOpen(false)
        console.log('captureImage.file', file)
    }

    /////////////////////////////////////////////
    // 

    return (
        <div className='avatar-group' >
            <Avatar
                className='avatar'
                size={200}
                src={avatar?.imageSrc}
            />

            <Space
                className='avatar-button-group'
                style={{ display: (newAvatar) && 'flex' || 'none' }}>
                <Upload
                    className='avatar-button-upload'
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                >
                    <Button icon={<UploadOutlined />}>
                        Chọn
                    </Button>
                </Upload>
                <Button
                    className='avatar-button-capture'
                    // style={{ marginLeft: '10px' }}
                    icon={<CameraOutlined />}
                    onClick={() => setWebcamOpen(true)}
                >
                    Chụp
                </Button>
            </Space>

            <AppWebcam
                webcamProps={{}}
                modalProps={{
                    open: webcamOpen,
                    footer: null
                }}
                setPicture={captureImage}
                setWebcamOpen={setWebcamOpen}
            />

        </div>
    )
}

/////////////////////////////////////////////
// Export's

