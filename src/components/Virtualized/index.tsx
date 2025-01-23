
/////////////////////////////////////////////
// Standard's

import { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, AutoSizer, List } from 'react-virtualized'
import debounce from 'lodash.debounce'

/////////////////////////////////////////////
// Application's

// import { FOOTER_HEIGHT, HEADER_HEIGHT, SIDER_BREAKEPOINT, SIDER_WIDTH } from '../../commons/constants'
import { getXTSSlice } from '../../data-storage/xts-mappings'
import { XTSItemValue } from '../../data-objects/types-form'
// import { RootState } from '../data-storage'
// import { getXTSSlice } from '../data-storage/slice-xts'
// import { LazyLoadComponent } from 'react-lazy-load-image-component'

import './index.css'
import { isFullscreenAndroid } from '../../commons/telegram'

/////////////////////////////////////////////
// Main

export interface VirtualGridProps {
    dataType: string
    items: any[]
    renderItem: any
    rowHeight: number
    listGrid: { [key: string]: number }
    itemName?: string
    loadMore?: () => void
    choiceItemValue?: (itemValue: XTSItemValue) => void
}

const VirtualGrid: React.FC<VirtualGridProps> = (props) => {

    const { dataType, items = [], renderItem, rowHeight, listGrid, loadMore } = props

    const dispatch = useDispatch()

    const getRowCount = (): number => {
        return Math.ceil(items.length / getColumnCount())
    }

    const getColumnCount = (): number => {

        // console.log('listGrid', listGrid)

        const windowWidth = window.innerWidth - 2

        const maxWidths: { [key: string]: number } = {
            xs: 576,
            sm: 768,
            md: 992,
            lg: 1200,
            xl: 1600,
            xxl: 9999,
        }

        const newTags = []
        var min = 0
        for (let size in listGrid) {
            if (maxWidths.hasOwnProperty(size)) {
                const max = maxWidths[size]
                const count = listGrid[size]
                newTags.push({ min, max, count })
                min = maxWidths[size]
            }
        }

        for (let item of newTags) {
            if (windowWidth >= item.min && windowWidth < item.max) {
                return item.count
            }
        }
        return 1
    }

    // const [windowWidth, setWindowWidth] = useState(getWindowWidth())
    const [columnCount, setColumnCount] = useState(getColumnCount())
    // const [rowCount, setRowCount] = useState(getRowCount())

    // const columnCount = getColumnCount()
    // const columnWidth = Math.ceil((windowWidth - parseInt(left, 10) - parseInt(right, 10)) / columnCount)
    // const rowCount = Math.ceil(items.length / columnCount)

    const renderCell = (props: any) => {

        const { columnIndex, key, rowIndex, style } = props
        const item = items[rowIndex * columnCount + columnIndex]
        return (
            <div key={key} style={style}>
                {(item) && renderItem(item)}
            </div>
        )
    }

    const { sliceName, apiRequest, actions } = getXTSSlice(dataType)

    const onScroll = useCallback(
        debounce((params: any) => {
            const { scrollLeft, scrollTop, scrollHeight, clientHeight } = params

            setScrollTop(undefined)
            setScrollLeft(undefined)

            if (scrollLeft || scrollTop) {
                dispatch(actions.setScrollValues({ scrollTop, scrollLeft }))
            }

            if (scrollTop + clientHeight >= scrollHeight) {
                if (loadMore) {
                    loadMore()
                }
            }
        }, 100),
        []
    )

    const [scrollTop, setScrollTop] = useState(useSelector((state: any) => state[sliceName].scrollTop))
    const [scrollLeft, setScrollLeft] = useState(useSelector((state: any) => state[sliceName].scrollLeft))

    // const [scrollRow] = useState(useSelector((state: any) => state[sliceName].scrollRow))
    // const [scrollColumn] = useState(useSelector((state: any) => state[sliceName].scrollColumn))

    const handleResize = useCallback(
        debounce(() => {
            // console.log('handleResize')
            // setWindowWidth(window.innerWidth - 2)
            // const windowWidth = window.innerWidth - 2
            setColumnCount(getColumnCount())
            // setRowCount(getRowCount())
        }, 50),
        []
    )

    useEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    // useEffect(() => {
    //     console.log('columnCount', columnCount)
    // }, [columnCount])

    // const left: string = (props.itemName) && '0px' || '0px'
    // const right: string = (props.itemName) && '0px' || '0px'
    // const top: string = (props.itemName) && '54px' || `calc(0px + ${HEADER_HEIGHT})`
    // const bottom: string = (props.itemName) && '20px' || FOOTER_HEIGHT

    return (

        // <div className={(props.itemName && isFullscreenAndroid()) && 'virtual-grid-choice-list-fullscreen-android' || 'virtual-grid'} >
        <div className='virtual-grid' >
            {/* <LazyLoadComponent> */}

            <AutoSizer >
                {
                    ({ width, height }) => (
                        <Grid
                            width={width}
                            height={height}
                            rowHeight={rowHeight}
                            rowCount={getRowCount()}
                            columnWidth={Math.floor((width - 5) / columnCount)}
                            columnCount={columnCount}
                            cellRenderer={renderCell}
                            scrollTop={scrollTop}
                            scrollLeft={scrollLeft}
                            // scrollToRow={scrollRow}
                            // scrollToColumn={scrollColumn}
                            // overscanRowCount={3}
                            onScroll={onScroll}
                        />
                    )
                }
            </AutoSizer>

            {/* </LazyLoadComponent> */}
        </div >
    )
}

export interface VirtualListProps {
    dataType: string
    items: any[]
    renderItem: any
    rowHeight: number
    loadMore?: () => void
}

//
const VirtualList: React.FC<VirtualListProps> = (props) => {

    const { dataType, items, renderItem, rowHeight, loadMore } = props

    const dispatch = useDispatch()

    const { sliceName, apiRequest, actions } = getXTSSlice(dataType)

    const onScroll = (params: any) => {
        const { scrollTop, scrollHeight, clientHeight } = params
        if (scrollTop + clientHeight >= scrollHeight) {
            if (loadMore) {
                loadMore()
                console.log('onScroll.loadMore')
            }
        }

        if (scrollTop) {
            // console.log('onScroll.setVListScrollValues')
            // const scrollRow = Math.ceil(scrollTop / rowHeight)
            // const scrollColumn = 0
            // dispatch(actions.setScrollValues({ scrollRow }))
            dispatch(actions.setScrollValues({ scrollTop }))
        }
    }

    // const [scrollRow] = useState(useSelector((state: any) => state[sliceName].scrollRow))
    const [scrollTop] = useState(useSelector((state: any) => state[sliceName].scrollTop))

    return (
        <div className='virtual-list'
        // style={{ width: '100%' }}
        >
            <AutoSizer>
                {
                    ({ height, width }) => (
                        (<List
                            width={width}
                            height={height}
                            rowHeight={rowHeight}
                            rowCount={items.length}
                            rowRenderer={renderItem}
                            scrollTop={scrollTop}
                            // scrollToRow={scrollRow}
                            onScroll={onScroll}
                        />
                        )
                    )
                }
            </AutoSizer>
        </div >
    )
}


/////////////////////////////////////////////
// Export's

export { VirtualGrid, VirtualList }

