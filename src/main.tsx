import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './index.css';
// import RoutePage from './RoutePage';
import { Home } from './page/home';
import { AdminPage } from './page/main-admin';
import { UserRegistrasi } from './page/user-registrasi';
import { NotifikasiRegistrasi } from './page/notif-registrasi';

initializeIcons()

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript


root.render(
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>   
          <Route path="admin" element={<AdminPage/>}/>      
          <Route path="registrasi" element={<UserRegistrasi/>}/> 
          <Route path="notif_registrasi"element={<NotifikasiRegistrasi/>}/> 
        </Routes>
      </BrowserRouter>
    </Provider>    
)
