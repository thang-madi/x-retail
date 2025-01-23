/////////////////////////////////////////////
// Standard's

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Form, Input, InputNumber, Button, Modal, Flex, Switch, DatePicker, Select, FormInstance } from 'antd'
import { PicCenterOutlined, SearchOutlined } from '@ant-design/icons'
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

/////////////////////////////////////////////
// Main's

export interface XTSListSearchProps {
    // searchString: string
    // setSearchString: any
    dataType: string
    itemProps?: any
    inputProps?: any
}

// OK
const FormListSearch: React.FC<XTSListSearchProps> = (props) => {

    const { dataType, itemProps, inputProps } = props

    const dispatch = useDispatch()

    const { sliceName, actions } = getXTSSlice(dataType)
    const { searchString } = useSelector((state: any) => state[sliceName])

    const handleDebouncedSearch = useCallback(
        debounce((value: string) => {
            dispatch(actions.setSearchString({ searchString: value }))
        }, 500), // 500ms
        []
    )

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleDebouncedSearch(e.target.value)
    }

    // console.log('FormListSearch.props', props)
    // console.log('FormListSearch.searchText', searchText)
    // console.log('FormListSearch.setSearchText', setSearchText)

    /////////////////////////////////////////////
    // 

    return (
        <div
            className={(TWA.isFullscreen) && 'list-search-item-fullscreen' || 'list-search-item'}
            {...itemProps}
        >
            {/* <Input.Search
                className='list-input-search'
                {...inputProps}
                placeholder="Tìm kiếm"
                allowClear={true}
                onChange={handleSearch}
                // style={{ display: 'flex', justifyContent: 'center', }}
                defaultValue={searchString}
                enterButton={false}
            /> */}

            <Input.Search
                className='list-search-input'
                placeholder='Tìm kiếm...'
                enterButton={false}
                allowClear
                defaultValue={searchString}
                prefix={<SearchOutlined className='list-search-icon' />}
                onChange={handleSearch}
            />
        </div >
    )
}

export { FormListSearch }
