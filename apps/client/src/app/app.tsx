import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import 'mantine-datatable/styles.layer.css';
import 'reflect-metadata';

import { QueryClientProvider } from '@tanstack/react-query';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { BudgetPage, TransactionsPage } from './pages';
import { queryClient } from './utils/queryClient';
import { theme } from './utils/theme';

const router = createBrowserRouter([
  { path: '/budget', element: <BudgetPage /> },
  { path: '/accounts/:accountId', element: <TransactionsPage /> },
]);

export function App() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />

      <MantineProvider defaultColorScheme="light" theme={theme}>
        <ModalsProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default App;
