/////////////////////////////////////////////
// Standard's

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Empty, FloatButton, Image, List, Skeleton, Space } from 'antd'
import { ArrowLeftOutlined, CopyOutlined, DownloadOutlined, EditOutlined, FileZipOutlined, LeftOutlined, LinkOutlined, ReloadOutlined, RightOutlined, SelectOutlined, ShoppingCartOutlined } from '@ant-design/icons'


/////////////////////////////////////////////
// Application's

import { useGetDataObject, UseGetDataObjectParams, useOpenPage, UseOpenPageParams } from '../../hooks/usePage'
import { copyToClipboard, downloadAndZipImages, downloadFile, formatCurrency } from '../../commons/common-use'
import { BottomBar, } from '../../components/ContextMenu'
import { ITEM_VALUE_ACTIONS, USAGE_MODES, XTSMediaItem, XTSObjectViewProps } from '../../data-objects/types-components'
import { REQUEST_STATUSES } from '../../commons/enums'
import { createXTSObject } from '../../data-objects/common-use'
import { RootState } from '../../data-storage'
import { Loader } from '../../components/Loader'

/////////////////////////////////////////////
// Object's

import { XTSFileRow } from '../../data-objects/types-application'
import { useSaveCart } from '../../hooks/useCarts'
import { dataType } from './'

import './index.css'

/////////////////////////////////////////////
// Main component

// OK
const ObjectViewPage: React.FC<XTSObjectViewProps> = (props) => {

    const { itemValue, pageId, usageMode } = props

    const object_id = itemValue.id
    // const dataType = 'XTSProduct'

    const { user, telegramId } = useSelector((state: any) => state.session)

    const getDataObjectParams: UseGetDataObjectParams = {
        dataType,
        object_id,
        refresh: false,
    }

    const {
        dataObject,
        refreshObject,
        status
    } = useGetDataObject(getDataObjectParams)

    const openPageParams: UseOpenPageParams = {
        pageId,
        pageName: dataType,
        pageTitle: (dataObject?.description) || '',
        renderKey: props.renderKey
    }
    useOpenPage(openPageParams)

    /////////////////////////////////////////////
    // addToCart    

    const { addToCart } = useSaveCart()

    const handleAddToCart = (e: any) => {
        addToCart(dataObject)
    }

    /////////////////////////////////////////////
    // 

    const doItem = (action: ITEM_VALUE_ACTIONS): void => {
        if (props.choiceItemValue) {
            const itemValue = createXTSObject('XTSItemValue')
            Object.assign(itemValue, dataObject.objectId)
            itemValue.dataItem = dataObject
            itemValue.action = action
            itemValue.itemName = props.itemName
            props.choiceItemValue(itemValue)
        }
    }

    const editItem = () => {
        doItem(ITEM_VALUE_ACTIONS.EDIT)
    }

    const choiceItem = () => {
        doItem(ITEM_VALUE_ACTIONS.CHOICE)
    }

    /////////////////////////////////////////////
    // Copy Link

    const copyLink = () => {
        // const url = `http://localhost:3000/products?id=${dataObject.objectId.id}`
        // const url = `https://t.me/XTSRetail_bot?startapp=products__${dataObject.objectId.id}`
        const url = `${window.location.protocol}//${window.location.hostname}/view?id=${dataObject.objectId.id}&type=XTSProduct`
        copyToClipboard(url)

        // if (TWA.shareMessage) {
        //     const preparedMessage = {
        //         user_id: telegramId,
        //         result: {
        //             type: 'article',
        //             id: 'unique-article-id',
        //             title: 'Link sản phẩm trên XTS Retail',
        //             input_message_content: {
        //                 message_text: url
        //             }
        //         }
        //     }
        //     const preparedInlineMessage = TWA.savePreparedInlineMessage(preparedMessage)
        //     console.log('preparedInlineMessage', preparedInlineMessage)
        //     TWA.shareMessage(preparedInlineMessage.id).
        //         then(() => {
        //             console.log('Tin nhắn đã được chia sẻ thành công!')
        //         })
        //         .catch((error: any) => {
        //             console.error('Lỗi khi chia sẻ tin nhắn:', error)
        //         })
        // }
    }

    /////////////////////////////////////////////
    // Pictures

    // const dataType_AttachedFile = 'XTSProductAttachedFile'
    // const [pictures, setPictures] = useState<XTSMediaItem[]>([])
    const [pictureItems, setPictureItems] = useState<string[]>([])
    const [picture, setPicture] = useState<string>('')
    // const [newPictures, setNewPictures] = useState()
    // const [deletedPictures, setDeletedPictures] = useState()
    const fileStorageURL = useSelector((state: RootState) => state.session.fileStorageURL)

    // const pictureProps = { dataType: dataType_AttachedFile, pictures }
    // const imageProps = { height: '400px' }

    const _pictures = dataObject['_pictures']

    useEffect(() => {
        const items = _pictures.map((item: any) => fileStorageURL + item.fileName)
        setPictureItems(items)
        setPicture(fileStorageURL + dataObject?.picture?.presentation)
    }, [_pictures])

    /////////////////////////////////////////////
    // 

    return (
        <div className='product-view' >

            <Loader isLoading={status === REQUEST_STATUSES.LOADING} />

            <div className='product-view-image' >
                <Image.PreviewGroup items={pictureItems}>
                    <Image src={picture} >

                    </Image>
                </Image.PreviewGroup>
            </div>
            < div className='product-view-price-bar'>
                <div className='product-view-price-bar-value'>
                    {formatCurrency(dataObject?._price)}
                </div>
                <div className='product-view-price-bar-download'>
                    <Button
                        className='product-view-download-button'
                        icon={<DownloadOutlined />}
                        onClick={() => downloadFile(picture)}
                    >
                        Tải ảnh về
                    </Button>
                    <Button
                        icon={<FileZipOutlined />}
                        onClick={() => downloadAndZipImages(pictureItems, `${dataObject.sku}_${dataObject.description}`)}
                    >
                        Nén và tải về
                    </Button>
                </div>
            </div>

            <div className='product-view-description' >
                {dataObject?.description} {(dataObject.sku) && `(${dataObject?.sku})` || ''}
            </div>

            <div className='product-view-uom' >
                <b>Đơn vị tính:</b>
            </div>
            <List className='product-view-list-uoms'
                dataSource={dataObject?._uoms || []}
                renderItem={(row: any) => (
                    <Space style={{ display: 'flex' }}>
                        <div>Hệ số: {row?.coefficient}</div>
                        <b style={{ color: 'blue' }}>{row?.uom?.presentation}</b>
                    </Space>
                )}
            />

            {
                (dataObject?._characteristics?.length > 0) &&
                <>
                    <div>Đặc tính sản phẩm</div>
                    <List
                        grid={{
                            gutter: 16,
                            xs: 2,
                            sm: 2,
                            md: 4,
                            lg: 6,
                            xl: 8,
                            xxl: 10,
                        }}
                        dataSource={dataObject?._characteristics || []}
                        locale={{ emptyText: '-' }}
                        renderItem={(row: any) => (
                            <List.Item>
                                <div>
                                    {row?.characteristic_presentation}
                                </div>
                                <div>
                                    {formatCurrency(row?.price)}
                                </div>
                            </List.Item>
                        )}
                    />
                </>
            }

            <div className='product-view-long-description' >
                <b>Chi tiết sản phẩm:</b>
                <div className='product-view-long-description-text'> {dataObject?.descriptionFull}</div>
            </div>

            <BottomBar
                stepBack={{ onClick: props.stepBack, visible: Boolean(props.stepBack) }}
                refresh={{ onClick: refreshObject, }}
                editItem={{ onClick: editItem, visible: (user) && usageMode !== USAGE_MODES.ITEM_VIEW }}
                choiceItem={{ onClick: choiceItem, visible: Boolean(props.itemName) }}
                action1={{
                    onClick: handleAddToCart, icon: <ShoppingCartOutlined />, title: 'Vào giỏ', visible: Boolean(!props.itemName && !user && usageMode !== USAGE_MODES.ITEM_VIEW)
                }}
                action2={{
                    onClick: copyLink, icon: <LinkOutlined className='context-menu-button-icon' />, title: 'Link', visible: Boolean(!props.itemName)
                }}
            />

        </div >
    )
}

/////////////////////////////////////////////
// Export's

export default ObjectViewPage