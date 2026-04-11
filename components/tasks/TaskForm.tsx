'use client'

import { useState, useTransition } from 'react'
import { createTask, updateTask } from '@/actions/tasks'
import type { Task, Profile, TaskStatus } from '@/lib/types'
import { STATUS_LABELS } from '@/lib/types'

interface TaskFormProps {
  profiles: Profile[]
  task?: Task
}

export default function TaskForm({ profiles, task }: TaskFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const isEditing = !!task

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = isEditing ? await updateTask(formData) : await createTask(formData)
      if (result?.error) setError(result.error)
    })
  }

  const statuses: TaskStatus[] = ['todo', 'in-progress', 'done']

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isEditing && <input type="hidden" name="id" value={task.id} />}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="label">
          Název úkolu <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={task?.title ?? ''}
          placeholder="Stručný popis úkolu"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="description" className="label">Popis</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={task?.description ?? ''}
          placeholder="Podrobný popis úkolu (volitelné)"
          className="input resize-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="label">Stav</label>
          <select
            id="status"
            name="status"
            defaultValue={task?.status ?? 'todo'}
            className="input"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="assigned_to" className="label">Přiřadit uživateli</label>
          <select
            id="assigned_to"
            name="assigned_to"
            defaultValue={task?.assigned_to ?? ''}
            className="input"
          >
            <option value="">— Nepřiřazeno —</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name ?? p.email ?? p.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="due_date" className="label">Termín splnění</label>
        <input
          id="due_date"
          name="due_date"
          type="date"
          defaultValue={task?.due_date ?? ''}
          className="input"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending
            ? isEditing ? 'Ukládání…' : 'Vytváření…'
            : isEditing ? 'Uložit změny' : 'Vytvořit úkol'}
        </button>
        <a href="/tasks" className="btn-secondary">Zrušit</a>
      </div>
    </form>
  )
}
