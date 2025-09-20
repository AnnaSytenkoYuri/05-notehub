import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App/App'
import "modern-normalize"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
  </StrictMode>,
)
