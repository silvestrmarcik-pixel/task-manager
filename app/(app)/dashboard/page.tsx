import { createClient } from '@/lib/supabase/server'
import { getTasks } from '@/actions/tasks'
import StatusBadge from '@/components/tasks/StatusBadge'
import Link from 'next/link'
import type { TaskStatus } from '@/lib/types'

export const metadata = { title: 'Přehled – Správce úkolů' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { tasks } = await getTasks()

  const counts = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
    mine: tasks.filter((t) => t.assigned_to === user?.id || t.created_by === user?.id).length,
  }

  const recentTasks = tasks.slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Přehled</h1>
          <p className="text-gray-500 mt-1">Celkový přehled úkolů týmu</p>
        </div>
        <Link href="/tasks/new" className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nový úkol
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Celkem úkolů" value={counts.total} color="blue" />
        <StatCard label="K vyřešení" value={counts.todo} color="gray" />
        <StatCard label="Probíhá" value={counts['in-progress']} color="blue" />
        <StatCard label="Hotovo" value={counts.done} color="green" />
      </div>

      {/* Recent tasks */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Poslední úkoly</h2>
          <Link href="/tasks" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
            Zobrazit vše
          </Link>
        </div>
        {recentTasks.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>Žádné úkoly. <Link href="/tasks/new" className="text-blue-600 hover:underline">Vytvořte první úkol.</Link></p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentTasks.map((task) => (
              <li key={task.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <Link href={`/tasks/${task.id}/edit`} className="font-medium text-gray-900 hover:text-blue-600 truncate block">
                    {task.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {task.assignee?.full_name
                      ? `Přiřazeno: ${task.assignee.full_name}`
                      : 'Nepřiřazeno'}
                    {task.due_date && ` · Termín: ${formatDate(task.due_date)}`}
                  </p>
                </div>
                <StatusBadge status={task.status as TaskStatus} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    gray: 'bg-gray-100 text-gray-700',
    green: 'bg-green-50 text-green-700',
  }
  return (
    <div className="card p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${colorMap[color] ?? ''} rounded-lg px-2 py-0.5 inline-block`}>
        {value}
      </p>
    </div>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('cs-CZ', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}
