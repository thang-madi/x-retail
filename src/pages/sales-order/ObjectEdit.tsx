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

// import ChoicePage from '../../hocs/choice'
import { useCreatePage, UseCreatePageParams, useGetDataObject, UseGetDataObjectParams, useOpenPage, UseOpenPageParams, useSaveFormData, UseSaveFormDataParams } from '../../hooks/usePage'
// import { generateUUID } from '../../commons/common-use'
// import { createXTSObject } from '../../data-exchange/objects'
import { FormInput, FormSelect } from '../../components/FormItems'
// import { deleteTabRow, getFormValuesWithTabs, setFormTabs, updateTabRow, updateTabRow_new } from '../../commons/object-tabs'
import { BottomBar, } from '../../components/ContextMenu'
import { ITEM_VALUE_ACTIONS, XTSObjectEditProps } from '../../data-objects/types-components'
import { requestData_SaveObject } from '../../data-objects/request-data'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { XTSObjectRow } from '../../data-objects/types-common'
import { deleteTabRow, updateTabRow } from '../../commons/common-tabs'
import ChoicePage from '../../hocs/ChoicePage'
import { XTSItemValue } from '../../data-objects/types-form'
import { createXTSObject, getXTSEnum, getXTSEnumItem, objectPresentation } from '../../data-objects/common-use'
import { REQUEST_STATUSES } from '../../commons/enums'
import { Loader } from '../../components/Loader'
import { RootState } from '../../data-storage'

/////////////////////////////////////////////
// Object's

// import { apiRequest, actions } from '../../data-storage/slice-orders'
import { XTSOrderProductRow, XTSProduct } from '../../data-objects/types-application'

import { SALES_ORDER_STATES } from './enums'
import { OrderInventoryEdit } from './ObjectInventory'                 // 
import OrderStateTag from './OrderStateTag'
import { dataType } from './'
import './index.css'

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
    // const dataType = 'XTSOrder'

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

    // console.log('OrderEdit.object_id', object_id)
    // console.log('OrderEdit.formData', formData)

    const pageName = dataType
    const pos = dataObject?.objectId.presentation.indexOf('ngày')
    const pageTitle = (!itemValue?.id) && 'Đơn hàng mới' || dataObject.objectId.presentation.substring(0, pos) + ' (soạn)'
    const openPageParams: UseOpenPageParams = {
        pageId,
        pageName,
        pageTitle,
        // renderKey: 0,
    }
    const { setPageInfo } = useOpenPage(openPageParams)

    /////////////////////////////////////////////
    // Xử lý các sự kiện trên Page   

    // Sau khi lưu dữ liệu dataObject
    const afterSave = (tempData: any) => {

    }

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

        // const requestData = createSaveObjectRequest(dataObject, values, valueTabs)

        if (dataObject['shipmentDate'].startsWith('0001-01-01')) {
            dataObject['shipmentDate'] = dayjs().format('YYYY-MM-DD')
        }
        // console.log('dataObject:', dataObject)

        const requestData = requestData_SaveObject(dataObject)
        const { apiRequest, actions } = getXTSSlice(dataType)

        // console.log('requestData', requestData)
        // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
        dispatch(actions.setTemp(null))
        dispatch(apiRequest(requestData))
    })

    // finishFailed
    // Hàm sự kiện khi có lỗi trên Form
    const finishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    }

    const saveAndSend = (): void => {
        if (dataObject['orderState'].presentation === SALES_ORDER_STATES.EDITING) {
            dataObject['orderState'] = getXTSEnumItem('XTSSalesOrderState', 'ToPrepay')
        }
        form.submit()
    }

    /////////////////////////////////////////
    // Order product row page

    const updateAmount = () => {
        dataObject['documentAmount'] = dataObject['inventory'].reduce((docAmount: number, currentRow: XTSOrderProductRow) => docAmount + currentRow.total, 0)
        setDataObject({ ...dataObject })
        // console.log('documentAmount', dataObject['documentAmount'])
    }

    const updateRow = (tabName: string, dataRow: XTSObjectRow): void => {
        updateTabRow(dataObject, tabName, dataRow, setDataObject)
        updateAmount()
        // console.log('dataObject', dataObject)
    }

    const deleteRow = (tabName: string, _lineNumber: number): void => {
        deleteTabRow(dataObject, tabName, _lineNumber, setDataObject)
        updateAmount()
    }

    /////////////////////////////////////////
    // Choice product

    // Chọn giá trị chọn sản phẩm và đóng cửa sổ Modal ChoicePage
    const choiceItemValue = (itemValue: XTSItemValue): void => {
        // console.log('OrderEdit.choiceItemValue.itemValue', itemValue)
        setPageInfo()
        setChoiceOpen(false)
        // const { itemName } = itemValue
        if (itemValue.action === ITEM_VALUE_ACTIONS.CHOICE) {
            if (itemValue.itemName === 'product') {
                // setChosenItemValues({ ...chosenItemValues, [itemName]: itemValue })

                // dataObject[itemName].id = itemValue.id
                // dataObject[itemName].dataType = itemValue.dataType
                // dataObject[itemName].presentation = itemValue.presentation
                // form.setFieldValue(itemName, itemValue.presentation)
                // console.log('itemValue', itemValue)
                // if (props.onChange) {
                //     props.onChange(itemValue)
                // }

                const productObject = itemValue.dataItem as XTSProduct
                const newDataRow = createXTSObject('XTSOrderProductRow', {
                    product: productObject.objectId,
                    price: productObject._price,
                    quantity: 1,
                    vatRate: productObject._vatRate,
                    _lineNumber: 0,
                    uom: productObject.measurementUnit,
                    amount: productObject._price,
                    total: productObject._price,
                    _price: productObject._price,
                    _coefficient: 1,
                    _vatRateRate: productObject._vatRateRate,
                    _picture: productObject.picture,
                    _sku: productObject.sku
                })
                updateRow('inventory', newDataRow)
            }
        }
    }

    // State dùng để mở và đóng Modal ChoicePage Products
    const [choiceOpen, setChoiceOpen] = useState(false)
    const choicePageInit = {
        itemName: 'product',
        dataType: 'XTSProduct',
    }

    const addProduct = () => {
        choicePageInit.itemName = 'product'
        choicePageInit.dataType = 'XTSProduct'
        setChoiceOpen(true)    // Mở Modal
    }

    /////////////////////////////////////////
    // Buttons status

    const [saveButton, setSaveButton] = useState<boolean>(false)
    const [sendButton, setSendButton] = useState<boolean>(false)

    useEffect(() => {
        if (status !== REQUEST_STATUSES.IDLE) {
            setSaveButton(false)
        } else if (company) {
            setSaveButton(true)
        } else if (dataObject.orderState.presentation !== SALES_ORDER_STATES.EDITING) {
            setSaveButton(false)
        } else {
            setSaveButton(true)
        }

        if (status !== REQUEST_STATUSES.IDLE) {
            setSendButton(false)
        } else if (dataObject.orderState.presentation !== SALES_ORDER_STATES.EDITING) {
            setSendButton(false)
        } else if (company) {
            setSendButton(true)
        } else {
            setSendButton(true)
        }
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
        <div className='sales-order-edit'>

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

                <Card className='sales-order-edit-header' >

                    <div className='sales-order-edit-title' >
                        {objectPresentation(dataObject.objectId)}
                    </div>

                    <Divider className='sales-order-edit-divider' orientation='center' />

                    <FormInput
                        itemName='customer'
                        dataType='XTSCounterparty'
                        itemProps={{
                            // className: 'edit-item-customer',
                            className: 'sales-order-edit-item-label',
                            label: 'Khách hàng',
                            labelCol: { span: 4 },
                            wrapperCol: { span: 20 },
                        }}
                        inputProps={{
                            placeholder: 'Chọn khách hàng',
                            allowClear: true,
                            required: true,
                            readOnly: (!user) && true || false,
                        }}
                        {...commonItemProps}
                    />

                    <div className={(company) && 'sales-order-edit-item-visible' || 'sales-order-edit-item-hidden'}>
                        <FormSelect
                            itemName='orderState'
                            dataType='XTSSalesOrderState'
                            itemProps={{
                                className: 'sales-order-edit-item-label',
                                label: 'Trạng thái đơn hàng',
                                required: false,
                                labelCol: { span: 4 },
                            }}
                            selectProps={{
                                className: 'sales-order-edit-item-order-state-value',
                                required: false,
                                disabled: (!company) && true || false,
                            }}
                            {...commonItemProps}
                        />
                    </div>
                    <div className={(company) && 'sales-order-edit-item-hidden' || 'sales-order-edit-item-visible'}>
                        Trạng thái đơn hàng: <OrderStateTag value={dataObject.orderState?.presentation} />
                    </div>

                    <div className={(user) && 'sales-order-edit-item-visible' || 'sales-order-edit-item-hidden'}>
                        <FormInput
                            itemName='employeeResponsible'
                            dataType='XTSEmployee'
                            itemProps={{
                                className: 'sales-order-edit-item-label',
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
                        itemName='deliveryAddress'
                        dataType='String'
                        // multiline={true}
                        itemProps={{
                            className: 'sales-order-edit-item-label',
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
                    />

                    <FormInput
                        itemName='comment'
                        dataType='String'
                        multiline={true}
                        itemProps={{
                            className: 'sales-order-edit-item-label',
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

                    <Divider className='sales-order-edit-divider' orientation='center' />

                    <div className='sales-order-edit-item' >
                        <div>Số tiền đơn hàng: </div>
                        <b>{dataObject.documentAmount?.toLocaleString('vi-VN')} đồng</b>
                    </div>

                </Card>

                <List
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
                    renderItem={(dataRow: XTSOrderProductRow) => (
                        <List.Item style={{ padding: '0px', marginBottom: '3px' }}>
                            <OrderInventoryEdit
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
                />

                <ChoicePage
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
                />

                <BottomBar
                    stepBack={{ onClick: props.stepBack, visible: Boolean(props.stepBack) }}
                    refresh={{ onClick: refreshObject, }}
                    action1={{ onClick: addProduct, title: 'Thêm hàng', icon: <AppstoreAddOutlined className='context-menu-button-icon' />, visible: saveButton }}
                    saveItem={{ onClick: () => { form.submit() }, visible: saveButton }}
                    action2={{ onClick: saveAndSend, title: 'Chốt đơn', icon: <CheckOutlined className='context-menu-button-icon' />, visible: sendButton }}
                />

            </Form>

        </div >
    )
}


/////////////////////////////////////////////
// Export's

export default ObjectEditPage