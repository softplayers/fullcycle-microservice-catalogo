import { Box, ThemeProvider, CssBaseline } from '@material-ui/core';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import AppRouter from './routes/AppRouter';
import Breadcrumbs from './components/Breadcrumbs';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <React.Fragment>
        <BrowserRouter>
          <Navbar></Navbar>
          <Box paddingTop={'70px'}>
            <Breadcrumbs />
            <AppRouter />
          </Box>
        </BrowserRouter>
      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;
