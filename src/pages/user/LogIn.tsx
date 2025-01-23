/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Space, Card, Select, Typography } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

/////////////////////////////////////////////
// Application's

// import { apiRequest, actions, } from '../../data-storage/slice-session'
import { getLocalDeviceId, getLocalUserToken } from '../../commons/users'
// import { createXTSObject } from '../../data-exchange/objects'
// import { generateUUID } from '../../commons/common-use'
// import { connectParams } from '../../commons/connect-params'
// import { DEBUG } from '../../commons/constants'

/////////////////////////////////////////////
// Object's

// import signInResponse from '../../data-mock/sign-in.json'
import Password from 'antd/es/input/Password'
// import { createRequestDataByDataItem } from '../../data-exchange/common-use'
import { IdcardOutlined, KeyOutlined, PhoneOutlined } from '@ant-design/icons'
import { RootState } from '../../data-storage'
import { requestData_ByDataItem } from '../../data-objects/request-data'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { Loader } from '../../components/Loader'
// import useToken from 'antd/es/theme/useToken'



/////////////////////////////////////////////
// Main component

function LoginPage() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const [loading, setLoading] = useState(true)

    const deviceId = getLocalDeviceId()
    // const userToken = getLocalUserToken()

    // Sau khi đăng nhập thành công thì chuyển đến trang trước
    const { path } = location?.state || { path: '/home' }
    const _userToken = useSelector((state: RootState) => state.session.userToken)
    useEffect(() => {
        if (_userToken) {
            navigate(path, { replace: true })
        }
        setLoading(false)
    }, [_userToken])

    // const externalAccountId = useSelector((state: RootState) => state.session.externalAccountId) || null
    // const telegramId = useSelector(state => state.session.telegramId) || null
    const TWA = (window as any).Telegram.WebApp
    const telegramId = TWA.initDataUnsafe.user?.id || ''
    const zaloId = null

    const checkSignIn = (dataItem: { [key: string]: any }) => {
        const requestData = requestData_ByDataItem('XTSSignInRequest', dataItem)
        const { apiRequest, actions } = getXTSSlice('XTSSession')

        dispatch(actions.setTemp(null))
        dispatch(apiRequest(requestData))
    }

    // Hàm xử lý đăng nhập
    const onFinish = ((values: any) => {
        // const userName = (activeKey === 'byAccount') && values.userName || ''
        // const password = (activeKey === 'byAccount') && values.password || ''
        const phone = values.phone
        const otp = values.otp
        const userToken = getLocalUserToken()

        // const dataItems = { deviceId, userName, password, telegramId, zaloId, phone, otp, userToken }
        // console.log('SignIn', dataItems)
        const dataItem = { deviceId, telegramId, zaloId, phone, otp, userToken }

        checkSignIn(dataItem)
    })

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    }

    // const cancel = () => {

    // }

    const selectBefore = (
        <Select defaultValue='+84'>
            <Select.Option value='84'>+84</Select.Option>
            {/* <Select.Option value='00'>+00</Select.Option> */}
        </Select>
    )

    const [inputOTP, setInputOTP] = useState(false)

    const externalAccount = useSelector((state: RootState) => state.session.externalAccount)
    const userToken = useSelector((state: RootState) => state.session.userToken)

    useEffect(() => {
        if ((externalAccount) && (userToken)) {
            // console.log('externalAccount 1', externalAccount)
            // console.log('useToken', userToken)
            // setTabItems(_tabItems(false, userToken))
            // setActiveKey('byAccount')
        } else if (externalAccount) {
            // console.log('externalAccount 2', externalAccount)
            // console.log('useToken', userToken)

            setInputOTP(true)
            // setTabItems(_tabItems(inputOTP, userToken))
        }
        // if (externalAccount) {
        //     setInputOTP(true)
        //     console.log('inputOTP', inputOTP)
        // }
    }, [externalAccount, userToken])

    const { Title } = Typography

    return (
        <div >
            <Loader isLoading={loading} />

            <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout='vertical'
                // align='center'
                className={(loading) && 'hidden' || ''}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <Space direction='vertical' align='center' style={{ marginTop: '30px' }}>

                    <Card >
                        <Title level={5}>
                            Đăng nhập theo điện thoại
                        </Title>

                        <Space direction='vertical'>

                            <Form.Item
                                initialValue=''
                                className={(inputOTP) && 'hidden' || ''}
                                style={{ width: '210px' }}
                                label='Điện thoại'
                                name='phone'
                                rules={[
                                    { pattern: /^[0-9]{10}$/, message: 'Vui lòng nhập 10 chữ số !' }
                                ]}
                            >
                                <Input
                                    addonBefore={selectBefore}
                                    placeholder='Nhập số điện thoại'
                                    required={false}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                className={(inputOTP) && 'hidden' || ''}
                            >
                                <Button
                                    block
                                    type='primary'
                                    htmlType='submit'
                                >
                                    Nhận mã OTP
                                </Button>
                            </Form.Item>

                            <Form.Item
                                initialValue=''
                                className={(!inputOTP) && 'hidden' || ''}
                                style={{ width: '210px' }}
                                label='Mã OTP'
                                name='otp'
                            >
                                <Input.OTP length={4} />
                            </Form.Item>

                            <Form.Item
                                className={(!inputOTP) && 'hidden' || ''}
                            >
                                <Button
                                    block
                                    type='primary'
                                    htmlType='submit'
                                >
                                    Đăng nhập
                                </Button>
                            </Form.Item>

                        </Space>

                    </Card >
                </Space>
            </Form>

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default LoginPage