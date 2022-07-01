import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { initializeIcons } from '@fluentui/font-icons-mdl2'
import { Provider } from 'react-redux'
import { store } from './app/store'
import './index.css'
import RoutePage from './RoutePage'

initializeIcons()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoutePage/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>    
  </React.StrictMode>,
  document.getElementById('root')
)
