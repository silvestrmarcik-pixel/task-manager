'use client'

import { useState } from 'react'
import Link from 'next/link'
import StatusSelect from './StatusSelect'
import DeleteTaskDialog from './DeleteTaskDialog'
import type { Task, Profile, TaskStatus } from '@/lib/types'
import { STATUS_LABELS } from '@/lib/types'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface TaskListProps {
  tasks: Task[]
  profiles: Profile[]
}

const ALL_STATUSES: { value: string; label: string }[] = [
  { value: '', label: 'Všechny stavy' },
  { value: 'todo', label: STATUS_LABELS.todo },
  { value: 'in-progress', label: STATUS_LABELS['in-progress'] },
  { value: 'done', label: STATUS_LABELS.done },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('cs-CZ', {
    day: 'numeric', month: 'short',
  })
}

function isOverdue(dueDate: string | null, status: TaskStatus) {
  if (!dueDate || status === 'done') return false
  return new Date(dueDate) < new Date()
}

export default function TaskList({ tasks, profiles }: TaskListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get('status') ?? ''
  const currentAssignee = searchParams.get('assignee') ?? ''

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">Stav:</label>
          <select
            value={currentStatus}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="input py-1.5 text-sm w-auto"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">Přiřazeno:</label>
          <select
            value={currentAssignee}
            onChange={(e) => updateFilter('assignee', e.target.value)}
            className="input py-1.5 text-sm w-auto"
          >
            <option value="">Všichni uživatelé</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name ?? p.email ?? p.id}
              </option>
            ))}
          </select>
        </div>
        {(currentStatus || currentAssignee) && (
          <button
            onClick={() => router.push(pathname)}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Zrušit filtry
          </button>
        )}
        <span className="ml-auto text-sm text-gray-500 self-center">
          {tasks.length} {tasks.length === 1 ? 'úkol' : tasks.length < 5 ? 'úkoly' : 'úkolů'}
        </span>
      </div>

      {/* Task table — desktop */}
      <div className="card overflow-hidden hidden sm:block">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Název</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Přiřazeno</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stav</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Termín</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Akce</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Žádné úkoly odpovídají filtrům
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/tasks/${task.id}/edit`}
                      className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
                    >
                      {task.title}
                    </Link>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{task.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {task.assignee?.full_name ?? task.assignee?.email ?? (
                      <span className="text-gray-400 italic">Nepřiřazeno</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusSelect taskId={task.id} currentStatus={task.status as TaskStatus} />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {task.due_date ? (
                      <span className={isOverdue(task.due_date, task.status as TaskStatus) ? 'text-red-600 font-medium' : 'text-gray-600'}>
                        {formatDate(task.due_date)}
                        {isOverdue(task.due_date, task.status as TaskStatus) && ' ⚠'}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/tasks/${task.id}/edit`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Upravit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <DeleteTaskDialog taskId={task.id} taskTitle={task.title} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Task cards — mobile */}
      <div className="sm:hidden space-y-3">
        {tasks.length === 0 ? (
          <div className="card px-6 py-12 text-center text-gray-500">
            Žádné úkoly odpovídají filtrům
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="card p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/tasks/${task.id}/edit`} className="font-medium text-gray-900 hover:text-blue-600">
                  {task.title}
                </Link>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link
                    href={`/tasks/${task.id}/edit`}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <DeleteTaskDialog taskId={task.id} taskTitle={task.title} />
                </div>
              </div>
              {task.description && (
                <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
              )}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <StatusSelect taskId={task.id} currentStatus={task.status as TaskStatus} />
                <div className="text-sm text-gray-500 flex items-center gap-3">
                  {task.assignee?.full_name && <span>{task.assignee.full_name}</span>}
                  {task.due_date && (
                    <span className={isOverdue(task.due_date, task.status as TaskStatus) ? 'text-red-600 font-medium' : ''}>
                      {formatDate(task.due_date)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
