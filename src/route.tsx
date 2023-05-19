import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { Home } from './page/home';
import { ErrorPage } from './error-page';
import { AdminPage } from './page/admin/main-admin';
import { UserRegistrasi } from './page/user-registrasi';
import { NotifikasiRegistrasi } from './page/notif-registrasi';
import { PemrakarsaPage } from './page/pemrakarsa/main-pemrakarsa';
import './index.css';
// import { ChakraProvider } from '@chakra-ui/react';

initializeIcons();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />
  },
  {
    path: "registrasi",
    element: <UserRegistrasi />,
  },
  {
    path: "notif_registrasi",
    element: <NotifikasiRegistrasi />,
  },
  {
    path: "admin",
    element: <AdminPage />,
  },
  {
    path: "pemrakarsa",
    element: <PemrakarsaPage />,
    // children: [
    //   {
    //     path: "dashboard",
    //     element: <KontenDashboardPemrakarsa />,
    //   },
    //   {
    //     path: "permohonan",
    //     element: <KontenPermohonanPemrakarsa />,
    //   },
    // ],
  }
]);

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <Provider store={store}>
      <RouterProvider router={router} />  
  </Provider>
);
