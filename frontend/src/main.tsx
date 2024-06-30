import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import { client } from './apolloClient.ts';
import Home from './pages/Home.tsx';
import { createTheme, MantineProvider } from '@mantine/core';
import { MantineEmotionProvider } from '@mantine/emotion';

const theme = createTheme({});

const router = createBrowserRouter(
  [
    {
      path: '/', element: <Home />,
      children: [
        {
          path: "/chatrooms/:id",
        },
      ],
    }
    
  ]
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <MantineProvider theme={theme}>
        <MantineEmotionProvider>
          <RouterProvider router={router} />
        </MantineEmotionProvider>
      </MantineProvider>
    </ApolloProvider>
  </React.StrictMode>,
)
