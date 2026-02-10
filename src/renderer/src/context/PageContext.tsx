"use client"

import { url } from "inspector"
import React, { createContext, useContext, useState } from "react"

interface PageContextType {
  currentPage: {
    title: string
    url?: string
    parent?: string
  }
  setCurrentPage: (page: { title: string; url?: string; parent?: string }) => void
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export function PageProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<{ title: string; url?: string; parent?: string }>({
    title: "Home",
    url: "home",
  })

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PageContext.Provider>
  )
}

export function usePageContext() {
  const context = useContext(PageContext)
  if (context === undefined) {
    throw new Error("usePageContext must be used within a PageProvider")
  }
  return context
}
