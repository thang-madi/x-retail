
/////////////////////////////////////////////
// Standard's

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import reportWebVitals from './reportWebVitals'

/////////////////////////////////////////////
// Application's

import './assets/variables.css'
import './index.css'

import App from './App'

import dataStorage from './data-storage'

const serviceWorker = require('./serviceWorker')

/////////////////////////////////////////////
// Main's

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <Provider store={dataStorage}>
      <App />
    </Provider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
serviceWorker.unregister()