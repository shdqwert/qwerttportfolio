import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const ConnectContext = createContext({ isOpen: false, open: () => {}, close: () => {} })

const HASH = '#connect'

// The Connect drawer is linkable: its open state follows the `#connect` hash,
// so Back closes it and the URL can be shared.
export function ConnectProvider({ children }) {
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    const sync = () => setOpen(window.location.hash === HASH)
    sync()
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  const open = useCallback(() => {
    if (window.location.hash !== HASH) history.pushState({ connect: true }, '', HASH)
    setOpen(true)
  }, [])

  const close = useCallback(() => {
    if (history.state?.connect) {
      history.back()
    } else {
      history.replaceState(null, '', window.location.pathname + window.location.search)
      setOpen(false)
    }
  }, [])

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close])
  return <ConnectContext.Provider value={value}>{children}</ConnectContext.Provider>
}

// eslint-disable-next-line react/only-export-components
export const useConnect = () => useContext(ConnectContext)

// Every "Start a project" / "Discuss" / "Connect" trigger.
export function ConnectLink({ children, onClick, ...rest }) {
  const { open } = useConnect()
  return (
    <a
      href={HASH}
      onClick={(e) => {
        onClick?.(e)
        if (e.metaKey || e.ctrlKey || e.shiftKey) return
        e.preventDefault()
        open()
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
