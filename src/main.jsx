import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { MovieProvider } from './context/MovieContext.jsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <MovieProvider>
          <App />
        </MovieProvider>
      </BrowserRouter>
    </StrictMode>
  );
}