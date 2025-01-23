/////////////////////////////////////////////
// Standard's

import { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Button, Space, List, Input, FloatButton } from 'antd'
import { EditOutlined, PlusCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Application's

import { useGetDataList, UseGetDataListParams, useGetObjectList, UseGetObjectListParams, useOpenPage, UseOpenPageParams } from '../../hooks/usePage'
import { BottomBar, TopBar, } from '../../components/ContextMenu'
import { FormListSearch } from '../../components/ListSearch'
import { VirtualGrid } from '../../components/Virtualized'
import { RootState } from '../../data-storage'
import { createXTSObject } from '../../data-objects/common-use'
import { ITEM_VALUE_ACTIONS, XTSObjectListProps } from '../../data-objects/types-components'
import { REQUEST_STATUSES } from '../../commons/enums'
import { Loader } from '../../components/Loader'
import { COMPARISION_OPERATORS, XTSCondition, XTSObjectId } from '../../data-objects/types-common'

/////////////////////////////////////////////
// Object's

import ObjectCard from './ObjectCard'
import ObjectListSettings from './ObjectListSettings'
import { dataType } from './'

import './index.css'

/////////////////////////////////////////////
// Main component

export const ObjectListPage: React.FC<XTSObjectListProps> = (props) => {

    /////////////////////////////////////////////
    // 

    // const  = useSelector((state: RootState) => state.session.externalAccount)
    const { user, externalAccount, company, employee, customer } = useSelector((state: RootState) => state.session)

    // const dataType = 'XTSOrder'
    // const requestParams = { limit: 50 }   // Tham số trong requestObject

    const conditions: XTSCondition[] = []
    if (company) {
        const condition = createXTSObject('XTSCondition', {
            property: 'company',
            value: company
        })
        conditions.push(condition)
    } else if (user && employee) {
        const condition = createXTSObject('XTSCondition', {
            property: 'employeeResponsible',
            value: employee
        })
        conditions.push(condition)
    } else if (customer) {
        const condition = createXTSObject('XTSCondition', {
            property: 'customer',
            value: customer
        })
        conditions.push(condition)
    } else {
        const condition = createXTSObject('XTSCondition', {
            property: 'externalAccount',
            value: externalAccount
        })
        conditions.push(condition)
    }

    // Tham số trong requestObject
    const requestParams = {
        // limit: 50,
        conditions,
    }

    const getObjectListParams: UseGetObjectListParams = {
        dataType,
        requestParams,
        download: false,
    }
    const { status, dataList, refreshList, loadMore } = useGetObjectList(getObjectListParams)

    // console.log('dataList')
    // console.log(dataList)

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
        pageTitle: 'Danh sách đơn hàng',
        renderKey: props.renderKey
    }
    useOpenPage(openPageParams)

    /////////////////////////////////////////////
    // 

    const renderItem = (item: any) => {

        return (
            <ObjectCard
                item={item}
                itemName={props.itemName}
                choiceItemValue={props.choiceItemValue}
            />
        )
    }

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
        <div className='sales-order-list'>

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            {/* <TopBar> */}

            {/* <FormListSearch
                dataType='XTSOrder'
                itemProps={{}}
                inputProps={{}}
            /> */}

            <ObjectListSettings
                dataType='XTSOrder'
                itemProps={{}}
                inputProps={{}}
            />

            {/* </TopBar> */}

            {/* <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 3,
                    xxl: 4,
                }}
                dataSource={dataList}
                renderItem={(item) => (
                    <List.Item>
                        <OrderCard
                            item={item}
                            choiceItemValue={props.choiceItemValue}
                            setItemValue={props.setItemValue}
                            initialItemValue={props.initialItemValue}
                        />
                    </List.Item>
                )}
            /> */}

            <VirtualGrid
                dataType={'XTSOrder'}
                items={dataList}
                renderItem={renderItem}
                rowHeight={210}
                listGrid={listGrid}
                loadMore={loadMore}
            />

            {/* <ListMenu
                newItem={newItem}
                loadMore={loadMore}
                refresh={refreshList}
                stepBack={props.stepBack}
            /> */}

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

export default ObjectListPage