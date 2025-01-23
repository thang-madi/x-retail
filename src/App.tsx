
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { routeItems } from './components/Routes'
import { isFullscreenAndroid, isFullscreenIOS, TWA } from './commons/telegram'
import { requestData_DownloadObjectList, requestData_GetObjectList } from './data-objects/request-data'
import { getXTSSlice } from './data-storage/xts-mappings'
import { REQUEST_STATUSES } from './commons/enums'

import './App.css'

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

const App: React.FC = () => {

    const dispatch = useDispatch()

    /////////////////////////////////////////
    // Thiết lập Router

    const router = createBrowserRouter(routeItems())

    useEffect(() => {

        /////////////////////////////////////////
        // Đặt giá trị cho các biến môi trường 

        let statusBarHeight = '0px'
        let navBarHeight = '0px'

        if (isFullscreenAndroid()) {
            statusBarHeight = '30px'
            navBarHeight = '44px'
        } else if (isFullscreenIOS()) {
            statusBarHeight = '30px'
        }

        document.documentElement.style.setProperty('--status-bar-height', statusBarHeight)
        document.documentElement.style.setProperty('--nav-bar-height', navBarHeight)

        /////////////////////////////////////////
        // Tải về các danh mục chính

        if (TWA.platform !== 'unknown') {

            // Tải về products
            const params = {
                dataType: 'XTSProduct',
                requestParams: {},
                length: 0,
                count: 100,
            }
            const requestProducts = requestData_DownloadObjectList(params.dataType, params.requestParams)
            const { actions, apiRequest } = getXTSSlice('XTSProduct')
            // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setTemp(null))
            dispatch(apiRequest(requestProducts))

            // Tải về sales-orders
            params.dataType = 'XTSOrder'
            const requestOrders = requestData_GetObjectList(params.dataType, params.length, params.count, params.requestParams)
            // dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setStatus(REQUEST_STATUSES.LOADING))
            dispatch(actions.setTemp(null))
            dispatch(apiRequest(requestOrders))
        }

        console.log('url', window.location.href)
    }, [])

    /////////////////////////////////////////
    //  

    return (
        <div style={{ height: '100vh', backgroundColor: 'rgb(0, 150, 255)' }}>
            <RouterProvider router={router} />
        </div >

    )
}

export default App
