/////////////////////////////////////////////
// Standard's

import { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Button, Space, List, Input, FloatButton } from 'antd'
import { DownloadOutlined, PlusCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Application's

import { useGetObjectList, UseGetObjectListParams, useOpenPage, UseOpenPageParams } from '../../hooks/usePage'
import { createXTSObject } from '../../data-objects/common-use'
import { REQUEST_STATUSES } from '../../commons/enums'
import { ITEM_VALUE_ACTIONS, XTSObjectListProps } from '../../data-objects/types-components'
import { BottomBar } from '../../components/ContextMenu'
import { Loader } from '../../components/Loader'
import { XTSObject } from '../../data-objects/types-common'
import { VirtualGrid } from '../../components/Virtualized'

/////////////////////////////////////////////
// Object's

import { XTSCounterparty } from '../../data-objects/types-application'
import ObjectCard from './ObjectCard'
import ObjectListSettings from './ObjectListSettings'
import { dataType } from './'

import './index.css'

/////////////////////////////////////////////
// Main component

// OK
const ObjectListPage: React.FC<XTSObjectListProps> = (props) => {

    const { user, telegramId } = useSelector((state: any) => state.session)

    // const [searchString, setSearchString] = useState<string>('')

    // const dataType = 'XTSCounterparty'
    const requestParams = {
        // Tham số trong requestObject
        limit: 50,
        conditions: [
            // {
            //     property: '_search',
            //     value: searchString
            // }
        ]
    }

    const getObjectListParams: UseGetObjectListParams = {
        dataType,
        requestParams,
        download: false,
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
        pageTitle: 'Danh sách khách hàng',
        renderKey: props.renderKey,
    }
    useOpenPage(openPageParams)

    /////////////////////////////////////////////
    // 

    const renderItem = (item: XTSCounterparty) => {
        return (
            <ObjectCard
                item={item}
                itemName={props.itemName}
                choiceItemValue={props.choiceItemValue}
            // setItemValue={props.setItemValue}
            // initialItemValue={initialItemValue as XTSItemValue}
            />
        )
    }

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
        <div className='customer-list'>

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <ObjectListSettings />

            <List
                grid={listGrid}
                dataSource={dataList}
                renderItem={(item: XTSObject) => (
                    <List.Item className='customer-list-item'>
                        <ObjectCard
                            item={item}
                            itemName={props.itemName}
                            choiceItemValue={props.choiceItemValue}
                        // initialItemValue={props.initialItemValue}
                        // stepBack={props.stepBack}
                        />
                    </List.Item>
                )}
            />

            {/* <VirtualGrid
                dataType={dataType}
                items={dataList}
                renderItem={renderItem}
                rowHeight={124}
                listGrid={listGrid}
                itemName={props.itemName}
                loadMore={loadMore}
            /> */}

            <BottomBar
                stepBack={{ onClick: props.stepBack, visible: Boolean(props.stepBack) }}
                refresh={{ onClick: refreshList }}
                newItem={{ onClick: newItem, visible: (user) }}
            />

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default ObjectListPage                                                         