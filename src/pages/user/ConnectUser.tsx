/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Space, Card, Select, Tabs, Typography } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
// import Password from 'antd/es/input/Password'
// import { IdcardOutlined, KeyOutlined, PhoneOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Application's

// import { apiRequest, actions, } from '../../data-storage/slice-session'
import { getLocalDeviceId, getLocalUserToken } from '../../commons/users'
import { Loader } from '../../components/Loader'
import { RootState } from '../../data-storage'
import { requestData_ByDataItem } from '../../data-objects/request-data'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import Password from 'antd/es/input/Password'

/////////////////////////////////////////////
// Object's




/////////////////////////////////////////////
// Main component

// OK
const ConnectPage: React.FC<any> = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const [loading, setLoading] = useState(true)

    const deviceId = getLocalDeviceId()
    // const userToken = getLocalUserToken()

    // Sau khi đăng nhập thành công thì chuyển đến trang Home
    const { path } = location?.state || { path: '/home' }
    const { user, telegramId, zaloId, phone } = useSelector((state: RootState) => state.session)
    useEffect(() => {
        if (user) {
            navigate(path, { replace: true })
        }
        setLoading(false)
    }, [user])

    // const externalAccountId = useSelector(state => state.session.externalAccountId) || null
    // const telegramId = useSelector(state => state.session.telegramId) || null
    // const TWA = window.Telegram.WebApp
    // const telegramId = TWA.initDataUnsafe.user?.id || ''
    // const zaloId = null

    // const telegramId = useSelector(state => state.session.telegramId)
    // const zaloId = useSelector(state => state.session.zaloId)
    // const phone = useSelector(state => state.session.phone)

    const checkSignIn = (dataItem: any) => {
        const requestData = requestData_ByDataItem('XTSSignInRequest', dataItem)
        const { sliceName, apiRequest, actions } = getXTSSlice('XTSSession')
        dispatch(actions.setTemp(null))
        dispatch(apiRequest(requestData))
    }

    // Hàm xử lý đăng nhập
    const onFinish = ((values: any) => {
        const userName = values.userName
        const password = values.password

        const dataItem = { deviceId, userName, password, telegramId, zaloId, phone }
        console.log('SignIn', dataItem)

        checkSignIn(dataItem)
    })

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    }

    const cancel = () => {
        navigate(-1)
    }

    return (
        <div className='user-connect-user'>

            <Typography.Title level={5} className='user-connect-user-title'>
                Kết nối người dùng nội bộ
            </Typography.Title>

            <Loader isLoading={loading} />

            <Card className='user-connect-user-card'>
                <Form
                    className={(loading) && 'hidden' || 'user-connect-user-form'}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    layout='vertical'
                >

                    <Form.Item
                        className='user-connect-user-form-item-input'
                        label='Tên đăng nhập'
                        name='userName'
                        initialValue={process.env.REACT_APP_DEFAULT_USER_NAME}
                    >
                        <Input
                            className='user-connect-user-form-item-input-value'
                            placeholder='Tên đăng nhập'
                            required={false}
                        />
                    </Form.Item>

                    <Form.Item
                        className='user-connect-user-form-item-input'
                        label='Mật khẩu'
                        name='password'
                        initialValue={process.env.REACT_APP_DEFAULT_USER_PASSWORD}
                    >
                        <Input.Password
                            className='user-connect-user-form-item-input-value'
                            placeholder='Password'
                        />
                    </Form.Item>

                    <div className='user-connect-user-button-group'>
                        <Form.Item>
                            <Button block type='primary' htmlType='submit'>Đăng nhập</Button>
                        </Form.Item>
                        <Button block type='default' onClick={cancel}>Hủy bỏ</Button>
                    </div>

                </Form>
            </Card>

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default ConnectPage