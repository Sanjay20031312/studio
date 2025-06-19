import * as React from "react"

const MOBILE_BREAKPOINT = 768 // Standard md breakpoint

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    if (typeof window === "undefined") {
      setIsMobile(false); // Default to false in SSR or non-browser environments
      return;
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }
    
    mql.addEventListener("change", onChange)
    setIsMobile(mql.matches) // Initial check

    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile === undefined ? false : isMobile; // Return false during initial undefined state to avoid SSR mismatch issues
}
