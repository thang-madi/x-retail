
/////////////////////////////////////////////
// Standard's

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Drawer, Spin } from 'antd'
import { CloseOutlined, MenuOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Application's

import AppMenu from '../AppMenu'
import { PAGE_ACTIONS, REQUEST_STATUSES } from '../../commons/enums'
// import { HEADER_BACKGROUND_COLOR, MENU_BACKGROUND_COLOR, HEADER_HEIGHT } from '../../commons/constants'
import { actions } from '../../data-storage/slice-current'
import { getLocalDeviceId, getLocalUserToken } from '../../commons/users'
import { RootState } from '../../data-storage'
import { requestData_ByDataItem, requestData_DownloadObjectList, requestData_GetObjectList } from '../../data-objects/request-data'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { isAndroid, isFullscreenAndroid, isFullscreenIOS, isFullscreenTDesktop, isFullsize, isIOS, isTDesktop, telegramSettings, TWA } from '../../commons/telegram'

/////////////////////////////////////////////
// Object's

import './index.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader } from '../Loader'

/////////////////////////////////////////////
// Begin

const AppHeader: React.FC = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    /////////////////////////////////////////
    // Menu

    const { pageName } = useSelector((state: RootState) => state.currentData)

    const pagesWithMenu = ['Home', 'About', 'Landing']

    const [menuOpen, setMenuOpen] = useState(false)
    const closeMenu = () => {
        setMenuOpen(false)
    }
    const openMenu = () => {
        setMenuOpen(true)
    }

    const [menuVisible, setMenuVisible] = useState(false)
    useEffect(() => {
        if (pagesWithMenu.includes(pageName)) {
            setMenuVisible(true)
        } else {
            setMenuVisible(false)
        }
    }, [pageName])

    /////////////////////////////////////////
    // Telegram

    const handleClickBackButton = (): void => {
        setMenuOpen(false)
        dispatch(actions.setParams({ pageAction: PAGE_ACTIONS.BACK }))
    }

    useEffect(() => {
        telegramSettings(handleClickBackButton)
    }, [])

    // console.log('navigator.platform', navigator.platform)
    // console.log('TWA.platform', TWA.platform)

    /////////////////////////////////////////
    // Signin

    const [loading, setLoading] = useState(true)

    const deviceId = getLocalDeviceId()
    const userToken = getLocalUserToken()
    const location = useLocation()

    // console.log('deviceId', deviceId)
    // console.log('userToken', userToken)

    const checkSignIn = (dataItem: { [key: string]: any }) => {
        const requestData = requestData_ByDataItem('XTSSignInRequest', dataItem)
        const { apiRequest, actions } = getXTSSlice('XTSSession')

        dispatch(actions.setTemp(null))
        dispatch(apiRequest(requestData))
    }

    const _userToken = useSelector((state: RootState) => state.session.userToken)
    useEffect(() => {
        setLoading(false)
    }, [_userToken])

    // Thực hiện đăng nhập khi mới mở
    useEffect(() => {
        if (location.pathname === '/view') {
            return
        }

        const telegramId = TWA.initDataUnsafe.user?.id || ''
        const zaloId = null
        const navigatorData = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
        }
        const deviceInfo = JSON.stringify(navigatorData)
        // console.log('deviceInfo', deviceInfo)
        checkSignIn({ deviceId, telegramId, zaloId, userToken, deviceInfo })
    }, [])

    const { status, tempData } = useSelector((state: any) => state.session)
    useEffect(() => {
        const responseTypes = ['XTSSignInResponse']

        if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.includes(tempData['_type'])) {
            const { apiRequest, actions } = getXTSSlice('XTSSession')
            dispatch(actions.setStatus(REQUEST_STATUSES.IDLE))
            if (tempData.user) {
                navigate('/home')
            }
        }
    }, [status, tempData])

    /////////////////////////////////////////
    // 

    return (
        <div className={`app-header${(isFullscreenTDesktop()) && ' app-header-desktop' || ''}${(isFullscreenAndroid() || isFullscreenIOS()) && ' app-header-mobile' || ''}`}>

            <Loader isLoading={loading} spinProps={{ fullscreen: false }} />

            <Button
                className={'app-header-menu-icon' + (menuVisible && ' ' || ' app-header-menu-icon-hidden') + (TWA.isFullscreen && ' app-header-menu-icon-fullscreen' || '')}
                onClick={openMenu}
                icon={<MenuOutlined className='app-header-menu-icon-image' />}
            />

            <Drawer
                className='app-header-menu-drop'
                placement='right'
                width={270}
                open={menuOpen}
                closable={false}
                onClose={closeMenu}
                closeIcon={<CloseOutlined />}
            >
                <AppMenu
                    closeMenu={closeMenu}
                />
            </Drawer>
        </div >
    )
}

export default AppHeader