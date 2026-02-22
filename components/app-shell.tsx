"use client"

import type { ReactNode } from "react"
import { ChevronRight, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { menuItems } from "@/constants/menu-items"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

type AppShellProps = {
  children: ReactNode
}

function WorkspaceMenu() {
  const { isMobile, setOpenMobile } = useSidebar()
  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarMenu className="gap-1">
      {menuItems.map((item) => {
        if (item.children?.length) {
          return (
            <Collapsible key={item.id} className="group/collapsible" defaultOpen={item.defaultOpen}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="gap-2.5">
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                    <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.children.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.id}>
                        <SidebarMenuSubButton onClick={closeMobileSidebar}>
                          <span>{subItem.label}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        }

        return (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              className="gap-2.5"
              onClick={closeMobileSidebar}
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

function WorkspaceSidebar() {
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <>
      <SidebarHeader className="flex h-14 flex-row items-center justify-between border-b px-4 py-0">
        <p className="text-sm font-semibold">My Workspace</p>
        {isMobile ? (
          <Button
            aria-label="Close sidebar"
            onClick={() => setOpenMobile(false)}
            size="icon-sm"
            variant="ghost"
          >
            <X className="size-5" />
          </Button>
        ) : null}
      </SidebarHeader>
      <SidebarContent className="p-3">
        <WorkspaceMenu />
      </SidebarContent>
    </>
  )
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar side="left">
        <WorkspaceSidebar />
      </Sidebar>
      <SidebarInset className="min-h-screen">
        <header className="bg-background/95 sticky top-0 z-[60] flex h-14 items-center gap-1 border-b px-3 backdrop-blur">
          <SidebarTrigger aria-label="Toggle sidebar" />
          <p className="text-sm font-semibold">My Workspace</p>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
