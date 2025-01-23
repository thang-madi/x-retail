/////////////////////////////////////////////
// Standard's

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'

/////////////////////////////////////////////
// Application's

// import { setPageInfo } from '../data-storage/slice-current'
// import { compareValues, createRequestDataByDataItem, newItemValue, xtsObjectToFormData } from '../data-exchange/common-use'
// import { generateUUID } from '../commons/common-use'
// import { createXTSObject } from '../data-exchange/objects'
// import { DEBUG, PAGE_ITEMS } from '../commons/constants'
// import xtsSlice from '../data-storage/slice-xts'
// import { getXTSSlice } from '../data-storage/slice-xts'
import { requestData_SaveRecord, requestData_SaveRecordSet } from '../data-objects/request-data'
import { RootState } from '../data-storage'
import { compareXTSValues, createXTSObject } from '../data-objects/common-use'
import { getXTSSlice } from '../data-storage/xts-mappings'

/////////////////////////////////////////////
// Object's

// import { apiRequest, actions } from '../data-storage/slice-carts'
import { XTSCart, XTSProduct } from '../data-objects/types-application'
import { fillDefaultValues } from '../data-objects/default-values'
import debounce from 'lodash.debounce'
import { notification } from 'antd'
// import { fillDefaultValues } from '../data-objects/default-values'


/////////////////////////////////////////////
// useHook: SaveCart

export function useSaveCart() {

    const dispatch = useDispatch()

    // const defaultValues = useSelector((state: RootState) => state.session.defaultValues)
    const externalAccount = useSelector((state: RootState) => state.session.externalAccount)
    const dimensions = useSelector((state: RootState) => state.carts.dimensions)

    /////////////////////////////////////////////
    // saveCart

    const saveCart = (cartItem: XTSCart, append: boolean) => {

        const dataType = 'XTSCart'

        // console.log('cartItem', cartItem)
        // console.log('defaultValues', defaultValues)
        // console.log('isEmptyObjectId(cartItem.externalAccount) ', isEmptyObjectId(cartItem.externalAccount))

        const filter = createXTSObject('XTSRecordFilter')
        // filter.addFilterItem('externalAccount', isEmptyObjectId(cartItem.externalAccount) && externalAccount || cartItem.externalAccount)
        // filter.addFilterItem('company', isEmptyObjectId(cartItem.company) && defaultValues?.company || cartItem.company)
        // filter.addFilterItem('customer', isEmptyObjectId(cartItem.customer) && defaultValues?.customer || cartItem.customer)
        filter.addFilterItem('externalAccount', cartItem.externalAccount)
        filter.addFilterItem('company', cartItem.company)
        filter.addFilterItem('customer', cartItem.customer)
        filter.addFilterItem('product', cartItem.product)
        filter.addFilterItem('characteristic', cartItem.characteristic)
        filter.addFilterItem('uom', cartItem.uom)
        // filter.addFilterItem('vatRate', cartItem.vatRate)

        // console.log('filter:', filter)

        const newRecord = createXTSObject(dataType)
        newRecord.externalAccount = filter.externalAccount
        newRecord.company = filter.company
        newRecord.customer = filter.customer
        newRecord.product = filter.product
        newRecord.characteristic = filter.characteristic
        newRecord.uom = filter.uom
        newRecord.vatRate = cartItem.vatRate
        newRecord.quantity = cartItem.quantity
        newRecord.price = cartItem.price
        newRecord.coefficient = cartItem.coefficient
        newRecord.total = cartItem.total
        newRecord.date = cartItem.date || dayjs().format('YYYY-MM-DDTHH:mm:ss')
        newRecord.selected = cartItem.selected

        // console.log('newRecord:', newRecord)

        // console.log('recordItem:', recordItem)
        // console.log('append:', append)

        const recordSet = createXTSObject('XTSRecordSet', { dataType, filter, records: [newRecord] })
        if (append) {
            recordSet['_extraData_'] = { append }
        }

        const { apiRequest, actions } = getXTSSlice(dataType)

        // const requestData = requestData_SaveRecordSet(dataType, [newRecord], filter)

        // const dimensions = []
        // for (let dimension in filter) {
        //     if (dimension !== '_type') {
        //         dimensions.push(dimension)
        //     }
        // }        
        const requestData = requestData_SaveRecord(newRecord, dimensions)

        dispatch(actions.setTemp(null))
        dispatch(apiRequest(requestData))

        console.log('requestData:', requestData)
    }

    /////////////////////////////////////////////
    // saveCarts

    const saveCarts = (cartItems: XTSCart[]) => {

        const dataType = 'XTSCart'

        // const defaultValues = useSelector((state: RootState) => state.session.defaultValues)
        // const externalAccount = useSelector(state => state.session.externalAccount)

        const records = []
        for (let cartItem of cartItems) {

            // if (cartItem.externalAccount && !compareXTSValues(cartItem.externalAccount, externalAccount)) {
            //     continue
            // }
            if (cartItem.externalAccount && compareXTSValues(cartItem.externalAccount, externalAccount) !== 0) {
                continue
            }

            const recordItem = createXTSObject(dataType)
            // recordItem.externalAccount = cartItem.externalAccount || externalAccount
            // recordItem.company = cartItem.company || (defaultValues as any).company
            // recordItem.customer = cartItem.customer || (defaultValues as any).customer
            recordItem.externalAccount = cartItem.externalAccount
            recordItem.company = cartItem.company
            recordItem.customer = cartItem.customer
            recordItem.product = cartItem.product
            recordItem.characteristic = cartItem.characteristic
            recordItem.uom = cartItem.uom
            recordItem.quantity = cartItem.quantity
            recordItem.price = cartItem.price
            recordItem.coefficient = cartItem.coefficient
            recordItem.total = cartItem.total
            recordItem.date = cartItem.date
            recordItem.selected = cartItem.selected
            // console.log('recordItem:', recordItem)

            records.push(recordItem)
        }

        // const recordSet = createXTSObject('XTSRecordSet')
        // recordSet.dataType = dataType
        // recordSet.filter = filter
        // recordSet.records = records

        const filter = createXTSObject('XTSRecordFilter')
        filter.addFilterItem('externalAccount', externalAccount)
        const requestData = requestData_SaveRecordSet(dataType, records, filter)

        // console.log('requestData:', requestData)
        // console.log('filter:', filter)

        const { apiRequest, actions } = getXTSSlice(dataType)

        dispatch(actions.setTemp(null))
        dispatch(apiRequest(requestData))
    }

    /////////////////////////////////////////////
    // deleteCart

    const deleteCart = (cartItem: XTSCart) => {

        const dataType = 'XTSCart'

        const filter = createXTSObject('XTSRecordFilter')
        filter.addFilterItem('externalAccount', cartItem.externalAccount)
        filter.addFilterItem('company', cartItem.company)
        filter.addFilterItem('customer', cartItem.customer)
        filter.addFilterItem('product', cartItem.product)
        filter.addFilterItem('characteristic', cartItem.characteristic)
        filter.addFilterItem('uom', cartItem.uom)

        const records: XTSCart[] = []
        const requestData = requestData_SaveRecordSet(dataType, records, filter)

        const { apiRequest, actions } = getXTSSlice(dataType)

        console.log('requestData:', requestData)
        dispatch(actions.setTemp(null))
        dispatch(apiRequest(requestData))
    }

    /////////////////////////////////////////////
    // addToCart

    const defaultValues = useSelector((state: RootState) => state.session.defaultValues)

    const addToCart = (product: XTSProduct) => {
        // e.stopPropagation()

        const cartItem = createXTSObject('XTSCart',
            {
                product: product.objectId,
                // characteristic: formData.characteristic,
                uom: product.measurementUnit,
                vatRate: product._vatRate,
                quantity: 1,
                coefficient: 1,
                price: product['_price'],
                amount: product['_price'],
                total: product['_price'],
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
    // saveCart

    return { addToCart, saveCart, saveCarts, deleteCart }
}

