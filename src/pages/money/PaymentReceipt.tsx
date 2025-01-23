/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams, useLocation, useBlocker } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, Button, Modal, List, Space, InputNumber, FloatButton, Card, Divider, Tag } from 'antd'
import { AppstoreAddOutlined, CheckCircleOutlined, CheckOutlined, CloseCircleOutlined, FileTextOutlined, InsertRowBelowOutlined, SaveOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

/////////////////////////////////////////////
// Application's

// import ChoicePage from '../../hocs/choice-page'
import { useCreatePage, UseCreatePageParams, useGetDataObject, UseGetDataObjectParams, useOpenPage, UseOpenPageParams, useSaveFormData, UseSaveFormDataParams, useStepBack } from '../../hooks/usePage'
// import { generateUUID } from '../../commons/common-use'
// import { createXTSObject } from '../../data-exchange/objects'
import { FormInput, FormSelect } from '../../components/FormItems'
// import { deleteTabRow, getFormValuesWithTabs, setFormTabs, updateTabRow, updateTabRow_new } from '../../commons/object-tabs'
import { BottomBar, } from '../../components/ContextMenu'
import { ITEM_VALUE_ACTIONS, XTSObjectEditProps } from '../../data-objects/types-components'
import { requestData_CreateObject, requestData_SaveObject } from '../../data-objects/request-data'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { XTSOrderProductRow, XTSProduct, XTSSalesInvoiceInventory, XTSSupplierInvoiceInventory } from '../../data-objects/types-application'
import { XTSObjectId, XTSObjectRow, XTSType } from '../../data-objects/types-common'
import { deleteTabRow, updateTabRow } from '../../commons/common-tabs'
import ChoicePage from '../../hocs/ChoicePage'
import { XTSItemValue } from '../../data-objects/types-form'
import { createXTSObject, getXTSEnum, getXTSEnumItem, objectPresentation } from '../../data-objects/common-use'
import { REQUEST_STATUSES } from '../../commons/enums'
import { Loader } from '../../components/Loader'
import { RootState } from '../../data-storage'

/////////////////////////////////////////////
// Object's

// import { ObjectInventoryEdit } from './ObjectInventory'                 // 

// import { getLabels } from './common'
import './index.css'
import AmountInput from '../../components/AmountInput'
import { generateUUID } from '../../commons/common-use'

/////////////////////////////////////////////
// Main component

//
const ReceiptPage: React.FC<any> = (props) => {

    /////////////////////////////////////////////
    // Các useHook chuẩn
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, company } = useSelector((state: RootState) => state.session)

    /////////////////////////////////////////////
    // Giải cấu trúc props    
    const { itemValue, itemName = '' } = props

    // Biến để quản lý Form
    const createPageParams: UseCreatePageParams = {}
    const { form } = useCreatePage(createPageParams)

    /////////////////////////////////////////////
    // Bắt đầu mở Page

    // const object_id = itemValue?.id
    const dataType = 'XTSPaymentReceipt'
    const [dataObject, setDataObject] = useState(createXTSObject(dataType))

    // const getDataObjectParams: UseGetDataObjectParams = {
    //     dataType,
    //     object_id,
    //     refresh: false,
    // }

    // const {
    //     dataObject,
    //     status,
    //     refreshObject,
    //     setDataObject,
    // } = useGetDataObject(getDataObjectParams)

    // Object.assign(dataObject, itemValue.dataItem)

    // console.log('OrderEdit.dataObject', dataObject)
    // console.log('OrderEdit.formData', formData)

    const stepBack = () => {
        navigate(-1)
    }

    const pageName = dataType
    const [pageId] = useState(generateUUID())
    useStepBack({ pageId, stepBack })

    // const pos = dataObject?.objectId.presentation.indexOf('ngày')
    // const pageTitle = (!itemValue?.id) && 'Thu tiền mặt *' || dataObject.objectId.presentation.substring(0, pos) + ' (soạn)'
    const pageTitle = 'Thu chuyển khoản đơn hàng'
    const openPageParams: UseOpenPageParams = {
        pageId,
        pageName,
        pageTitle,
        // renderKey: 0,
    }
    const { setPageInfo } = useOpenPage(openPageParams)


    /////////////////////////////////////////////
    // Làm việc với ChoicePage   

    // // Hàm sự kiện khi bấm nút OK trên biểu mẫu Modal ChoicePage
    // const handleOk = (value: any) => {
    //     closeChoicePage();
    // }

    // // Hàm sự kiện khi bấm nút Cancel trên biểu mẫu Modal ChoicePage
    // const handleCancel = () => {
    //     closeChoicePage()
    //     // setProductRowOpen(false)
    // }

    // const { choiceOpen,
    //     openChoicePage,
    //     closeChoicePage,
    //     chosenItemValues,
    //     setChosenItemValues,
    //     initialItemValue,               // Được gán giá trị bằng setInitialItemValue khi gọi openChoicePage, vẫn cần
    //     setInitialItemValue,            // Không dùng, chỉ dùng trong openChoicePage
    // } = useChoicePage()


    /////////////////////////////////////////////
    // Xử lý các sự kiện trên Page   

    // Khi ghi lại dữ liệu xong trên Server thì thay đổi trạng thái status và tempData của state.orders
    // Hàm này gọi useEffect để thực hiện thay đổi trên Page.
    // const saveFormDataParams: UseSaveFormDataParams = {
    //     dataType,
    //     itemName,
    //     choiceItemValue: props.choiceItemValue,
    //     afterSave,
    // }
    // useSaveFormData(saveFormDataParams)

    // finish
    // Hàm sự kiện khi bấm nút Hoàn thành (Ghi lại) trên Form
    // const defaultValues = useSelector(state => state.session.defaultValues)
    const finish = ((values: any) => {

        if (status !== REQUEST_STATUSES.LOADING) {
            const fillingValues = {
                salesOrder: dataObject.documentBasis,
                amount: dataObject.documentAmount,
            }
            const requestData = requestData_CreateObject(dataObject, fillingValues)
            const { apiRequest, actions } = getXTSSlice(dataType)

            // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setTemp(null))
            dispatch(apiRequest(requestData))
        }
    })

    // finishFailed
    // Hàm sự kiện khi có lỗi trên Form
    const finishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    }

    const changeDocumentAmount = (amount: number): void => {

    }

    // /////////////////////////////////////////
    // // Order product row page

    // const updateAmount = () => {
    //     dataObject['documentAmount'] = dataObject['inventory'].reduce((docAmount: number, currentRow: XTSOrderProductRow) => docAmount + currentRow.total, 0)
    //     setDataObject({ ...dataObject })
    //     // console.log('documentAmount', dataObject['documentAmount'])
    // }

    // const updateRow = (tabName: string, dataRow: XTSObjectRow): void => {
    //     updateTabRow(dataObject, tabName, dataRow, setDataObject)
    //     updateAmount()
    //     // console.log('dataObject', dataObject)
    // }

    // const deleteRow = (tabName: string, _lineNumber: number): void => {
    //     deleteTabRow(dataObject, tabName, _lineNumber, setDataObject)
    //     updateAmount()
    // }

    /////////////////////////////////////////
    // Choice product

    // // Chọn giá trị chọn sản phẩm và đóng cửa sổ Modal ChoicePage
    // const choiceItemValue = (itemValue: XTSItemValue): void => {
    //     // console.log('OrderEdit.choiceItemValue.itemValue', itemValue)
    //     setPageInfo()
    //     setChoiceOpen(false)
    //     // const { itemName } = itemValue
    //     if (itemValue.action === ITEM_VALUE_ACTIONS.CHOICE) {
    //         if (itemValue.itemName === 'product') {
    //             // setChosenItemValues({ ...chosenItemValues, [itemName]: itemValue })

    //             // dataObject[itemName].id = itemValue.id
    //             // dataObject[itemName].dataType = itemValue.dataType
    //             // dataObject[itemName].presentation = itemValue.presentation
    //             // form.setFieldValue(itemName, itemValue.presentation)
    //             // console.log('itemValue', itemValue)
    //             // if (props.onChange) {
    //             //     props.onChange(itemValue)
    //             // }

    //             const productObject = itemValue.dataItem as XTSProduct
    //             const newDataRow = createXTSObject('XTSOrderProductRow', {
    //                 product: productObject.objectId,
    //                 price: productObject._price,
    //                 quantity: 1,
    //                 vatRate: productObject._vatRate,
    //                 _lineNumber: 0,
    //                 uom: productObject.measurementUnit,
    //                 amount: productObject._price,
    //                 total: productObject._price,
    //                 _price: productObject._price,
    //                 _coefficient: 1,
    //                 _vatRateRate: productObject._vatRateRate,
    //                 _picture: productObject.picture,
    //             })
    //             updateRow('inventory', newDataRow)
    //         }
    //     }
    // }

    // // State dùng để mở và đóng Modal ChoicePage Products
    // const [choiceOpen, setChoiceOpen] = useState(false)
    // const choicePageInit = {
    //     itemName: 'product',
    //     dataType: 'XTSProduct',
    // }

    // const addProduct = () => {
    //     choicePageInit.itemName = 'product'
    //     choicePageInit.dataType = 'XTSProduct'
    //     setChoiceOpen(true)    // Mở Modal
    // }

    /////////////////////////////////////////
    // 

    const { sliceName, apiRequest, actions } = getXTSSlice(dataType)
    const { status, tempData } = useSelector((state: any) => state[sliceName])

    useEffect(() => {
        const responseTypes = ['XTSCreateObjectResponse']

        if (status === REQUEST_STATUSES.SUCCEEDED && (tempData) && responseTypes.includes(tempData['_type'])) {
            const { object } = tempData
            dispatch(actions.setStatus(REQUEST_STATUSES.IDLE))
            const objectId = object.objectId
            navigate(`/payment-receipts?id=${objectId.id}`)
        }
    }, [status, tempData])

    /////////////////////////////////////////
    // Blocker

    // // Biến lưu dấu hiệu về việc cấm quay lại trang trước khi bấm nút Back trên Browser
    // let blocker = useBlocker(
    //     ({ currentLocation, nextLocation }) =>
    //         !choiceOpen && currentLocation.pathname !== nextLocation.pathname
    // );

    /////////////////////////////////////////
    // props 

    const commonItemProps = { form, dataObject, setPageInfo }

    /////////////////////////////////////////////
    //     

    return (
        <div className='money-receipt'>

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <Form
                onFinish={finish}
                onFinishFailed={finishFailed}
                // htmlType='submit'
                form={form}
                style={{ margin: 0, }}
            >
                {/* <FormInput
                    itemName='objectId'
                    dataType='XTSCashReceipt'
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
                /> */}

                <Card className='money-receipt-header'>

                    <div className='money-receipt-title'>
                        {/* {objectPresentation(dataObject.objectId, dataObject.operationKind)} */}
                        Thu chuyển khoản theo đơn hàng *
                    </div>

                    <Divider className='money-receipt-divider' orientation='center' />

                    <div className='money-receipt-item'>
                        <div className='money-receipt-edit-item-label'>Cơ sở: </div>
                        <div>{objectPresentation(dataObject.documentBasis)}</div>
                    </div>

                    <FormInput
                        itemName='documentBasis'
                        dataType='XTSOrder'
                        itemProps={{
                            className: 'money-receipt-edit-item-label',
                            label: 'Đơn hàng',
                            labelCol: { span: 4 },
                            wrapperCol: { span: 20 },
                        }}
                        inputProps={{
                            placeholder: 'Chọn đơn hàng',
                            allowClear: true,
                            required: true,
                            // readOnly: (!user) && true || false,
                        }}
                        {...commonItemProps}
                    />

                    {/* <FormInput
                        itemName='counterparty'
                        dataType='XTSCounterparty'
                        itemProps={{
                            className: 'money-receipt-edit-item-label',
                            label: 'Người trả tiền',
                            labelCol: { span: 4 },
                            wrapperCol: { span: 20 },
                        }}
                        inputProps={{
                            placeholder: 'Chọn người trả tiền',
                            allowClear: true,
                            required: true,
                            // readOnly: (!user) && true || false,
                        }}
                        {...commonItemProps}
                    /> */}

                    <div className='money-receipt-currency'>
                        {/* <FormInput
                            itemName='cashCurrency'
                            dataType='XTSCurrency'
                            itemProps={{
                                className: 'money-receipt-item-label',
                                label: 'Tiền tệ',
                                labelCol: { span: 4 },
                                style: { width: '150px' }
                            }}
                            inputProps={{
                                placeholder: 'Chọn tiền tệ',
                                allowClear: true,
                                required: false
                            }}
                            {...commonItemProps}
                        /> */}
                        <AmountInput
                            dataObject={dataObject}
                            itemName='documentAmount'
                            min={0}
                            // max={dataRow.amount}
                            title='Nhập số tiền'
                            description='Số tiền'
                            // renderKey={renderKey}
                            onChange={(amount) => changeDocumentAmount(amount)}
                        />
                    </div>

                    <div className={(user) && 'money-receipt-edit-item-visible' || 'money-receipt-edit-item-hidden'}>
                        <FormInput
                            itemName='employeeResponsible'
                            dataType='XTSEmployee'
                            itemProps={{
                                className: 'money-receipt-edit-item-label',
                                label: 'Nhân viên',
                                labelCol: { span: 4 },
                                wrapperCol: { span: 20 },
                            }}
                            inputProps={{
                                placeholder: 'Chọn nhân viên',
                                allowClear: true,
                                required: true,
                                readOnly: (!company) && true || false,
                            }}
                            {...commonItemProps}
                        />
                    </div>

                    <FormInput
                        itemName='comment'
                        dataType='String'
                        multiline={true}
                        itemProps={{
                            className: 'money-receipt-edit-item-label',
                            label: 'Ghi chú',
                            labelCol: { span: 4 },
                            wrapperCol: { span: 20 },
                        }}
                        inputProps={{
                            placeholder: 'Nhập ghi chú',
                            allowClear: true,
                            required: false,
                            // autoSize: true,
                        }}
                        {...commonItemProps}
                    />

                    <Divider className='money-receipt-edit-divider' orientation='center' />

                    {/* <div className='money-receipt-edit-item' >
                        <div>Số tiền: </div>
                        <b>{dataObject.documentAmount?.toLocaleString('vi-VN')} {dataObject.cashCurrency?.presentation}</b>
                    </div> */}

                </Card>

                {/* <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 3,
                        xl: 4,
                        xxl: 5,
                    }}
                    dataSource={dataObject.inventory}
                    renderItem={(dataRow: XTSSupplierInvoiceInventory) => (
                        <List.Item style={{ padding: '0px', marginBottom: '3px' }}>
                            <ObjectInventoryEdit
                                dataRow={dataRow}
                                updateRow={updateRow}
                                deleteRow={deleteRow}
                                form={form}
                            />
                        </List.Item>
                    )}
                    locale={{ emptyText: 'Không có sản phẩm nào được chọn' }}
                    footer={
                        <div style={{ height: 20 }}></div>
                    }
                    style={{ margin: '4px' }}
                /> */}

                {/* <ChoicePage
                    modalProps={{
                        centered: true,
                        title: 'Chọn sản phẩm',
                        open: choiceOpen,
                        footer: []
                    }}
                    itemName={choicePageInit.itemName}      // 'product'
                    dataType={choicePageInit.dataType}      // 'XTSProduct'
                    form={form}                             // Xem xét bỏ đi
                    choiceItemValue={choiceItemValue}
                // pageOwnerId={pageId}
                /> */}

                <BottomBar
                    stepBack={{ onClick: stepBack }}
                    // refresh={{ onClick: refreshObject, }}
                    // action1={{ onClick: addProduct, title: 'Thêm hàng', icon: <AppstoreAddOutlined className='context-menu-button-icon' />, visible: saveButton }}
                    saveItem={{ onClick: () => { form.submit() } }}
                // action2={{ onClick: saveAndSend, title: 'Chốt đơn', icon: <CheckOutlined className='context-menu-button-icon' />, visible: sendButton }}
                />

            </Form>

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default ReceiptPage