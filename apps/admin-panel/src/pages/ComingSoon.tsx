import { EmptyState } from '@venue404/ui'
import { Construction } from 'lucide-react'
import { AdminLayout } from '../components/AdminLayout'

type ComingSoonProps = {
  title: string
  description: string
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <AdminLayout pageTitle={title}>
      <div className="py-16">
        <EmptyState
          icon={<Construction className="h-5 w-5" />}
          title={title}
          description={description}
        />
      </div>
    </AdminLayout>
  )
}
