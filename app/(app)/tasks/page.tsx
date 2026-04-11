import { getTasks, getProfiles } from '@/actions/tasks'
import TaskList from '@/components/tasks/TaskList'
import Link from 'next/link'
import type { TaskStatus } from '@/lib/types'

export const metadata = { title: 'Úkoly – Správce úkolů' }

interface SearchParams {
  status?: string
  assignee?: string
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const statusFilter = params.status as TaskStatus | undefined
  const assigneeFilter = params.assignee

  const [{ tasks }, { profiles }] = await Promise.all([
    getTasks(statusFilter, assigneeFilter),
    getProfiles(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Úkoly</h1>
          <p className="text-gray-500 mt-1">Správa všech úkolů týmu</p>
        </div>
        <Link href="/tasks/new" className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nový úkol
        </Link>
      </div>

      <TaskList tasks={tasks} profiles={profiles} />
    </div>
  )
}
