"use client"

import React, { createContext, useContext, useState } from "react"

interface PageContextType {
  currentPage: {
    title: string
    parent?: string
  }
  setCurrentPage: (page: { title: string; parent?: string }) => void
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export function PageProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState({
    title: "Overzicht",
    parent: "Planning",
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
