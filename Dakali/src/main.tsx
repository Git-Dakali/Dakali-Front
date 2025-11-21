import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme
      accentColor="indigo"  // color principal: indigo, violet, crimson, jade, etc.
      radius="large"        // border-radius: none, small, medium, large, full
      appearance="light"    // light | dark | inherit
    >
      <App />

    </Theme>
    
  </StrictMode>
)
