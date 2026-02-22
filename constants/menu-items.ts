import type { LucideIcon } from "lucide-react"
import { BarChart3, FolderKanban, LayoutDashboard, Settings } from "lucide-react"

export type MenuItem = {
  id: string
  icon: LucideIcon
  label: string
  defaultOpen?: boolean
  children?: Array<{
    id: string
    label: string
  }>
}

export const menuItems: MenuItem[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  {
    id: "projects",
    icon: FolderKanban,
    label: "Projects",
    defaultOpen: true,
    children: [
      { id: "projects-all", label: "All Projects" },
      { id: "projects-roadmap", label: "Roadmap" },
      { id: "projects-backlog", label: "Backlog" },
    ],
  },
  {
    id: "analytics",
    icon: BarChart3,
    label: "Analytics",
    children: [
      { id: "analytics-overview", label: "Overview" },
      { id: "analytics-reports", label: "Reports" },
    ],
  },
  { id: "settings", icon: Settings, label: "Settings" },
]
