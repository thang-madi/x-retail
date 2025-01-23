import { useDispatch, useSelector } from "react-redux"
import { getXTSSlice } from "../data-storage/xts-mappings"
import { useCallback, useState } from "react"
import debounce from "lodash.debounce"
import { XTSListFilterItem, XTSListSortItem } from "../data-storage/interfaces"
import { Form } from "antd"

interface UseListSettingsParams {
    dataType: string
    initFilterData: (filter: XTSListFilterItem[]) => any
    initSortData: (sortBy: XTSListSortItem[]) => any
}

const useListSettings = (params: UseListSettingsParams) => {

    const { dataType, initFilterData, initSortData } = params

    const dispatch = useDispatch()

    const { sliceName, actions } = getXTSSlice('XTSOrder')
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

    interface FilterItem {
        key: string
        value: any
    }

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

    const [filterData, setFilterData] = useState(initFilterData(filter))

    /////////////////////////////////////////////
    // Sort

    interface SortItem {
        key: string,
        descending: boolean,
    }

    // const initSortData = (sortBy: any[]): { [key: string]: any } => {
    //     return sortBy.reduce((item: any, { key, descending }: SortItem) => {
    //         item[key] = descending
    //         return item
    //     }, {})
    //     // return tempSortBy
    // }

    const [sortData, setSortData] = useState(initSortData(sortBy))

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

    const filterItemOnChange = (itemName: string) => {
        form.setFieldValue(itemName + 'Checkbox', true)
        applyFilterItem(itemName)
        // console.log('filterItemOnChange', itemName, filterData)
    }

    const filterCheckboxOnChange = (itemName: string) => {
        applyFilterItem(itemName)
        // console.log('filterCheckboxOnChange', itemName, filterData)
    }

    const applyFilterItem = (itemName: string) => {
        const { actions } = getXTSSlice('XTSOrder')
        const checkbox = form.getFieldValue(itemName + 'Checkbox')
        const filterItemValue = { ...filterData[itemName] }
        if (checkbox) {
            dispatch(actions.setFilterItem({ key: itemName, value: filterItemValue }))
        } else {
            dispatch(actions.deleteFilterItem({ key: itemName }))
        }
    }

    /////////////////////////////////////////////
    // Sort onChange

    const sortItemOnClick = (itemName: string) => {
        sortData[itemName] = !sortData[itemName]
        applySortItem(itemName)
        // console.log('sortItemOnClick', itemName, sortData)
    }

    const applySortItem = (itemName: string) => {
        const { actions } = getXTSSlice('XTSOrder')
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

    return { searchString, form, toggleSearchInput, toggleFilter, handleSearch, filterItemOnChange, filterCheckboxOnChange, sortItemOnClick }
}