/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams, useLocation, useBlocker } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, Button, Space, FloatButton, Descriptions, Divider, InputNumber } from 'antd'
import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined, SaveOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Application's

// import ChoicePage from '../../hocs/choice-page'
import { useCreatePage, UseCreatePageParams, useGetDataObject, UseGetDataObjectParams, useOpenPage, UseOpenPageParams, useSaveFormData } from '../../hooks/usePage'
import { FormInput } from '../../components/FormItems'


/////////////////////////////////////////////
// Object's

// import { apiRequest, actions } from '../../data-storage/slice-orders'        // orders
import { ITEM_VALUE_ACTIONS, XTSObjectEditProps } from '../../data-objects/types-components'
import { requestData_SaveObject } from '../../data-objects/request-data'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { createXTSObject, getXTSEnum, getXTSEnumItem } from '../../data-objects/common-use'
import { REQUEST_STATUSES } from '../../commons/enums'
import { Loader } from '../../components/Loader'
import { generateUUID } from '../../commons/common-use'
import AmountInput from '../../components/AmountInput'
import { dataType } from './'
import './index.css'

/////////////////////////////////////////////
// Main component

const PaymentEditPage: React.FC<XTSObjectEditProps> = (props) => {

    /////////////////////////////////////////////
    // Các useHook chuẩn

    // const navigate = useNavigate()
    const dispatch = useDispatch()

    /////////////////////////////////////////////
    // Giải cấu trúc props    
    const { itemValue, pageId } = props

    // Biến dùng để quản lý Form
    const createPageParams: UseCreatePageParams = {
    }
    const { form } = useCreatePage(createPageParams)

    /////////////////////////////////////////////
    // Bắt đầu mở Page

    const object_id = itemValue?.id
    // const dataType = 'XTSOrder'

    const getDataObjectParams: UseGetDataObjectParams = {
        dataType,
        object_id,
        refresh: true,
    }

    const {
        dataObject,
        refreshObject,
        status
    } = useGetDataObject(getDataObjectParams)

    const pageName = dataType
    const pageTitle = 'Trả trước: ' + String(dataObject.objectId?.presentation).replace('của khách', 'số')
    const openPageParams: UseOpenPageParams = {
        pageId,
        pageName,
        pageTitle,
    }
    useOpenPage(openPageParams)


    /////////////////////////////////////////////
    // Xử lý các sự kiện trên Page   

    // Khi ghi lại dữ liệu xong trên Server thì thay đổi trạng thái status và tempData của state.orders
    // Hàm này gọi useEffect để thực hiện thay đổi trên Page.
    // const { status } = useSelector(state => state.orders)
    // const { status } = useSaveFormData({ dataType, setItemValue: props.setItemValue })

    // finish
    // Hàm sự kiện khi bấm nút Hoàn thành (Ghi lại) trên Form
    const finish = ((values: any) => {

        const orderState = dataObject['orderState']
        if (orderState.id === 'ToPrepay') {
            dataObject['orderState'] = getXTSEnumItem('XTSSalesOrderState', 'Preparing')
        }

        const requestData = requestData_SaveObject(dataObject)

        const { apiRequest, actions } = getXTSSlice(dataType)
        dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(actions.setTemp(null))
        dispatch(apiRequest(requestData))

        if (props.choiceItemValue) {
            // const itemValue = createXTSObject('XTSItemValue', { id: object_id, action: ITEM_VALUE_ACTIONS.VIEW })
            props.choiceItemValue(itemValue)        // Đóng Modal
        }
    })

    // finishFailed
    // Hàm sự kiện khi bấm nút Cancel trên Form    
    // Quay lại trang trước, hoặc chuyển sang trang View    
    const finishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    }

    // cancel
    // Hàm sự kiện khi bấm nút Cancel trên Form    
    // Quay lại trang trước, hoặc chuyển sang trang View
    const cancel = () => {
        // Đóng Modal
        if (props.choiceItemValue) {
            // const itemValue = createXTSObject('XTSItemValue')
            props.choiceItemValue(itemValue)
        }
    }

    const updatePostPayment = () => {
        // const formValues = form.getFieldsValue()
        dataObject.postPayment = dataObject.documentAmount - dataObject.cash - dataObject.bankTransfer
        setRenderKey(prevKey => prevKey + 1)
        // const newValues = {
        //     postPayment: dataObject.postPayment
        // }
        // form.setFieldsValue(newValues)
    }

    const [renderKey, setRenderKey] = useState(0)

    const fillPayment = (type: string) => {
        if (type === 'cash') {
            dataObject.cash = dataObject.documentAmount
            dataObject.bankTransfer = 0
            dataObject.postPayment = 0
        } else if (type === 'bankTransfer') {
            dataObject.cash = 0
            dataObject.bankTransfer = dataObject.documentAmount
            dataObject.postPayment = 0
        } else if (type === 'postPayment') {
            dataObject.cash = 0
            dataObject.bankTransfer = 0
            dataObject.postPayment = dataObject.documentAmount
        }
        const newValues = {
            cash: dataObject.cash,
            bankTransfer: dataObject.bankTransfer,
            postPayment: dataObject.postPayment,
        }
        setRenderKey(prevKey => prevKey + 1)
        // console.log('renderKey', renderKey)
        // form.setFieldsValue(newValues)
    }

    /////////////////////////////////////////
    // 



    /////////////////////////////////////////
    // Blocker

    // // Biến lưu dấu hiệu về việc cấm quay lại trang trước khi bấm nút Back trên Browser
    // let blocker = useBlocker(
    //     ({ currentLocation, nextLocation }) =>
    //         !choiceOpen && currentLocation.pathname !== nextLocation.pathname
    // );

    /////////////////////////////////////////////
    // props

    const commonItemProps = { form, dataObject }

    /////////////////////////////////////////////
    // props

    return (
        <div className='sales-order-payment'>

            {/* <Loader isLoading={status === REQUEST_STATUSES.LOADING} /> */}

            <Form
                onFinish={finish}
                onFinishFailed={finishFailed}
                form={form}
            >

                <div className='sales-order-payment-header'>
                    {dataObject.objectId.presentation
                        .replace('của khách', '')
                        .replace('(chưa kết chuyển)', '(nháp)')
                        .replace('Đơn hàng', 'Đơn hàng số')}
                </div>

                <Divider className='sales-order-payment-divider' orientation='center' />

                <FormInput
                    itemName='objectId'
                    dataType='XTSOrder'
                    itemProps={{
                        className: 'hidden',
                        label: 'ObjectId',
                    }}
                    inputProps={{
                        placeholder: '',
                        allowClear: true,
                        required: false
                    }}
                    {...commonItemProps}
                />

                <FormInput
                    itemName='paymentNote'
                    dataType='String'
                    multiline={true}
                    itemProps={{
                        label: 'Nội dung thanh toán',
                        labelCol: { span: 4 },
                        wrapperCol: { span: 20 },
                        style: { maxWidth: '700px' }
                    }}
                    inputProps={{
                        placeholder: 'Nhập nội dung thanh toán',
                        allowClear: true,
                        required: false,
                        // autoSize: true,
                    }}
                    {...commonItemProps}
                />

                <div className='sales-order-payment-amount-group'>
                    <div>Số tiền đơn hàng: </div>
                    <b>{dataObject.documentAmount?.toLocaleString('vi-VN')} đồng</b>
                </div>

                <Divider className='sales-order-payment-divider' orientation='center' />

                <div className='sales-order-payment-payment-block'>

                    <div className='sales-order-payment-payment-group'>
                        <div className='sales-order-payment-payment-title'>
                            Tiền mặt:
                        </div>

                        <AmountInput
                            dataObject={dataObject}
                            itemName='cash'
                            min={0}
                            max={dataObject.documentAmount}
                            title='Nhập số tiền'
                            description=''
                            renderKey={renderKey}
                            onChange={updatePostPayment}
                        />

                        <Button
                            className='sales-order-payment-button-left'
                            onClick={() => fillPayment('cash')}
                            icon={<ArrowLeftOutlined />}
                        />

                    </div>

                    <div className='sales-order-payment-payment-group'>
                        <div className='sales-order-payment-payment-title'>
                            Chuyển khoản:
                        </div>

                        <AmountInput
                            dataObject={dataObject}
                            itemName='bankTransfer'
                            min={0}
                            max={dataObject.documentAmount}
                            title='Nhập số tiền'
                            description=''
                            renderKey={renderKey}
                            onChange={updatePostPayment}
                        />

                        <Button
                            className='sales-order-payment-button-left'
                            onClick={() => fillPayment('bankTransfer')}
                            icon={<ArrowLeftOutlined />}
                        />

                    </div>

                    <div className='sales-order-payment-payment-group'>
                        <div className='sales-order-payment-payment-title'>
                            Trả sau:
                        </div>

                        <AmountInput
                            dataObject={dataObject}
                            itemName='postPayment'
                            min={0}
                            max={dataObject.documentAmount}
                            title='Nhập số tiền'
                            description=''
                            renderKey={renderKey}
                            onChange={updatePostPayment}
                        />

                        <Button
                            className='sales-order-payment-button-left'
                            onClick={() => fillPayment('postPayment')}
                            icon={<ArrowLeftOutlined />}
                        />

                    </div>
                </div>

                <div className='sales-order-payment-buttons-group'>
                    <Button
                        className='sales-order-payment-form-button'
                        block type='primary'
                        htmlType='submit'
                        icon={<CheckCircleOutlined />}
                    >
                        Ghi lại
                    </Button>
                    <Button
                        className='sales-order-payment-form-button'
                        block htmlType='button'
                        onClick={cancel}
                        icon={<CloseCircleOutlined />}
                    >
                        Hủy bỏ
                    </Button>
                </div>

            </Form>

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default PaymentEditPage                       