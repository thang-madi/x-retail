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
import { useCreatePage, UseCreatePageParams, useGetDataObject, UseGetDataObjectParams, useOpenPage, UseOpenPageParams, useSaveFormData, UseSaveFormDataParams } from '../../hooks/usePage'
// import { generateUUID } from '../../commons/common-use'
// import { createXTSObject } from '../../data-exchange/objects'
import { FormInput, FormSelect } from '../../components/FormItems'
// import { deleteTabRow, getFormValuesWithTabs, setFormTabs, updateTabRow, updateTabRow_new } from '../../commons/object-tabs'
import { BottomBar, } from '../../components/ContextMenu'
import { ITEM_VALUE_ACTIONS, XTSObjectEditProps } from '../../data-objects/types-components'
import { requestData_CreateObject, requestData_SaveObject } from '../../data-objects/request-data'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { XTSOrderProductRow, XTSProduct, XTSSalesInvoiceInventory, XTSSupplierInvoiceInventory } from '../../data-objects/types-application'
import { XTSObjectRow } from '../../data-objects/types-common'
import { deleteTabRow, updateTabRow } from '../../commons/common-tabs'
import ChoicePage from '../../hocs/ChoicePage'
import { XTSItemValue } from '../../data-objects/types-form'
import { createXTSObject, getXTSEnum, getXTSEnumItem, isEmptyObjectId, objectPresentation } from '../../data-objects/common-use'
import { REQUEST_STATUSES } from '../../commons/enums'
import { Loader } from '../../components/Loader'
import { RootState } from '../../data-storage'

/////////////////////////////////////////////
// Object's

// import { ObjectInventoryEdit } from './ObjectInventory'                 // 

import { dataType } from './'
import './index.css'
import { getLabels } from './common'
import AmountInput from '../../components/AmountInput'

/////////////////////////////////////////////
// Main component

//
const ObjectEditPage: React.FC<XTSObjectEditProps> = (props) => {

    /////////////////////////////////////////////
    // Các useHook chuẩn
    // const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, company } = useSelector((state: RootState) => state.session)

    /////////////////////////////////////////////
    // Giải cấu trúc props    
    const { itemValue, pageId, itemName = '' } = props

    // Biến để quản lý Form
    const createPageParams: UseCreatePageParams = {}
    const { form } = useCreatePage(createPageParams)

    /////////////////////////////////////////////
    // Bắt đầu mở Page

    const object_id = itemValue?.id
    // const dataType = 'XTSPaymentReceipt'

    const getDataObjectParams: UseGetDataObjectParams = {
        dataType,
        object_id,
        refresh: false,
    }

    const {
        dataObject,
        status,
        refreshObject,
        setDataObject,
    } = useGetDataObject(getDataObjectParams)

    Object.assign(dataObject, itemValue.dataItem)
    const labels = getLabels(dataObject)

    // console.log('OrderEdit.dataObject', dataObject)
    // console.log('OrderEdit.formData', formData)

    const pageName = dataType
    const pos = dataObject?.objectId.presentation.indexOf('ngày')
    const pageTitle = (!itemValue?.id) && 'Thu chuyển khoản *' || dataObject.objectId.presentation.substring(0, pos) + ' (soạn)'
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

    // Sau khi lưu dữ liệu dataObject
    const afterSave = (tempData: any) => {

    }

    // // Khi thay đổi phần bảng Inventory
    // const onChange = () => {

    // }

    // Khi ghi lại dữ liệu xong trên Server thì thay đổi trạng thái status và tempData của state.orders
    // Hàm này gọi useEffect để thực hiện thay đổi trên Page.
    const saveFormDataParams: UseSaveFormDataParams = {
        dataType,
        itemName,
        choiceItemValue: props.choiceItemValue,
        afterSave,
    }
    useSaveFormData(saveFormDataParams)

    // finish
    // Hàm sự kiện khi bấm nút Hoàn thành (Ghi lại) trên Form
    // const defaultValues = useSelector(state => state.session.defaultValues)
    const finish = ((values: any) => {

        if (status === REQUEST_STATUSES.LOADING) {
            return
        }

        if (isEmptyObjectId(dataObject.objectId)) {

            const fillingValues = {
                documentBasis: dataObject.documentBasis,
                amount: dataObject.documentAmount,
            }
            const requestData = requestData_CreateObject(dataObject, fillingValues)
            const { apiRequest, actions } = getXTSSlice(dataType)
            dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setTemp(null))
            dispatch(apiRequest(requestData))

        } else {
            const requestData = requestData_SaveObject(dataObject)
            const { apiRequest, actions } = getXTSSlice(dataType)

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

    const initialOperationKinds = () => {
        if (!isEmptyObjectId(dataObject.objectId)) {
            return [
                dataObject.operationKind
            ]
        } else {
            return [
                {
                    _type: "XTSObjectId",
                    dataType: "XTSOperationKindsPaymentReceipt",
                    id: "FromCustomer",
                    presentation: "Từ khách hàng",
                },
                {
                    _type: "XTSObjectId",
                    dataType: "XTSOperationKindsPaymentReceipt",
                    id: "FromSupplier",
                    presentation: "Từ người bán",
                },

                {
                    _type: "XTSObjectId",
                    dataType: "XTSOperationKindsPaymentReceipt",
                    id: "Other",
                    presentation: "Thu khác",
                },

            ]
        }
    }

    const [operationKinds] = useState(initialOperationKinds())

    const [visibleSalesOrder, setVisibleSalesOrder] = useState(false)
    const [visibleSupplierInvoice, setVisibleSupplierInvoice] = useState(false)

    const [enableCounterparty, setEnableCounterparty] = useState(false)
    const [enableSalesOrder, setEnableSalesOrder] = useState(false)
    const [enableSupplierInvoice, setEnableSupplierInvoice] = useState(false)

    const setVisibilities = () => {
        if (isEmptyObjectId(dataObject.objectId)) {
            // setEnableOperationKind(true)
            setEnableCounterparty(true)
            setEnableSalesOrder(true)
            setEnableSupplierInvoice(true)
        } else {
            // setEnableOperationKind(false)
            setEnableCounterparty(false)
            setEnableSalesOrder(false)
            setEnableSupplierInvoice(false)
        }

        if (dataObject.operationKind.id === 'FromCustomer') {
            setVisibleSalesOrder(true)
            setVisibleSupplierInvoice(false)
        } else if (dataObject.operationKind.id === 'FromSupplier') {
            setVisibleSalesOrder(false)
            setVisibleSupplierInvoice(true)
        } else if (dataObject.operationKind.id === 'Other') {
            setVisibleSalesOrder(false)
            setVisibleSupplierInvoice(false)
        } else {
            setVisibleSalesOrder(false)
            setVisibleSupplierInvoice(false)
        }
    }

    const operationKindOnChange = (value: any) => {
        setVisibilities()
    }

    const changeAmount = (amount: number) => {
        console.log('dataObject.paymentDetails.length', dataObject.paymentDetails.length)
        if (dataObject.paymentDetails.length === 1) {
            const paymentRow = dataObject.paymentDetails[0]
            paymentRow.paymentAmount = amount
            paymentRow.settlementsAmount = amount
        }
        console.log('dataObject', dataObject)
        // dataObject.documentAmount = amount
    }

    // const saveAndSend = (): void => {
    //     // if (dataObject['orderState'].presentation === SALES_ORDER_STATES.EDITING) {
    //     //     dataObject['orderState'] = getXTSEnumItem('XTSSalesOrderState', 'ToPrepay')
    //     // }
    //     // form.submit()
    // }

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
    // Buttons status

    const [saveButton, setSaveButton] = useState<boolean>(false)
    // const [sendButton, setSendButton] = useState<boolean>(false)

    useEffect(() => {
        if (status !== REQUEST_STATUSES.IDLE) {
            setSaveButton(false)
        } else if (company) {
            setSaveButton(true)
            // } else if (dataObject.orderState.presentation !== SALES_ORDER_STATES.EDITING) {
            //     setSaveButton(false)
        } else {
            setSaveButton(true)
        }

        setVisibilities()
        // if (status !== REQUEST_STATUSES.IDLE) {
        //     setSendButton(false)
        //     // } else if (dataObject.orderState.presentation !== SALES_ORDER_STATES.EDITING) {
        //     //     setSendButton(false)
        // } else if (company) {
        //     setSendButton(false)
        // } else {
        //     setSendButton(true)
        // }
    }, [dataObject])

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
        <div className='payment-receipt-edit'>

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <Form
                onFinish={finish}
                onFinishFailed={finishFailed}
                // htmlType='submit'
                form={form}
                style={{ margin: 0, }}
            >
                <FormInput
                    itemName='objectId'
                    dataType='XTSPaymentReceipt'
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

                <Card className='payment-receipt-edit-header'>

                    <div className='payment-receipt-edit-title'>
                        {objectPresentation(dataObject.objectId, dataObject.operationKind)}
                    </div>

                    <Divider className='payment-receipt-edit-divider' orientation='center' />

                    {/* <div className='payment-receipt-edit-item'>
                        <div className='payment-receipt-edit-item-label'>Cơ sở: </div>
                        <div>{objectPresentation(dataObject.documentBasis)}</div>
                    </div> */}

                    <div className={(company) && 'payment-receipt-edit-item-visible' || 'cash-receipt-edit-item-hidden'}>
                        <FormSelect
                            itemName='operationKind'
                            dataType='XTSOperationKindsPaymentReceipt'
                            options={operationKinds}
                            itemProps={{
                                className: 'cash-receipt-edit-item-label',
                                label: 'Dạng giao dịch',
                                required: false,
                                labelCol: { span: 4 },
                            }}
                            selectProps={{
                                className: 'payment-receipt-edit-item-order-state-value',
                                required: false,
                                disabled: (!company) && true || false,
                                onChange: operationKindOnChange,
                            }}
                            {...commonItemProps}
                        />
                    </div>

                    <FormInput
                        itemName='counterparty'
                        dataType='XTSCounterparty'
                        itemProps={{
                            className: 'payment-receipt-edit-item-label',
                            label: labels.counterpartyLabel,
                            labelCol: { span: 4 },
                            wrapperCol: { span: 20 },
                        }}
                        inputProps={{
                            placeholder: labels.counterpartyPlaceHolder,
                            allowClear: true,
                            required: true,
                            readOnly: (!enableCounterparty)
                        }}
                        {...commonItemProps}
                    />

                    <div style={(visibleSalesOrder) && { display: 'block' } || { display: 'none' }}>
                        <FormInput
                            itemName='documentBasis'
                            dataType='XTSOrder'
                            // renderKey={renderKey}
                            itemProps={{
                                className: 'payment-receipt-edit-item-label',
                                label: 'Đơn hàng của khách',
                                labelCol: { span: 4 },
                                wrapperCol: { span: 20 },
                                // style: (dataObject.operationKind.id !== 'FromCustomer') && { display: 'none' } || {}
                            }}
                            inputProps={{
                                placeholder: labels.counterpartyPlaceHolder,
                                allowClear: true,
                                required: true,
                                readOnly: (!enableSalesOrder)
                            }}
                            {...commonItemProps}
                        />
                    </div>

                    <div style={(visibleSupplierInvoice) && { display: 'block' } || { display: 'none' }}>
                        <FormInput
                            itemName='documentBasis'
                            dataType='XTSSupplierInvoice'
                            // renderKey={renderKey}
                            itemProps={{
                                className: 'payment-receipt-edit-item-label',
                                label: 'Hóa đơn nhận hàng',
                                labelCol: { span: 4 },
                                wrapperCol: { span: 20 },
                                // style: (dataObject.operationKind.id !== 'FromSupplier') && { display: 'none' } || {}
                            }}
                            inputProps={{
                                placeholder: labels.counterpartyPlaceHolder,
                                allowClear: true,
                                required: true,
                                readOnly: (!enableSupplierInvoice),
                            }}
                            {...commonItemProps}
                        />
                    </div>

                    {/* <div className={(company) && 'edit-page-item-hidden' || 'edit-page-item-visible'}>
                        Trạng thái đơn hàng: <OrderStateTag value={dataObject.orderState?.presentation} />
                    </div> */}

                    <div className={(user) && 'payment-receipt-edit-item-visible' || 'payment-receipt-edit-item-hidden'}>
                        <FormInput
                            itemName='employeeResponsible'
                            dataType='XTSEmployee'
                            itemProps={{
                                className: 'payment-receipt-edit-item-label',
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

                    {/* <FormInput
                        itemName='deliveryAddress'
                        dataType='String'
                        // multiline={true}
                        itemProps={{
                            className: 'payment-receipt-edit-item-label',
                            label: 'Địa chỉ giao hàng',
                            labelCol: { span: 4 },
                            wrapperCol: { span: 20 },
                        }}
                        inputProps={{
                            placeholder: 'Nhập địa chỉ giao hàng',
                            allowClear: true,
                            required: false,
                            // autoSize: true,
                        }}
                        {...commonItemProps}
                    /> */}

                    <FormInput
                        itemName='comment'
                        dataType='String'
                        multiline={true}
                        itemProps={{
                            className: 'payment-receipt-edit-item-label',
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

                    <Divider className='payment-receipt-edit-divider' orientation='center' />

                    <div className='payment-receipt-edit-item' >
                        <div>Số tiền: </div>
                        {/* <b>{dataObject.documentAmount?.toLocaleString('vi-VN')} {dataObject.cashCurrency?.presentation}</b> */}
                        <AmountInput
                            dataObject={dataObject}
                            itemName='documentAmount'
                            min={0}
                            // max={dataRow.amount}
                            title='Nhập số tiền'
                            description=''
                            // renderKey={renderKey}
                            onChange={(amount) => changeAmount(amount)}
                        />
                    </div>

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
                    stepBack={{ onClick: props.stepBack, visible: Boolean(props.stepBack) }}
                    refresh={{ onClick: refreshObject, }}
                    // action1={{ onClick: addProduct, title: 'Thêm hàng', icon: <AppstoreAddOutlined className='context-menu-button-icon' />, visible: saveButton }}
                    saveItem={{ onClick: () => { form.submit() }, visible: saveButton }}
                // action2={{ onClick: saveAndSend, title: 'Chốt đơn', icon: <CheckOutlined className='context-menu-button-icon' />, visible: sendButton }}
                />

            </Form>

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default ObjectEditPage