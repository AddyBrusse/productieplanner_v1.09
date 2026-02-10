import { PageProvider, usePageContext } from "@/context/PageContext"
import { MachinesProvider } from "@/context/MachinesContext"
import { ProductionDataProvider } from "@/context/ProductionDataContext"
import { AppSidebar } from "@/components/app-sidebar"
import { PlanningDashboardView } from "@renderer/components/PlanningDashboardView"
import { PlanningOverview } from "@/components/PlanningOverview"
import { PlanningSettings } from "@/components/PlanningSettings"
import { PlanningDetailView } from "@/components/PlanningDetailView"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

function PageContent() {
  const { currentPage } = usePageContext()

  const renderContent = () => {
    console.log("Current page:", currentPage)
    if (currentPage.title === "Planning" && !currentPage.parent) {
      return <PlanningDashboardView />
    }
    if (currentPage.parent === "Planning" && currentPage.title === "Detailplanning") {
      return <PlanningDetailView />
    }

    if (currentPage.parent === "Planning" && currentPage.title === "Orderoverzicht") {
      return <PlanningOverview />
    }

    if (currentPage.parent === "Planning" && currentPage.title === "Machines") {
      return null
    }

    if (currentPage.parent === "Planning" && currentPage.title === "Instellingen") {
      return <PlanningSettings />
    }

    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
      </div>
    )
  }

  return (
    <SidebarInset className="flex flex-col">
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {currentPage.parent && (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    {currentPage.parent}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPage.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex-1 overflow-hidden bg-blue-500">
        {renderContent()}
      </div>
    </SidebarInset>
  )
}

export default function Page() {
  return (
    <ProductionDataProvider>
      <MachinesProvider>
        <PageProvider>
          <SidebarProvider>
            <AppSidebar />
            <PageContent />
          </SidebarProvider>
        </PageProvider>
      </MachinesProvider>
    </ProductionDataProvider>
  )
}
