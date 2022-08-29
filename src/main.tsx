import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './index.css';
// import RoutePage from './RoutePage';
import { Home } from './page/home';

initializeIcons()

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript


root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>    
  </React.StrictMode>
)
