
// Không còn dùng nữa

/////////////////////////////////////////////
// Standard's

import { useNavigate } from 'react-router-dom'
import { Button, FloatButton } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

/////////////////////////////////////////////
// Object's

import './index.css'

/////////////////////////////////////////////
// Main

export interface XTSBackButtonProps {
    stepBack: () => void,
    selectionMode: boolean,
}

const BackButton: React.FC<XTSBackButtonProps> = (props) => {

    // const TWA = window.Telegram.WebApp
    // const telegramId = TWA.initDataUnsafe.user?.id

    // if (!telegramId && !selectionMode) {
    return (
        <div>
            <FloatButton
                onClick={props.stepBack}
                htmlType='button'
                shape='square'
                style={{
                    position: 'fixed',
                    top: '4px',
                    right: '5px',
                    height: '30px',
                }}
                icon={<ArrowLeftOutlined />}
            />
        </div>
    )
    // }
}

export default BackButton