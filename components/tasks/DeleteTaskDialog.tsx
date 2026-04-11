'use client'

import { useState, useTransition } from 'react'
import { deleteTask } from '@/actions/tasks'

interface DeleteTaskDialogProps {
  taskId: string
  taskTitle: string
}

export default function DeleteTaskDialog({ taskId, taskTitle }: DeleteTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteTask(taskId)
      if (result?.error) {
        setError(result.error)
      } else {
        setOpen(false)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        title="Smazat úkol"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Smazat úkol</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Opravdu chcete smazat úkol <span className="font-medium text-gray-700">&ldquo;{taskTitle}&rdquo;</span>?
                  Tuto akci nelze vrátit zpět.
                </p>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="btn-secondary"
              >
                Zrušit
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="btn-danger"
              >
                {isPending ? 'Mazání…' : 'Smazat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
