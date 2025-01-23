/////////////////////////////////////////////
// Standard's

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

/////////////////////////////////////////////
// Application's

import { useGetObjectList, UseGetObjectListParams, useOpenPage, UseOpenPageParams } from '../../hooks/usePage'
import { ITEM_VALUE_ACTIONS, XTSObjectListProps } from '../../data-objects/types-components'
import { REQUEST_STATUSES } from '../../commons/enums'
import { createXTSObject } from '../../data-objects/common-use'
import { BottomBar, } from '../../components/ContextMenu'
import { VirtualGrid } from '../../components/Virtualized'
import { Loader } from '../../components/Loader'

/////////////////////////////////////////////
// Object's

import ObjectCard from './ObjectCard'
import ObjectListSettings from './ObjectListSettings'
import { dataType } from './'

import './index.css'

/////////////////////////////////////////////
// Main component

// OK
const ObjectListPage: React.FC<XTSObjectListProps> = (props) => {

    const { user } = useSelector((state: any) => state.session)

    // const dataType = 'XTSProduct'
    const requestParams = { limit: 50 }   // Tham số trong requestObject

    const getObjectListParams: UseGetObjectListParams = {
        dataType,
        objectIds: props.objectIds,
        requestParams,
        download: true,
    }
    const { dataList, status, refreshList, loadMore } = useGetObjectList(getObjectListParams)

    const newItem = () => {
        if (props.choiceItemValue) {
            const itemValue = createXTSObject('XTSItemValue', { action: ITEM_VALUE_ACTIONS.EDIT })
            props.choiceItemValue(itemValue)
            // console.log('itemValue', itemValue)
        } else {
            // setSearchParams({ edit: true })
        }
    }

    const openPageParams: UseOpenPageParams = {
        pageId: props.pageId,
        pageName: dataType,
        pageTitle: 'Danh sách sản phẩm',
        renderKey: props.renderKey
    }
    useOpenPage(openPageParams)

    const renderItem = (item: any) => {

        return (
            <ObjectCard
                item={item}
                itemName={props.itemName}
                choiceItemValue={props.choiceItemValue}
                additionals={user}
            // setItemValue={props.setItemValue}
            // initialItemValue={props.initialItemValue}
            />
        )
    }

    /////////////////////////////////////////////
    // Main component

    const listGrid = {
        gutter: 16,
        xs: 2,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 6,
        xxl: 9,
    }

    /////////////////////////////////////////////
    // Main component

    return (
        <div className='product-list'>

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <ObjectListSettings />

            <VirtualGrid
                dataType={dataType}
                items={dataList}
                renderItem={renderItem}
                rowHeight={330}
                listGrid={listGrid}
                itemName={props.itemName}
            // loadMore={loadMore}
            // choiceItemValue={props.choiceItemValue}  // Không cần
            />

            <BottomBar
                stepBack={{ onClick: props.stepBack, visible: Boolean(props.stepBack) }}
                refresh={{ onClick: refreshList, }}
                newItem={{ onClick: newItem, visible: (user) }}
            />

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default ObjectListPage