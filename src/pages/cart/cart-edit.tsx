/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams, useLocation, useBlocker } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, Button, Space, FloatButton, Modal } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, SaveOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Application's

// import ChoicePage from '../../hocs/choice-page'
import { useCreatePage, UseCreatePageParams, useGetDataRecord, UseGetDataRecordParams, useOpenPage, UseOpenPageParams, useSaveFormData, UseSaveFormDataParams } from '../../hooks/usePage'
// import { newItemValue, formDataToItemValue, createRequestDataToSaveFormValues, xtsObjectToFormData } from '../../data-exchange/common-use'
// import { generateUUID } from '../../commons/common-use'
// import { createXTSObject } from '../../data-exchange/objects'
import { FormInput } from '../../components/FormItems'


/////////////////////////////////////////////
// Object's

// import { apiRequest, setStatus, setTemp } from '../../data-storage/slice-carts'        // carts
// import { addDefaultValues } from '../../data-exchange/add-default-values'
import { XTSRecordEditProps } from '../../data-objects/types-components'
import { requestData_SaveRecord } from '../../data-objects/request-data'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { RootState } from '../../data-storage'
import { createXTSObject } from '../../data-objects/common-use'
import { REQUEST_STATUSES } from '../../commons/enums'
import { Loader } from '../../components/Loader'
import { generateUUID } from '../../commons/common-use'
// import { setPageInfo } from '../../data-storage/slice-current'

/////////////////////////////////////////////
// Main component

// function CartEditPage(props) {                                                           // Cart
const CartEditPage: React.FC<XTSRecordEditProps> = (props) => {         // Customer

    /////////////////////////////////////////////
    // Các useHook chuẩn
    const navigate = useNavigate()
    const dispatch = useDispatch()

    /////////////////////////////////////////////
    // Giải cấu trúc props    
    const { itemValue } = props
    const { filter } = itemValue

    // Biến dùng để quản lý Form
    // const [form] = Form.useForm()
    const createPageParams: UseCreatePageParams = {
    }
    const { form } = useCreatePage(createPageParams)

    /////////////////////////////////////////////
    // Bắt đầu mở Page

    // const filter = createXTSObject('XTSRecordFilter')
    // filter.externalAccount = item.externalAccount
    // filter.company = item.company
    // filter.customer = item.customer
    // filter.product = item.product
    // filter.characteristic = item.characteristic
    // filter.uom = item.uom

    const dataType = 'XTSCart'
    // const filter = createXTSObject('XTSRecordFilter')

    const recordKey = createXTSObject('XTSRecordKey', { dataType, filter })

    const getDataObjectParams: UseGetDataRecordParams = {
        recordKey,
        refresh: true,
    }

    const {
        dataRecord,
        refreshRecord
    } = useGetDataRecord(getDataObjectParams)

    const [pageId] = useState(generateUUID())

    const pageName = dataType
    const pageTitle = dataRecord?.product.description + ' (soạn)'
    const openPageParams: UseOpenPageParams = {
        pageId,
        pageName,
        pageTitle,
        // reopen: false
    }
    useOpenPage(openPageParams)

    // const pageName = dataType
    // const pageTitle = formData?.product + ' (soạn)'
    // useOpenPage({ pageName, pageTitle })

    /////////////////////////////////////////////
    // Làm việc với ChoicePage   

    // // Hàm sự kiện khi bấm nút OK trên biểu mẫu Modal ChoicePage
    // const handleOk = (value: any) => {
    //     closeChoicePage();
    // }

    // // Hàm sự kiện khi bấm nút Cancel trên biểu mẫu Modal ChoicePage
    // const handleCancel = () => {
    //     closeChoicePage();
    // }

    // const { choiceOpen,
    //     openChoicePage,
    //     closeChoicePage,
    //     chosenItemValues,
    //     initialItemValue,               // Được gán giá trị bằng setInitialItemValue khi gọi openChoicePage, vẫn cần
    //     setChosenItemValues,            // Không dùng, mà chỉ dùng tại choice-page
    //     setInitialItemValue,            // Không dùng, chỉ dùng trong openChoicePage
    // } = useChoicePage()

    /////////////////////////////////////////////
    // Xử lý các sự kiện trên Page   

    // afterSave
    const afterSave = (tempData: any) => {

    }

    // Khi ghi lại dữ liệu xong trên Server thì thay đổi trạng thái status và tempData của state.orders
    // Hàm này gọi useEffect để thực hiện thay đổi trên Page.
    const saveFormDataParams: UseSaveFormDataParams = {
        dataType,
        choiceItemValue: props.choiceItemValue,
        afterSave,
    }
    const { status } = useSaveFormData(saveFormDataParams)

    // finish
    // Hàm sự kiện khi bấm nút Hoàn thành (Ghi lại) trên Form
    // const defaultValues = useSelector(state => state.session.defaultValues)
    const dimensions = useSelector((state: RootState) => state.carts.dimensions)

    const finish = ((values: any) => {
        // const requestData = createRequestDataToSaveFormValues(values, 'XTSCart', defaultValues)
        // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        // dispatch(setTemp(null))
        // dispatch(apiRequest(requestData))

        // const dimensions = [
        //     'externalAccount',
        //     'company',
        //     'customer',
        //     'product',
        //     'characteristic',
        //     'uom',
        // ]

        const requestData = requestData_SaveRecord(dataRecord, dimensions)

        const { apiRequest, actions } = getXTSSlice(dataType)

        // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(actions.setTemp(null))
        dispatch(apiRequest(requestData))
    })

    // finishFailed
    // Hàm sự kiện khi bấm nút Cancel trên Form    
    // Quay lại trang trước, hoặc chuyển sang trang View    
    const finishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    }

    /////////////////////////////////////////
    // Blocker

    // // Biến lưu dấu hiệu về việc cấm quay lại trang trước khi bấm nút Back trên Browser
    // let blocker = useBlocker(
    //     ({ currentLocation, nextLocation }) =>
    //         !choiceOpen && currentLocation.pathname !== nextLocation.pathname
    // );


    return (
        <div>
            {
                <div>
                    <p>Sản phẩm: {dataRecord?.product.presentation}</p>
                    <p>Đơn giá: {dataRecord?.price}</p>
                    <p>Hệ số: {dataRecord?.coefficient}</p>
                    <p>Tổng số: {dataRecord?.total}</p>
                </div>
            }
            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <Form
                onFinish={finish}
                onFinishFailed={finishFailed}
                form={form}
            >

                {/* <FormInput
                    name='quantity'
                    dataType='Number'
                    itemProps={{
                        label: 'Số lượng',
                        initialValue: formDataToItemValue(formData, 'quantity'),
                        required: true,
                    }}
                    inputProps={{
                        placeholder: 'Nhập số lượng',
                        allowClear: true,
                        required: true,
                    }}
                    form={form}
                /> */}

                <Space>
                    {/* <Form.Item>
                        <Button block type='primary' htmlType='submit' ><CheckCircleOutlined />Ghi lại</Button>
                    </Form.Item> */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ display: 'none' }} />
                        <FloatButton
                            type='primary'
                            onClick={() => { form.submit() }}
                            icon={<SaveOutlined />}
                        />
                    </Form.Item>

                    {/* <EditMenu
                        saveItem={() => { form.submit() }}
                        refresh={refreshRecord}
                        stepBack={props.stepBack}
                    /> */}

                </Space>

                {/* <Modal
                    title='Chọn phần tử'
                    open={choiceOpen}
                    // onOk={handleOk}
                    // onCancel={handleCancel}
                    footer={[
                        //     <Button key='back' onClick={handleCancel}>Cancel</Button>,
                    ]}
                >
                    <ChoicePage
                        initialItemValue={{ ...initialItemValue }}
                        closeChoicePage={closeChoicePage}
                        form={form}
                        chosenItemValues={chosenItemValues}
                        setChosenItemValues={setChosenItemValues}
                        pageOwnerId={props.pageId}
                    />
                </Modal> */}
            </Form>

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default CartEditPage                                     // Cart