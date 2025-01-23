/////////////////////////////////////////////
// Standard's

import { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Button, Space, List, Input, FloatButton } from 'antd'
import { DownloadOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Application's

import { useGetDataList, UseGetDataListParams, useGetObjectList, UseGetObjectListParams, useOpenPage, UseOpenPageParams } from '../../hooks/usePage'
// import { FormListSearch } from '../../components/form-items'

/////////////////////////////////////////////
// Object's

// import { load, apiRequest, setTemp } from '../../data-storage/slice-uom-classifier'
// import UOMClassifierCard from './UOMClassifierCard'
import { ITEM_VALUE_ACTIONS, XTSObjectListProps } from '../../data-objects/types-components'
import { createXTSObject } from '../../data-objects/common-use'
import { BottomBar } from '../../components/ContextMenu'
import { XTSObject } from '../../data-objects/types-common'
import { REQUEST_STATUSES } from '../../commons/enums'
import { Loader } from '../../components/Loader'
import { UOMClassifierListSettings } from './ObjectListSettings'
import UOMClassifierCard from './ObjectCard'
import { dataType } from './'
import './index.css'

/////////////////////////////////////////////
// Main component

// OK
const UOMClassifierListPage: React.FC<XTSObjectListProps> = (props) => {

    // const dataType = 'XTSUOMClassifier'
    const requestParams = { limit: 50 }   // Tham số trong requestObject

    // const getDataListParams: UseGetDataListParams = {
    //     dataType,
    //     requestParams,
    //     // classType: 'object',
    // }
    // const { dataList, refreshList, loadMore } = useGetDataList(getDataListParams)

    const getObjectListParams: UseGetObjectListParams = {
        dataType,
        requestParams,
        download: false,
    }
    const { dataList, status, refreshList, loadMore } = useGetObjectList(getObjectListParams)

    const newItem = () => {
        if (props.choiceItemValue) {
            const itemValue = createXTSObject('XTSItemValue', { action: ITEM_VALUE_ACTIONS.EDIT })
            console.log('itemValue', itemValue)
            props.choiceItemValue(itemValue)
        } else {
            // setSearchParams({ edit: true })
        }
    }

    const openPageParams: UseOpenPageParams = {
        pageId: props.pageId,
        pageName: dataType,
        pageTitle: 'Danh sách đơn vị tính',
        renderKey: props.renderKey
    }
    useOpenPage(openPageParams)

    /////////////////////////////////////////////
    // 

    const listGrid = {
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 3,
        xxl: 4,
    }

    /////////////////////////////////////////////
    // 

    return (
        <div className='uom-classifier-list'>

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <UOMClassifierListSettings />

            <List
                grid={listGrid}
                dataSource={dataList}
                renderItem={(item: XTSObject) => (
                    <List.Item>
                        <UOMClassifierCard
                            item={item}
                            itemName={props.itemName}
                            choiceItemValue={props.choiceItemValue}
                        // initialItemValue={props.initialItemValue}
                        // stepBack={props.stepBack}
                        />
                    </List.Item>
                )}
            />

            <BottomBar
                stepBack={{ onClick: props.stepBack, visible: Boolean(props.stepBack) }}
                refresh={{ onClick: refreshList, }}
                newItem={{ onClick: newItem }}
            />

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default UOMClassifierListPage
