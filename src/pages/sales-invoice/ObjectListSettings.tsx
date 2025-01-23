/////////////////////////////////////////////
// Standard's

import React, { useState, useCallback, useEffect } from 'react'
import { Form, Input, Button, Card, Checkbox } from 'antd'
import { SearchOutlined, SettingOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import debounce from 'lodash.debounce'

/////////////////////////////////////////////
// Application's

import { createXTSObject, getXTSEnum, getXTSEnumItem } from '../../data-objects/common-use'
import { XTSItemValue } from '../../data-objects/types-form'
import ChoicePage from '../../hocs/ChoicePage'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectionRange } from '@testing-library/user-event/dist/utils'

/////////////////////////////////////////////
// Object's

// import { TWA } from '../../commons/telegram'
// import FormItem from 'antd/es/form/FormItem'
import { FormSelect } from '../../components/FormItems'
// import { XTSSalesOrderState } from '../../data-objects/types-enums'
import { XTSObjectId } from '../../data-objects/types-common'
import { ListSettings } from '../../components/ListSettings'
import { dataType } from './'

import './index.css'

/////////////////////////////////////////////
// Main's

// OK
const ObjectListSettings: React.FC<any> = (props) => {

    // const { dataType, itemProps, inputProps } = props

    const dispatch = useDispatch()

    // const dataType = 'XTSSalesInvoice'
    const { sliceName, actions } = getXTSSlice(dataType)
    const { filter, sortBy } = useSelector((state: any) => state[sliceName])

    /////////////////////////////////////////////
    // Filter

    interface FilterItem {
        key: string
        value: any
    }

    const initFilterData = (filter: any[]): { [key: string]: any } => {
        // Cần xem lại
        const filterData = {
            orderState: getXTSEnumItem('XTSSalesOrderState', 'ToPrepay') as XTSObjectId,
            orderStateCheckbox: false,
        }
        const tempFilter = filter.reduce((item: any, { key, value }: FilterItem) => {
            item[key] = value
            filterData.orderStateCheckbox = true
            return item
        }, {})

        return Object.assign(filterData, tempFilter)
    }

    const [filterData, setFilterData] = useState(initFilterData(filter))

    /////////////////////////////////////////////
    // Sort

    interface SortItem {
        key: string,
        descending: boolean,
    }

    const initSortData = (sortBy: any[]): { [key: string]: any } => {
        return sortBy.reduce((item: any, { key, descending }: SortItem) => {
            item[key] = descending
            return item
        }, {})
    }

    const [sortData, setSortData] = useState(initSortData(sortBy))

    /////////////////////////////////////////////
    // Filter

    const filterItemOnChange = (itemName: string) => {
        form.setFieldValue(itemName + 'Checkbox', true)
        applyFilterItem(itemName)
    }

    const filterCheckboxOnChange = (itemName: string) => {
        applyFilterItem(itemName)
    }

    const applyFilterItem = (itemName: string) => {
        const { actions } = getXTSSlice(dataType)
        const checkbox = form.getFieldValue(itemName + 'Checkbox')
        const filterItemValue = { ...filterData[itemName] }
        if (checkbox) {
            dispatch(actions.setFilterItem({ key: itemName, value: filterItemValue }))
        } else {
            dispatch(actions.deleteFilterItem({ key: itemName }))
        }
    }

    /////////////////////////////////////////////
    // Sort

    const sortItemOnClick = (itemName: string) => {
        sortData[itemName] = !sortData[itemName]
        applySortItem(itemName)
    }

    const applySortItem = (itemName: string) => {
        const { actions } = getXTSSlice(dataType)
        dispatch(actions.setSortItem({ key: itemName, descending: sortData[itemName] }))
    }

    /////////////////////////////////////////////
    // Form

    const [form] = Form.useForm()
    const commonItemProps = {
        dataObject: filterData,
        form: form,
    }

    /////////////////////////////////////////////
    //

    return (
        <ListSettings
            dataType={dataType}
            filterData={filterData}
            sortData={sortData}
        >

            <Form form={form}>

                <Card className='list-settings-card' title='Lọc' >
                    <div className='list-settings-filter-item'>
                        <Form.Item
                            name='orderStateCheckbox'
                            valuePropName='checked'
                        >
                            <Checkbox
                                defaultChecked={filterData.orderStateCheckbox}
                                onChange={() => filterCheckboxOnChange('orderState')}
                            />
                        </Form.Item>
                        <FormSelect
                            itemName='orderState'
                            dataType='XTSSalesOrderState'
                            itemProps={{
                                className: 'list-settings-filter-item-label',
                                // label: 'Trạng thái đơn hàng',
                                required: false,
                                labelCol: { span: 4 },
                            }}
                            selectProps={{
                                className: 'list-settings-filter-item-value',
                                required: false,
                                onChange: () => filterItemOnChange('orderState')
                            }}
                            {...commonItemProps}
                        />
                    </div>
                </Card>

                <Card
                    className='list-settings-card'
                    title='Sắp xếp'
                >
                    <div className='list-settings-sort-item'>
                        <div className='list-settings-sort-item-label'>Theo ngày</div>
                        <Button
                            className={'list-settings-sort-item-direction'}
                            icon={sortData.date && <SortDescendingOutlined /> || <SortAscendingOutlined />}
                            onClick={() => sortItemOnClick('date')}
                        />
                    </div>
                </Card>
            </Form>

        </ListSettings >
    )
}

export default ObjectListSettings
