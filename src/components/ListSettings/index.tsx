/////////////////////////////////////////////
// Standard's

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Form, Input, InputNumber, Button, Modal, Flex, Switch, DatePicker, Select, FormInstance, Card } from 'antd'
import { FilterOutlined, PicCenterOutlined, SearchOutlined, SettingOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import debounce from 'lodash.debounce'

/////////////////////////////////////////////
// Application's

import { createXTSObject, getXTSEnum } from '../../data-objects/common-use'
import { XTSItemValue } from '../../data-objects/types-form'
import ChoicePage from '../../hocs/ChoicePage'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectionRange } from '@testing-library/user-event/dist/utils'

/////////////////////////////////////////////
// Object's

import './index.css'
import { TWA } from '../../commons/telegram'
import { XTSListFilterItem, XTSListSortItem } from '../../data-storage/interfaces'

/////////////////////////////////////////////
// Main's

export interface XTSListSettingsProps {
    // searchString: string
    // setSearchString: any
    dataType: string
    filterData: { [key: string]: any }
    sortData: { [key: string]: any }
    children: React.ReactElement | React.ReactElement[]
    // itemProps?: any
    // inputProps?: any
}

// OK
const ListSettings: React.FC<XTSListSettingsProps> = (props) => {

    const { dataType, filterData, sortData, children } = props

    const dispatch = useDispatch()

    const { sliceName, actions } = getXTSSlice(dataType)
    const { searchString, filter, sortBy } = useSelector((state: any) => state[sliceName])

    const handleDebouncedSearch = useCallback(
        debounce((value: string) => {
            dispatch(actions.setSearchString({ searchString: value }))
        }, 500), // 500ms
        []
    )

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleDebouncedSearch(e.target.value)
    }

    /////////////////////////////////////////////
    // Filter

    // interface FilterItem {
    //     key: string
    //     value: any
    // }

    // const initFilterData = (filter: any[]): { [key: string]: any } => {
    //     const filterData = {
    //         orderState: getXTSEnumItem('XTSSalesOrderState', 'ToPrepay') as XTSObjectId,
    //         orderStateCheckbox: false,
    //     }
    //     const tempFilter = filter.reduce((item: any, { key, value }: FilterItem) => {
    //         item[key] = value
    //         filterData.orderStateCheckbox = true
    //         return item
    //     }, {})

    //     return Object.assign(filterData, tempFilter)
    // }

    // const [filterData, setFilterData] = useState(initFilterData(filter))

    /////////////////////////////////////////////
    // Sort

    // interface SortItem {
    //     key: string,
    //     descending: boolean,
    // }

    // const initSortData = (sortBy: any[]): { [key: string]: any } => {
    //     return sortBy.reduce((item: any, { key, descending }: SortItem) => {
    //         item[key] = descending
    //         return item
    //     }, {})
    //     // return tempSortBy
    // }

    // const [sortData, setSortData] = useState(initSortData(sortBy))

    /////////////////////////////////////////////
    // Visiblility

    const [searchVisible, setSearchVisible] = useState(true)
    const [filterVisible, setFilterVisible] = useState(false)

    const toggleSearchInput = () => {
        if (filterVisible) {
            setFilterVisible(false)
        } else {
            setSearchVisible(!searchVisible)
        }
    }
    const toggleFilter = () => {
        setSearchVisible(!filterVisible)
        setFilterVisible(!filterVisible)
    }

    /////////////////////////////////////////////
    // Filter onChange

    // const filterItemOnChange = (itemName: string) => {
    //     form.setFieldValue(itemName + 'Checkbox', true)
    //     applyFilterItem(itemName)
    //     // console.log('filterItemOnChange', itemName, filterData)
    // }

    // const filterCheckboxOnChange = (itemName: string) => {
    //     applyFilterItem(itemName)
    //     // console.log('filterCheckboxOnChange', itemName, filterData)
    // }

    // const applyFilterItem = (itemName: string) => {
    //     const { actions } = getXTSSlice(dataType)
    //     const checkbox = form.getFieldValue(itemName + 'Checkbox')
    //     const filterItemValue = { ...filterData[itemName] }
    //     if (checkbox) {
    //         dispatch(actions.setFilterItem({ key: itemName, value: filterItemValue }))
    //     } else {
    //         dispatch(actions.deleteFilterItem({ key: itemName }))
    //     }
    // }

    /////////////////////////////////////////////
    // Sort onChange

    // const sortItemOnClick = (itemName: string) => {
    //     sortData[itemName] = !sortData[itemName]
    //     applySortItem(itemName)
    //     // console.log('sortItemOnClick', itemName, sortData)
    // }

    // const applySortItem = (itemName: string) => {
    //     const { actions } = getXTSSlice(dataType)
    //     dispatch(actions.setSortItem({ key: itemName, descending: sortData[itemName] }))
    // }

    /////////////////////////////////////////////
    // Form

    // const [form] = Form.useForm()

    /////////////////////////////////////////////
    //

    return (
        <div className={'list-settings' + (TWA.isFullscreen && ' list-settings-fullscreen' || '')} >

            <div
                className={filterVisible && 'list-settings-panel' || ' list-settings-panel-hidden'}
                onClick={toggleSearchInput}
            />

            <div className='list-settings-search-group'>


                <Input.Search
                    className={searchVisible && 'list-settings-search-input' || ' list-settings-search-input-hidden'}
                    placeholder='Tìm kiếm...'
                    enterButton={false}
                    allowClear
                    defaultValue={searchString}
                    // prefix={<SearchOutlined className='list-search-icon' />}
                    onChange={handleSearch}
                />
                <Button
                    className='list-settings-button'
                    icon={<SearchOutlined />}
                    onClick={toggleSearchInput}
                />
                <Button
                    className='list-settings-button'
                    icon={<SettingOutlined />}
                    onClick={toggleFilter}
                />
            </div>
            <div className={filterVisible && 'list-settings-filter-group' || ' list-settings-filter-group-hidden'}>
                {children}
            </div>

        </div >
    )
}

export { ListSettings }
