'use client'

import { useTransition } from 'react'
import { updateTaskStatus } from '@/actions/tasks'
import { STATUS_LABELS, STATUS_COLORS, type TaskStatus } from '@/lib/types'

const STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done']

interface StatusSelectProps {
  taskId: string
  currentStatus: TaskStatus
}

export default function StatusSelect({ taskId, currentStatus }: StatusSelectProps) {
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as TaskStatus
    startTransition(async () => {
      await updateTaskStatus(taskId, newStatus)
    })
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className={`text-xs font-medium rounded-full px-2.5 py-1 ring-1 ring-inset border-0 cursor-pointer disabled:opacity-50 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 ${STATUS_COLORS[currentStatus]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
      ))}
    </select>
  )
}
