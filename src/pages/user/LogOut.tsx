/////////////////////////////////////////////
// Standard's

import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Space, Card } from 'antd'

/////////////////////////////////////////////
// Application's

import { apiRequest, actions } from '../../data-storage/slice-session'
// import { createRequestDataByDataItem } from '../../data-exchange/common-use'
import { useEffect } from 'react'
// import { setLoading } from '../../data-storage/slice-common'
import { getLocalDeviceId } from '../../commons/users'
import { requestData_ByDataItem } from '../../data-objects/request-data'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { RootState } from '../../data-storage'

/////////////////////////////////////////////
// Main component

function LogoutPage() {

    // const { signOut } = useSessionParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // const userToken = useSelector(state => state.session.userToken)
    // useEffect(() => {
    //     if (!userToken) {
    //         navigate('/', { replace: true })
    //     }
    //     setLoading(false)
    // }, [userToken])

    const { externalAccount, deviceId } = useSelector((state: RootState) => state.session)

    const checkSignOut = () => {
        const dataItem = { deviceId, externalAccount, user: null }
        const requestData = requestData_ByDataItem('XTSSignOutRequest', dataItem)
        const { apiRequest, actions } = getXTSSlice('XTSSession')

        dispatch(actions.setTemp(null))
        dispatch(apiRequest(requestData))
    }

    // Hàm xử lý đăng xuất
    const onFinish = () => {
        checkSignOut()
    }

    const onCancel = (e: any) => {
        navigate(-1)
    }

    return (
        <div>
            <p>Logout page</p>
            <Form
                onFinish={onFinish}
                layout='vertical'
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <Card>
                    <Space direction='vertical'>
                        'Bạn thực sự muốn Log-out?'
                        <Space align='center'>
                            <Form.Item>
                                <Button block type='primary' htmlType='submit' >Đồng ý</Button>
                            </Form.Item>
                            <Form.Item>
                                <Button block htmlType='button' onClick={onCancel}>Không</Button>
                            </Form.Item>
                        </Space>
                    </Space>
                </Card>
            </Form>
        </div>
    )
}

/////////////////////////////////////////////
// Export's

export default LogoutPage