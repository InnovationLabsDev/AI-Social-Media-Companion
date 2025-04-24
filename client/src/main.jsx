import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import FrontPage from './pages-website/frontPage.jsx';
import MainPage from './pages-website/mainPage.jsx';
import SettingsPage from './pages-website/settingsPage.jsx';
import RegistrationForm from './pages-website/components/registrationForm.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/main-page" element={<MainPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/registration" element={<RegistrationForm />} />
        {/* <Route path="/app" element={<App />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
