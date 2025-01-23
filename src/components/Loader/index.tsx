
/////////////////////////////////////////////
// Standard's

import { Spin } from 'antd'

/////////////////////////////////////////////
// Application's

/////////////////////////////////////////////
// Object's

import './index.css'

/////////////////////////////////////////////
// Main component

export interface XTSLoaderProps {
    isLoading: boolean,
    spinProps?: any,
}

export const Loader: React.FC<XTSLoaderProps> = (props) => {

    const { isLoading, spinProps = {} } = props

    /////////////////////////////////////////////
    // 

    return (
        <Spin
            className='loader-spin'
            spinning={isLoading}
            size='large'
            {...spinProps}
        // style={{
        //     position: 'absolute',
        //     top: '50%',
        //     left: '50%',
        //     transform: 'translate(-50%, -50%)',
        //     zIndex: 9999,
        //     color: 'orange'
        // }}
        />
    )
}

