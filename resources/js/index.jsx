import { createRoot } from 'react-dom/client'
import App from './App'
import '../css/app.css'
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import { AppProvider } from '@shopify/polaris';
import { Toaster } from 'sonner';

const root = document.createElement('div')
document.body.appendChild(root)
createRoot(root).render(
    <AppProvider i18n={enTranslations}>
        <App />
        <Toaster position="top-right" />
    </AppProvider>
)