
/////////////////////////////////////////////
// Standard's

import { useSelector } from 'react-redux'
import React, { FC, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, FloatButton } from 'antd'
import { ArrowLeftOutlined, CarryOutOutlined, CheckOutlined, EllipsisOutlined, DeleteRowOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SaveOutlined, LineOutlined, InsertRowBelowOutlined, AppstoreAddOutlined, VerticalAlignBottomOutlined, SelectOutlined, ThunderboltOutlined, BarsOutlined, PrinterOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Application's

import { RootState } from '../../data-storage'

/////////////////////////////////////////////
// Object's

import './index.css'

/////////////////////////////////////////////
// Main

export interface ContextMenuButton {
    key?: string
    visible?: boolean
    title?: string
    hint?: string
    icon?: ReactNode
    onClick?: (e: any) => void
}

export interface ContextMenuProps {
    stepBack?: ContextMenuButton
    refresh?: ContextMenuButton
    loadMore?: ContextMenuButton
    newItem?: ContextMenuButton
    editItem?: ContextMenuButton
    saveItem?: ContextMenuButton
    choiceItem?: ContextMenuButton
    relatedDocuments?: ContextMenuButton
    action1?: ContextMenuButton
    action2?: ContextMenuButton
    action3?: ContextMenuButton
    action4?: ContextMenuButton
    action5?: ContextMenuButton
    action6?: ContextMenuButton
    action7?: ContextMenuButton
    action8?: ContextMenuButton
}

const TopBar: React.FC<any> = (props) => {
    return (
        <div className='top-bar'>
            {props.children}
        </div>
    )
}

function createIcon(IconComponent: any): ReactNode {

    // console.log('IconComponent', IconComponent)
    return (
        <IconComponent className='context-menu-button-icon' />
    )
}

function createButton(button: ContextMenuButton): ReactNode {

    return (
        <Button
            className='context-menu-button'
            key={button.key}
            onClick={button.onClick}
            icon={button.icon}
        >
            <div className='context-menu-button-title'>
                {button.title}
            </div>
        </Button>
    )
}

const BottomBar: React.FC<ContextMenuProps> = (props) => {

    const { telegramId } = useSelector((state: RootState) => state.session)

    const buttonTemplate = (title: string = '', icon: ReactNode) => {
        return { title, icon, visible: true }
    }
    const standardButtons: { [key: string]: any } = {
        stepBack: buttonTemplate('', createIcon(ArrowLeftOutlined)),
        refresh: buttonTemplate('', createIcon(ReloadOutlined)),
        loadMore: buttonTemplate('Tải thêm', createIcon(VerticalAlignBottomOutlined)),
        newItem: buttonTemplate('Tạo mới', createIcon(PlusOutlined)),
        editItem: buttonTemplate('Soạn', createIcon(EditOutlined)),
        saveItem: buttonTemplate('Lưu lại', createIcon(SaveOutlined)),
        printItem: buttonTemplate('In...', createIcon(PrinterOutlined)),
        choiceItem: buttonTemplate('Chọn', createIcon(SelectOutlined)),
        relatedDocuments: buttonTemplate('', createIcon(BarsOutlined)),
        action1: buttonTemplate('Action 1', createIcon(ThunderboltOutlined)),
        action2: buttonTemplate('Action 2', createIcon(ThunderboltOutlined)),
        action3: buttonTemplate('Action 3', createIcon(ThunderboltOutlined)),
        action4: buttonTemplate('Action 4', createIcon(ThunderboltOutlined)),
        action5: buttonTemplate('Action 5', createIcon(ThunderboltOutlined)),
        action6: buttonTemplate('Action 6', createIcon(ThunderboltOutlined)),
        action7: buttonTemplate('Action 7', createIcon(ThunderboltOutlined)),
        action8: buttonTemplate('Action 8', createIcon(ThunderboltOutlined)),
    }

    const leftButtons: ContextMenuButton[] = []
    const rightButtons: ContextMenuButton[] = []
    const rightKeys = ['refresh', 'relatedDocuments']

    for (let key in props) {
        if (standardButtons.hasOwnProperty(key)) {
            const button = Object.assign(standardButtons[key], (props as any)[key])
            if (key === 'stepBack') {
                button.visible = !Boolean(telegramId)
            }
            if (button.visible) {
                button.key = key
                if (rightKeys.includes(key)) {
                    rightButtons.push(button)
                } else {
                    leftButtons.push(button)
                }
            }
        }
    }

    /////////////////////////////////////////////
    // 

    return (
        <div className='bottom-bar'>
            <div className='button-bar-left'>
                {/* {leftButtons.map(button =>
                    <Button
                        className={button.className}
                        key={button.key}
                        onClick={button.onClick}
                        icon={button.icon}
                    >
                        <div className='context-menu-button-title'>
                            {button.title}
                        </div>
                    </Button>
                )} */}
                {leftButtons.map(button => createButton(button))}
            </div>
            <div className='button-bar-right'>
                {rightButtons.map(button => createButton(button))}
            </div>
        </div >
    )
}

export { TopBar, BottomBar } 