/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button, Modal, List, Card, Space, FloatButton, Descriptions, Popconfirm, Image } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, CloudUploadOutlined, FileDoneOutlined, MinusCircleOutlined, MinusOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Application's

// import ChoicePage from '../../hocs/choice-page'
import { FormInput, FormSelect } from '../../components/FormItems'
// import { formDataToItemValue, xtsObjectToFormData } from '../../data-exchange/common-use'
import { generateUUID } from '../../commons/common-use'
// import { setPageInfo } from '../../data-storage/slice-current'
// import { RowEditMenu } from '../../components/ContextMenu'
import { XTSObject, XTSObjectId, XTSObjectRow } from '../../data-objects/types-common'
import { XTSObjectRowProps } from '../../data-objects/types-components'
import { XTSOrderProductRow, XTSProduct, XTSProductUOMRow, XTSSupplierInvoice, XTSSupplierInvoiceInventory } from '../../data-objects/types-application'
import { createXTSObject } from '../../data-objects/common-use'
import { useCreatePage, UseCreatePageParams } from '../../hooks/usePage'
import { RootState } from '../../data-storage'
import AmountInput from '../../components/AmountInput'


/////////////////////////////////////////////
// Object's

import './index.css'
import { XTSItemValue } from '../../data-objects/types-form'
import ViewPage from '../../hocs/ViewPage'

/////////////////////////////////////////////
// Main components

// OK
export const ObjectInventoryView: React.FC<any> = (props) => {

    const { dataRow, dataObject, setPageInfo } = props
    // console.log('OrderProductRowCard.dataRow', dataRow)

    const currencyPresentation = dataObject?.documentCurrency?.presentation

    // const editRow = () => {
    //     if (props.openObjectRow) {
    //         props.openObjectRow(dataRow)
    //     }
    // }

    const fileStorageURL = useSelector((state: RootState) => state.session.fileStorageURL)

    const viewProduct = () => {
        setChoiceOpen(true)
    }

    const choiceItemValue = (itemValue: XTSItemValue): void => {
        setPageInfo()
        setChoiceOpen(false)
        // const { itemName } = itemValue
    }

    const [choiceOpen, setChoiceOpen] = useState(false)

    return (
        <Card className='supplier-invoice-inventory-view-card' >

            <div style={{ margin: 10, width: 22, }}>
                #{dataRow._lineNumber}
            </div>

            <div className='supplier-invoice-inventory-view-card-picture' >
                <Image
                    className='supplier-invoice-inventory-view-card-picture-image'
                    width='100%'
                    height='auto'
                    src={fileStorageURL + dataRow._picture?.presentation}
                    fallback=''
                    preview={false}
                    onClick={viewProduct}
                />
            </div>

            <div className='supplier-invoice-inventory-view-card-info' >
                <div className='supplier-invoice-inventory-view-card-info-description'>{dataRow.product?.presentation}</div>
                <div>Đơn giá: {dataRow._price} {currencyPresentation}/chiếc</div>
                <div>Số lượng: {dataRow.quantity} {dataRow.uom?.presentation}</div>
                <div className='supplier-invoice-inventory-view-amount' >
                    <div>Thành tiền: </div>
                    <b>{dataRow.amount?.toLocaleString('vi-VN')} {currencyPresentation}</b>
                </div>
            </div>

            <ViewPage
                modalProps={{
                    centered: true,
                    title: 'Xem sản phẩm',
                    open: choiceOpen,
                    footer: []
                }}
                // itemName='product'
                dataType='XTSProduct'
                id={dataRow.product.id}
                choiceItemValue={choiceItemValue}
            />

        </Card >
    )
}

// 
export const ObjectInventoryEdit: React.FC<XTSObjectRowProps> = (props) => {

    const dataRow = props.dataRow as XTSSupplierInvoiceInventory
    const currencyPresentation = (props.dataObject as XTSSupplierInvoice)?.documentCurrency?.presentation

    const fileStorageURL = useSelector((state: RootState) => state.session.fileStorageURL)

    // console.log('OrderProductRowEdit.props', props)

    // const [pageId] = useState(generateUUID())
    // const dispatch = useDispatch()

    const tabName = 'inventory'

    // const [quantity, setQuantity] = useState<number>(dataRow.quantity)
    const [amount, setAmount] = useState<number>(dataRow.amount)
    const [total, setTotal] = useState<number>(dataRow.total)
    const [uom, setUOM] = useState<XTSObjectId>(dataRow.uom)
    const [characteristic, setCharacteristic] = useState<XTSObjectId>(dataRow.characteristic)
    // const [renderKey, setRenderKey] = useState<number>(0)

    const [productData, setProductData] = useState<XTSProduct>(useSelector((state: any) =>
        state.products.objects.find((item: XTSObject) => item.objectId.id === dataRow.product.id)
    ))

    const [_uoms, setUOMs] = useState<XTSProductUOMRow[]>()
    const [uomOptions, setUOMOptions] = useState<XTSObjectId[]>()

    useEffect(() => {
        if (productData && productData?._uoms.length > 0) {
            setUOMs(productData?._uoms)
            const _uomOptions = productData?._uoms?.map(item => item.uom as XTSObjectId)
            setUOMOptions(_uomOptions)
            // console.log('_uomOptions 1', _uomOptions)
        } else {
            const _uomOptions = [dataRow?.uom]
            setUOMOptions(_uomOptions)
            // console.log('_uomOptions 2', _uomOptions)
        }
    }, [productData])

    // console.log('uomOptions', uomOptions)
    // console.log('productData', productData)

    /////////////////////////////////////////////
    // Change dataRow

    // interface _ChangeData {
    //     delta?: number
    //     characteristic?: XTSObjectId
    //     uom?: XTSObjectId
    // }

    // const handleChangeData = (e: any, newData: _ChangeData) => {
    //     e.stopPropagation()
    //     changeRowData(newData)
    // }

    interface NewData {
        quantity?: number
        _price?: number
        characteristic?: XTSObjectId
        uom?: XTSObjectId
    }

    const changeRowData = (newData: NewData): void => {

        const { quantity = dataRow.quantity, _price = dataRow._price, characteristic = dataRow.characteristic, uom } = newData

        const newQuantity = quantity || dataRow.quantity
        if (newQuantity === 0) {
            setOpenPopConfirm(true)
        } else {

            let _coefficient = dataRow._coefficient
            if (uom) {
                const _uomRow = _uoms?.find((item: XTSProductUOMRow) => item.uom?.id === uom.id)
                _coefficient = _uomRow?.coefficient || 1
            }
            const price = _price * _coefficient

            const newRow = {
                ...dataRow,
                characteristic: characteristic,
                uom: dataRow.uom,
                quantity: quantity,
                price: price,
                amount: quantity * price,
                total: quantity * price,
                _coefficient: _coefficient,
                _price: _price,
            }

            const newDataRow = createXTSObject('XTSSupplierInvoiceInventory', newRow)
            props.updateRow(tabName, newDataRow)
        }
    }
    // const changeRowData = (newData: _ChangeData): void => {

    //     const { delta, characteristic, uom } = newData

    //     const newQuantity = quantity + (delta || 0)
    //     if (newQuantity <= 0) {
    //         setOpenPopConfirm(true)
    //     } else {

    //         const newRow = {
    //             ...dataRow,
    //             characteristic: characteristic || dataRow.characteristic,
    //             uom: dataRow.uom,
    //             quantity: newQuantity,
    //             price: dataRow.price,
    //             amount: newQuantity * dataRow.price,
    //             total: newQuantity * dataRow.price,
    //             _coefficient: dataRow._coefficient,
    //         }

    //         if (uom) {
    //             const _uomRow = _uoms?.find((item: XTSProductUOMRow) => item.uom?.id === uom.id)
    //             newRow._coefficient = _uomRow?.coefficient || 1
    //             newRow.price = dataRow._price * newRow._coefficient
    //             newRow.amount = dataRow.quantity * newRow.price
    //             newRow.total = newRow.amount
    //         }

    //         const newDataRow = createXTSObject('XTSOrderProductRow', newRow)
    //         props.updateRow(tabName, newDataRow)

    //     }
    // }

    const uomOnChange = (data: any) => {
        console.log('uomOnChange', data)
        changeRowData({ uom: data })
    }

    const [openPopConfirm, setOpenPopConfirm] = useState(false)

    /////////////////////////////////////////////
    // Row deletion

    const deleteConfirm = (e: any) => {
        console.log('deleteConfirm')
        e.stopPropagation()
        setOpenPopConfirm(false)

        props.deleteRow(tabName, dataRow._lineNumber)
    }

    const deleteCancel = (e: any) => {
        console.log('deleteCancel')
        e.stopPropagation()
        setOpenPopConfirm(false)
    }

    /////////////////////////////////////////////
    // 

    // useEffect(() => {
    //     // setQuantity(dataRow.quantity)
    //     setAmount(dataRow.amount)
    //     setTotal(dataRow.total)
    //     setUOM(dataRow.uom)
    //     setCharacteristic(dataRow.characteristic)
    // }, [dataRow])

    /////////////////////////////////////////////
    // 

    return (
        <div className='supplier-invoice-inventory-edit'>
            <Card className='supplier-invoice-inventory-edit-card'>
                <div style={{ margin: 10, width: 22, }}>
                    <Popconfirm
                        title='Xóa bỏ mặt hàng đã chọn'
                        description='Bạn muốn thực sự xóa bỏ dòng này?'
                        open={openPopConfirm}
                        onConfirm={deleteConfirm}
                        onCancel={deleteCancel}
                        okText='Đồng ý'
                        cancelText='Không'
                    >
                        #{dataRow._lineNumber}
                    </Popconfirm>
                </div>

                <div className='supplier-invoice-inventory-edit-card-picture'>
                    <Image
                        className='supplier-invoice-inventory-edit-card-picture-image'
                        width='100%'
                        height='auto'
                        src={fileStorageURL + dataRow._picture?.presentation}
                        fallback=''
                    />
                </div>

                <div className='supplier-invoice-inventory-edit-card-info'>
                    <div className='product-row-edit-card-info-description'>
                        {`${dataRow.product?.presentation} ${dataRow._sku}`}
                    </div>

                    <div className='supplier-invoice-inventory-edit-quantity'>

                        {/* <div>
                            <div className='supplier-invoice-inventory-edit-quantity-title-short'>SL: </div>
                            <div className='supplier-invoice-inventory-edit-quantity-title-long'>Số lượng: </div>
                        </div> */}

                        <div className='supplier-invoice-inventory-edit-quantity-group'>

                            <FormSelect
                                itemName='uom'
                                prefix={dataRow._lineNumber.toString()}
                                dataType='XTSObjectId'
                                options={uomOptions}
                                itemProps={{
                                    // label: 'Đơn vị tính',
                                    required: false,
                                    className: 'supplier-invoice-inventory-edit-uom'
                                }}
                                selectProps={{
                                    placeholder: 'Chọn đơn vị tính',
                                    required: true,
                                    onChange: uomOnChange
                                }}
                                form={props.form}
                                dataObject={dataRow}
                            />
                        </div>
                        <AmountInput
                            dataObject={dataRow}
                            itemName='quantity'
                            min={0}
                            // max={dataRow.amount}
                            title='Nhập số lượng'
                            description=''
                            // renderKey={renderKey}
                            onChange={(quantity) => changeRowData({ quantity })}
                        />

                    </div>

                    <div className='supplier-invoice-inventory-edit-price'>

                        <div>{`Đơn giá (${currencyPresentation}/c.):`}</div>
                        <AmountInput
                            dataObject={dataRow}
                            itemName='_price'
                            min={0}
                            // max={dataRow.amount}
                            title='Nhập đơn giá (chiếc)'
                            description=''
                            // renderKey={renderKey}
                            onChange={(_price) => changeRowData({ _price })}
                        />
                    </div>

                    <div className='supplier-invoice-inventory-edit-amount'>
                        <div>Thành tiền: </div>
                        <b>{dataRow.amount?.toLocaleString('vi-VN')} {currencyPresentation}</b>
                    </div>
                </div>

                {/* <div>Hệ số: {dataRow._coefficient}</div>
                <div>Thuế suất GTGT: {dataRow.vatRate?.presentation}</div>
                <div>Giá trị thuế suất: {dataRow._vatRateRate}</div>
                <div>Thuế GTGT: {dataRow.vatAmount}</div>
                <div>Chiết khấu tự động: {dataRow.automaticDiscountAmount}</div>
                <div>Chiết khấu thủ công: {dataRow.discountsMarkupsAmount}</div>
                <div>Đơn vị tính: {dataRow.uom?.presentation}</div> */}

            </Card >
        </div >
    )
}

/////////////////////////////////////////////
// Export's

