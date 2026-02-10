"use client"

import * as React from "react"
import {
  SquareTerminal,
  ChartNetwork,
  Drill,
  Import,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Addy Brusse",
    email: "addybrusse@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Planning",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Detailplanning",
          icon: ChartNetwork,
        },
        {
          title: "Orderoverzicht",
          url: "#",
          icon: ChartNetwork,
        },
        {
          title: "Machines",
          url: "#",
          icon: Drill,
        },
        {
          title: "Instellingen",
          url: "#",
          icon: Import,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
