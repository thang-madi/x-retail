/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Space, Image, Card } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { TWA } from '../../commons/telegram'

/////////////////////////////////////////////
// Application's

// import { apiRequest, setParams, setTemp, signIn } from '../data-storage/slice-session'
// import { getLocalDeviceId, getLocalUserToken } from '../commons/users'
// import { createXTSObject } from '../../data-exchange/objects'
// import { generateUUID } from '../../commons/common-use'
// import { connectParams } from '../../commons/connect-params'

/////////////////////////////////////////////
// Object's

import banner from '../../assets/dungbaby-banner.jpg'

import { useOpenPage, UseOpenPageParams } from '../../hooks/usePage'
import { generateUUID } from '../../commons/common-use'

import './index.css'
import { env } from 'process'

/////////////////////////////////////////////
// Main component

const LandingPage: React.FC<any> = (props) => {

    const location = useLocation()
    const navigate = useNavigate()

    const urlParams = new URLSearchParams(location.search)
    let startParam = urlParams.get('start_param')
    // let route = urlParams.get('route')
    // let id = urlParams.get('id')
    let route, id
    if (!startParam) {
        startParam = TWA.initDataUnsafe.start_param
    }
    if (startParam) {
        [route, id] = startParam.split('__')
    }

    if (route && id) {
        navigate(`/${route}?id=${id}`, { replace: true })
    }

    const devMode = (process.env.REACT_APP_MODE === 'Development') && 'Development mode' || ''

    const title1 = 'CHÀO MỪNG BẠN ĐẾN VỚI'
    const title2 = 'CỬA HÀNG'
    const storeName = 'DUNG-BABY'

    const footerTitle = 'CHUYÊN BÁN BUÔN - QUẦN ÁO TRẺ EM'
    const footerAddress = 'Địa chỉ: B5 Khu liên hợp Thể thao Ninh Hiệp - Gia Lâm - Hà Nội'
    const footerPhone = 'Zalo/Mob.: 0981.98.98.86 - 039.673.2222 - 0979.30.07.86'

    /////////////////////////////////////////////
    // OpenPage

    const [pageId] = useState(generateUUID())
    const openPageParams: UseOpenPageParams = {
        pageId,
        pageName: 'Landing',
        pageTitle: 'Landing'
    }
    useOpenPage(openPageParams)

    /////////////////////////////////////////////
    // Main component

    return (
        <div className='landing-page'>
            {/* {(route && id) && <Navigate to={`/${route}?id=${id}`} replace={true} />} */}
            <div className='landing-page-header-group'>
                {devMode}
            </div>
            <div className='landing-page-welcome-title-1'>
                {title1}
            </div>
            {/* <div className='landing-page-welcome-group'>
                <div className='landing-page-welcome-title-2'>
                    {title2}
                    </div>
                <div className='landing-page-welcome-store-name'>
                    {storeName}
                </div>
                </div>
                */}

            <div className='landing-page-banner'>
                <Image src={banner} preview={false} />
            </div>

            <div className='landing-page-footer-group'>
                <div className='landing-page-footer-title'>
                    {footerTitle}
                </div>
                <div className='landing-page-footer-address'>
                    {footerAddress}
                </div>
                <div className='landing-page-footer-phone'>
                    {footerPhone}
                </div>
            </div>
        </div>
    )
}

/////////////////////////////////////////////
// Export's

export default LandingPage