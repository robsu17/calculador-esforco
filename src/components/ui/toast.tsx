import React, { useEffect, useState } from 'react'

type Toast = { id: number; message: string }

let globalHandler: ((message: string, duration?: number) => void) | null = null

export const showToast = (message: string, duration = 4000) => {
  if (globalHandler) globalHandler(message, duration)
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  useEffect(() => {
    globalHandler = (message: string, duration = 4000) => {
      const id = Date.now() + Math.floor(Math.random() * 1000)
      setToasts((s) => [...s, { id, message }])
      setTimeout(() => {
        setToasts((s) => s.filter((t) => t.id !== id))
      }, duration)
    }
    return () => {
      globalHandler = null
    }
  }, [])

  return (
    <>
      {children}

      {/* Toast container */}
      <div aria-live="polite" className="fixed top-6 right-6 flex flex-col gap-3 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="max-w-sm w-full bg-zinc-200 text-black px-4 py-2 rounded-md shadow-lg border border-emerald-700"
          >
            {t.message}
          </div>
        ))}
      </div>
    </>
  )
}

export default ToastProvider
