import { Outlet } from "react-router-dom"
import PortalLayout from "../apps/portal/PortalLayout"

export default function AdminLayout() {
  return (
    <div className="app-admin">
      <PortalLayout title="Admin Console" basePath="/admin">
        <Outlet />
      </PortalLayout>
    </div>
  )
}

