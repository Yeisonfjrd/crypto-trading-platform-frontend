import React from "react"
import ReactDOM from "react-dom/client"
import { ClerkProvider } from "@clerk/clerk-react"
import App from "./App"
import { Providers } from "./providers"
import "./index.css"

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Providers attribute="class" defaultTheme="system" enableSystem>
        <App />
      </Providers>
    </ClerkProvider>
  </React.StrictMode>,
)

