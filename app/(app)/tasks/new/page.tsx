import { getProfiles } from '@/actions/tasks'
import TaskForm from '@/components/tasks/TaskForm'
import Link from 'next/link'

export const metadata = { title: 'Nový úkol – Správce úkolů' }

export default async function NewTaskPage() {
  const { profiles } = await getProfiles()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/tasks" className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nový úkol</h1>
          <p className="text-gray-500 mt-0.5">Vyplňte informace o novém úkolu</p>
        </div>
      </div>
      <div className="card p-6">
        <TaskForm profiles={profiles} />
      </div>
    </div>
  )
}
