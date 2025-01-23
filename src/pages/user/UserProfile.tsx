/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams, useLocation, useBlocker } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, Button, Space, FloatButton, Modal, Card } from 'antd'
import { ApiOutlined, CheckCircleOutlined, CloseCircleOutlined, SaveOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Application's

// import ChoicePage from '../../hocs/choice-page'
// import BackButton from '../../components/back'
import { useChoicePage, useOpenPage, useSaveFormData, useStepBack } from '../../hooks/usePage'
// import { newItemValue, formDataToItemValue, createRequestDataToSaveFormValues, xtsObjectToFormData, createRequestDataByDataItem } from '../../data-exchange/common-use'
import { generateUUID } from '../../commons/common-use'
// import { createXTSObject } from '../../data-exchange/objects'
// import { FormInput } from '../../components/form-items'

/////////////////////////////////////////////
// Object's

// import { apiRequest, actions } from '../../data-storage/slice-session'          // session

// import IndividualViewPage from '../individual/individual-view'                  // individual
// import IndividualEditPage from '../individual/individual-edit'                  // individual
import CustomerViewPage from '../customer/ObjectView'                        // customer
import CustomerEditPage from '../customer/ObjectEdit'                        // customer
import { createXTSObject } from '../../data-objects/common-use'
import { RootState } from '../../data-storage'
import { requestData_ByDataItem } from '../../data-objects/request-data'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { ITEM_VALUE_ACTIONS } from '../../data-objects/types-components'
import { XTSItemValue } from '../../data-objects/types-form'
import { REQUEST_STATUSES } from '../../commons/enums'
// import { FOOTER_HEIGHT } from '../../commons/constants'

import './index.css'

/////////////////////////////////////////////
// Main component

const UserProfilePage: React.FC<any> = (props) => {

    /////////////////////////////////////////////
    // Các useHook chuẩn

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // stepBack
    // Hàm sự kiện khi bấm nút Cancel trên Form    
    const stepBack = () => {
        const newItemValue = createItemValue()
        if (itemValue.id && itemValue.action === ITEM_VALUE_ACTIONS.EDIT) {
            newItemValue.action = ITEM_VALUE_ACTIONS.VIEW
            setItemValue(newItemValue)
        } else if (user) {
            navigate('/home')
        } else {
            navigate('/about')
        }
    }

    const choiceItemValue = (value: XTSItemValue): void => {

        console.log('choiceItemValue.value', value)
        if (itemValue.action === ITEM_VALUE_ACTIONS.VIEW) {
            setItemValue(value)
        } else if (itemValue.action === ITEM_VALUE_ACTIONS.EDIT) {
            setItemValue(value)
        }
    }

    const gotoConnectUser = () => {
        navigate('/connect-user',)
    }

    const [pageId] = useState(generateUUID())
    const { setPageBackAction } = useStepBack({ pageId, stepBack })

    const { user, externalAccount, userProfile, userName, deviceId, status, tempData } = useSelector((state: RootState) => state.session)
    const dataType = 'XTSCounterparty'
    // const action = (!userProfile) && ITEM_VALUE_ACTIONS.EDIT || ITEM_VALUE_ACTIONS.VIEW
    // const id =userProfile?.id

    const createItemValue = (): XTSItemValue => {
        const result = createXTSObject('XTSItemValue', userProfile)
        if (!userProfile) {
            result.dataType = dataType
        }
        return result
    }
    const [itemValue, setItemValue] = useState(createXTSObject('XTSItemValue',
        {
            dataType,
            id: userProfile?.id,
            action: (!userProfile) && ITEM_VALUE_ACTIONS.EDIT || ITEM_VALUE_ACTIONS.VIEW
        }
    ))

    const afterSave = (objectId: string) => {
        if (externalAccount) {
            const requestData = requestData_ByDataItem('XTSConnectUserRequest', { externalAccount, customer: objectId })
            const { apiRequest, actions } = getXTSSlice('XTSSession')

            dispatch(actions.setTemp(null))
            dispatch(apiRequest(requestData))
            console.log('afterSave.requestData', requestData)
        }
    }

    /////////////////////////////////////////////
    // 

    const unlinkUser = () => {
        if (user) {
            const dataItem = { deviceId, externalAccount, user: user }
            const requestData = requestData_ByDataItem('XTSSignOutRequest', dataItem)
            const { apiRequest, actions } = getXTSSlice('XTSSession')

            dispatch(actions.setTemp(null))
            dispatch(apiRequest(requestData))
            // console.log('requestData', requestData)
        } else {
            console.log('User is not linked!')
        }
    }

    useEffect(() => {
        if (status === REQUEST_STATUSES.SUCCEEDED && tempData._type === 'XTSSignOutResponse') {
            const { actions } = getXTSSlice('XTSSession')
            dispatch(actions.setStatus(REQUEST_STATUSES.IDLE))
        }
    }, [status, tempData])

    /////////////////////////////////////////////
    // 

    switch (itemValue.action) {
        case ITEM_VALUE_ACTIONS.EDIT:
            return (
                <div className='user-profile-edit'>
                    <CustomerEditPage
                        pageId={pageId}
                        itemValue={itemValue}
                        itemName={props.itemName}
                        choiceItemValue={choiceItemValue}
                        stepBack={stepBack}
                        additionals={{ isUserProfile: true }}
                        afterSave={afterSave}
                    />
                </div >
            )
        case ITEM_VALUE_ACTIONS.VIEW:
            return (
                <div className='user-profile-view'>
                    <CustomerViewPage
                        pageId={pageId}
                        itemValue={itemValue}
                        // itemName={props.itemName}
                        itemName=''
                        choiceItemValue={choiceItemValue}
                        stepBack={stepBack}
                    />

                    <Card className={(user) && 'user-profile-connected' || 'user-profile-not-connected'}>
                        <div>Bạn đã liên kết với người dùng trên hệ thống.</div>
                        <div>Tên người dùng: {userName}</div>

                        <Space>
                            <div>Bạn có thể hủy liên kết ở đây:</div>
                            <Button
                                icon={<ApiOutlined />}
                                onClick={unlinkUser}
                            />
                        </Space>
                    </Card>

                    <div className='user-profile-connect-user'
                    >
                        <Button
                            className={(user) && 'user-profile-connect-user-button-hidden' || 'user-profile-connect-user-button'}
                            htmlType='button'
                            onClick={gotoConnectUser}
                            icon={<ApiOutlined />}
                        >
                            Kết nối người dùng
                        </Button>

                    </div>

                </div >
            )
        default:
            return (
                <div>
                    Something is wrong, pls contact administrator
                    {itemValue.action}
                </div>
            )
    }

}

/////////////////////////////////////////////
// Export's

export default UserProfilePage