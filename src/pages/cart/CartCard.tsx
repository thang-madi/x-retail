/////////////////////////////////////////////
// Standard's

import { useCallback, useEffect, useState } from 'react'
import { Form, Button, Space, Card, List, Checkbox, Popconfirm, Image } from 'antd'
import { MinusCircleOutlined, MinusOutlined, PlusCircleOutlined, PlusOutlined, SelectOutlined } from '@ant-design/icons'
import debounce from 'lodash.debounce'


/////////////////////////////////////////////
// Application's

import FormItem from 'antd/es/form/FormItem'
import { createXTSObject } from '../../data-objects/common-use'
import { ITEM_VALUE_ACTIONS, XTSObjectCardProps, XTSObjectIndexProps, XTSRecordCardProps } from '../../data-objects/types-components'

/////////////////////////////////////////////
// Object's

import { useSaveCart } from '../../hooks/useCarts'
import { XTSCart } from '../../data-objects/types-application'
import { useSelector } from 'react-redux'
import { RootState } from '../../data-storage'

import './index.css'

/////////////////////////////////////////////
// Main component

const RecordCard: React.FC<XTSRecordCardProps> = (props) => {

    const { item, itemName, choiceItemValue } = props
    const formData = item as XTSCart
    // const { objectId } = item

    const fileStorageURL = useSelector((state: RootState) => state.session.fileStorageURL)
    var imageSrc = fileStorageURL + formData._picture?.presentation

    // console.log('CartCard', item)
    // const formData = xtsObjectToFormData(item)
    // console.log('item', item)
    // console.log('formData', formData)

    const [quantity, setQuantity] = useState(formData.quantity)
    const [total, setTotal] = useState(formData.total || 0)
    const [selected, setSelected] = useState(formData.selected)
    const [characteristic, setCharacteristic] = useState(formData.characteristic)

    const [openPopConfirm, setOpenPopConfirm] = useState(false)

    const { saveCart, deleteCart } = useSaveCart()

    const handleChangeData = (e: any, { delta, checked, characteristic }: any) => {
        e.stopPropagation()

        const newQuantity = quantity + (delta || 0)
        if (newQuantity <= 0) {
            setOpenPopConfirm(true)
        } else {
            const newSelected = (checked === undefined) && selected || checked
            const newTotal = newQuantity * formData.price * (formData.coefficient || 1)
            const newCharacteristic = (characteristic === undefined) && formData.characteristic || characteristic

            const cartItem = createXTSObject('XTSCart', {
                externalAccount: formData.externalAccount,
                company: formData.company,
                customer: formData.customer,
                product: formData.product,
                characteristic: newCharacteristic,
                uom: formData.uom,
                vatRate: formData.vatRate,
                quantity: newQuantity,
                price: formData.price,
                coefficient: formData.coefficient || 1,
                total: newTotal,
                date: formData.date,
                selected: newSelected,
            })
            sendSaveCartRequest(cartItem)

            setQuantity(newQuantity)
            setTotal(newTotal)
            setSelected(newSelected)
        }
    }

    const sendSaveCartRequest = useCallback(
        debounce((cartItem: XTSCart) => {
            console.log('cartItem', cartItem)
            saveCart(cartItem, false)
        }, 1000), // 1000ms
        []
    )

    const deleteConfirm = (e: any) => {
        e.stopPropagation()
        console.log('deleteConfirm')
        setOpenPopConfirm(false)

        const cartItem = formData
        deleteCart(cartItem)
    }

    const deleteCancel = (e: any) => {
        e.stopPropagation()
        console.log('deleteCancel')
        setOpenPopConfirm(false)
    }

    const clickItem = (e: any) => {
        if (props.itemName && props.choiceItemValue) {

            const filter = createXTSObject('XTSRecordFilter')
            filter.externalAccount = formData.externalAccount
            filter.company = formData.company
            filter.customer = formData.customer
            filter.product = formData.product
            filter.characteristic = formData.characteristic
            filter.uom = formData.uom

            const itemValue = createXTSObject('XTSItemValue')
            itemValue.dataItem = item
            itemValue.action = ITEM_VALUE_ACTIONS.VIEW
            itemValue.filter = filter
            props.choiceItemValue(itemValue)

            console.log('itemValue', itemValue)
        }
    }

    /////////////////////////////////////////////
    // 

    useEffect(() => {
        setQuantity(formData.quantity)
        setTotal(formData.total)
        setSelected(formData.selected)
        setCharacteristic(formData.characteristic)
    }, [formData])

    /////////////////////////////////////////////
    // 

    return (
        <Card
            onClick={clickItem}
            className='cart-item-card'
        >
            <div className='cart-item-card-body' >

                <Checkbox
                    className='cart-item-card-body-checker'
                    name='selected'
                    onClick={(e: any) => handleChangeData(e, { checked: e.target.checked })}
                    checked={selected}
                />
                <div className='cart-item-card-body-image'>
                    <Image
                        className='cart-item-card-body-image-img'
                        width='100%'
                        height='auto'
                        src={imageSrc}
                        fallback=''
                    />
                </div>
                <div className='cart-item-card-body-content'>
                    <div className='cart-item-card-body-content-description'>
                        {formData.product?.presentation}
                    </div>
                    <div className='cart-item-card-body-content-price'>
                        <div>Đơn giá: {formData.price} đồng / {formData.uom?.presentation}</div>
                    </div>
                    <div className='cart-item-card-body-content-quantity' >
                        <span>Số lượng:</span>
                        <Button
                            icon={<MinusOutlined className='cart-item-card-body-content-button-icon' />}
                            onClick={(e: any) => handleChangeData(e, { delta: -1, checked: true })}
                        >
                        </Button>

                        <Popconfirm
                            open={openPopConfirm}
                            title="Xóa bỏ mặt hàng"
                            description="Bạn muốn xóa bỏ mặt hàng này?"
                            onConfirm={deleteConfirm}
                            onCancel={deleteCancel}
                            okText="Có"
                            cancelText="Không"
                        >
                            <div>{quantity}</div>
                        </Popconfirm>

                        <Button
                            icon={<PlusOutlined className='cart-item-card-body-content-button-icon' />}
                            onClick={(e: any) => handleChangeData(e, { delta: 1, checked: true })}
                        >
                        </Button>

                    </div>
                </div>

            </div>

        </Card >
    )
}

/////////////////////////////////////////////
// Export's

export default RecordCard