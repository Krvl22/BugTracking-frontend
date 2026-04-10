
import { useState, useEffect } from 'react'
 
export const useSidebarCollapsed = (storageKey) => {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(storageKey) === 'true')
 
  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.collapsed !== undefined) setCollapsed(e.detail.collapsed)
    }
    window.addEventListener('sidebarToggled', handler)
    return () => window.removeEventListener('sidebarToggled', handler)
  }, [])
 
  // Returns the correct margin class
  return collapsed ? 'lg:ml-16' : 'lg:ml-64'
}