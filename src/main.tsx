import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initPersist } from './lib/persist'

// Nạp tiến trình từ file (nếu có) trước khi hiển thị, để không thấy bản trống.
void initPersist().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
