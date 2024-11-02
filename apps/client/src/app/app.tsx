import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-datatable/styles.layer.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AccountsPage, BudgetPage, TransactionsPage } from './pages';

const router = createBrowserRouter([
  { path: '/accounts', element: <AccountsPage /> },
  { path: '/budget', element: <BudgetPage /> },
  { path: '/transactions', element: <TransactionsPage /> },
]);

const theme = createTheme({
  primaryColor: 'green',
  primaryShade: 7,
  defaultRadius: 'lg',
});

export function App() {
  /* <ColorSchemeScript /> */

  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />

      <MantineProvider defaultColorScheme="light" theme={theme}>
        <RouterProvider router={router} />
      </MantineProvider>
    </>
  );
}

export default App;
