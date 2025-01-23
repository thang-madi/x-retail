/////////////////////////////////////////////
// Standard's

import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Space, Card, List, Image, Skeleton, notification } from 'antd'
import { SelectOutlined, ShoppingCartOutlined } from '@ant-design/icons'
// import { LazyLoadImage } from 'react-lazy-load-image-component'
// import debounce from 'lodash.debounce'

/////////////////////////////////////////////
// Application's

// import { createRequestDataByDataItem, newItemValue, xtsObjectToFormData } from '../../data-exchange/common-use'
// import { createXTSObject } from '../../data-exchange/objects'
// import { useSaveFormData } from '../../hooks/use-page'
import { formatCurrency } from '../../commons/common-use'
// import { useSaveCart } from '../../hooks/use-carts'
import { ITEM_VALUE_ACTIONS, XTSObjectCardProps } from '../../data-objects/types-components'
import { XTSCart, XTSProduct } from '../../data-objects/types-application'
import { RootState } from '../../data-storage'
import { createXTSObject } from '../../data-objects/common-use'
import { useSaveCart } from '../../hooks/useCarts'
import debounce from 'lodash.debounce'
import { fillDefaultValues } from '../../data-objects/default-values'

/////////////////////////////////////////////
// Object's

import './index.css'

/////////////////////////////////////////////
// Main component

const ObjectCard: React.FC<XTSObjectCardProps> = (props) => {

    const { item, itemName, additionals } = props
    const formData = item as XTSProduct

    const { user } = useSelector((state: any) => state.session)

    // const dispatch = useDispatch()
    // const formData = xtsObjectToFormData(item)
    // console.log('product.formData', formData)

    const doItem = (action: ITEM_VALUE_ACTIONS): void => {
        if (props.choiceItemValue) {
            const itemValue = createXTSObject('XTSItemValue')
            Object.assign(itemValue, item.objectId)
            itemValue.dataItem = item
            itemValue.action = action
            itemValue.itemName = itemName
            props.choiceItemValue(itemValue)
            // console.log('clickItem.choiceItemValue', itemValue)
            // console.log('clickItem.choiceItemValue', choiceItemValue)
        }
    }

    const clickItem = (e: React.MouseEvent) => {
        e.stopPropagation()
        doItem(ITEM_VALUE_ACTIONS.VIEW)
    }

    const choiceItem = (e: React.MouseEvent) => {
        e.stopPropagation()
        doItem(ITEM_VALUE_ACTIONS.CHOICE)
    }

    /////////////////////////////////////////////
    // Cart

    const defaultValues = useSelector((state: RootState) => state.session.defaultValues)

    const { saveCart } = useSaveCart()
    const addToCart = (e: React.MouseEvent) => {
        e.stopPropagation()

        const cartItem = createXTSObject('XTSCart',
            {
                product: formData.objectId,
                // characteristic: formData.characteristic,
                uom: formData.measurementUnit,
                vatRate: formData._vatRate,
                quantity: 1,
                coefficient: 1,
                price: formData['_price'],
                amount: formData['_price'],
                total: formData['_price'],
            }
        )
        fillDefaultValues(cartItem, defaultValues)
        console.log('product.cartItem', cartItem)

        sendSaveCartRequest(cartItem)
    }

    const sendSaveCartRequest = useCallback(
        debounce((cartItem: XTSCart) => {
            const append = true
            saveCart(cartItem, append)
            openNotification()
        }, 700), // 700ms
        []
    )

    /////////////////////////////////////////////
    // Pictures

    var imageSrc = ''
    const fileStorageURL = useSelector((state: RootState) => state.session.fileStorageURL)
    const picture = formData.picture
    // console.log('item', item)

    if (picture && typeof picture.presentation === 'string') {
        // console.log('picture', picture)
        if (picture.presentation.indexOf(picture.id) !== -1) {
            imageSrc = fileStorageURL + picture.presentation
            // console.log('picture.presentation', picture.presentation)
            // console.log('imageSrc', imageSrc)
        }
    }

    /////////////////////////////////////////////
    // 

    // const displayAddToOrder = (!itemName) && { display: 'none' } || { display: 'block' }
    // const displayAddToCart = (additionals?.userName) && { display: 'none' } || { display: 'block' }

    /////////////////////////////////////////////
    // Notification

    const openNotification = () => {
        notification.open({
            message: 'Chọn hàng vào giỏ',
            description: 'Đã chọn sản phẩm vào giỏ hàng',
            showProgress: true,
            style: {
                width: 400,
            },
        })
    }

    /////////////////////////////////////////////
    // Return

    return (
        <Card
            className='product-card'
            onClick={clickItem}
        >
            <div className='product-card-image' >
                <Image
                    width='100%'
                    height='auto'
                    src={imageSrc}
                    fallback=''
                    preview={false}
                    style={{
                        objectFit: 'cover',
                    }}
                />
            </div>
            <div className='product-card-sku' >
                {formData?.sku}
            </div>

            <div className='product-card-description' >
                {formData?.description}
            </div>

            <div className='product-card-price' >
                {formatCurrency(formData?._price)}
            </div>

            <div className='product-card-button-group' >
                <Button
                    className='product-card-button-choice'
                    htmlType='button'
                    onClick={choiceItem}
                    style={{
                        display: (props.itemName) && 'block' || 'none',
                    }}
                >
                    Chọn
                </Button>
                <Button className='product-card-button-cart'
                    htmlType='button'
                    onClick={addToCart}
                    icon={<ShoppingCartOutlined />}
                    style={{
                        display: (!props.itemName && !user) && 'block' || 'none',
                    }}
                >
                    Vào giỏ hàng
                </Button>
            </div>

            {/* <LazyLoadImage
                alt='Product image'
                width={'100%'}
                height={150}
                src={imageSrc}
                effect='blur' // Hiệu ứng blur khi tải
                // placeholderSrc={imageSrc} // Placeholder trong khi tải
                wrapperClassName='lazy-load-image-wrapper'
                afterLoad={() => console.log('Image loaded')}
            /> */}

        </Card >
    )
}

/////////////////////////////////////////////
// Export's

export default ObjectCard