import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.tsx'
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import './App.css';
import { OpenAPI } from './api/generated/core/OpenAPI';
import { AppConfigProvider } from './config/AppConfigProvider.tsx';
import { HomePage } from './pages/Home/HomePage.tsx';


async function bootstrap() {
  // 1) Cargar config.json
  const response = await fetch('/Config.json');
   console.log({response});
  const config = await response.json();
  console.log({config});
  // 2) Sobrescribir el BASE del cliente OpenAPI
  OpenAPI.BASE = config.apiBaseUrl;

  // 3) Recién ahora renderizar React
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Theme 
        accentColor="indigo"
        radius="large"
        appearance="light"
      >
        <AppConfigProvider config={config}>
          <HomePage />
        </AppConfigProvider>
      </Theme>
    </StrictMode>
  );
}

bootstrap();
