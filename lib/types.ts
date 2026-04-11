export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  assigned_to: string | null
  created_by: string
  created_at: string
  due_date: string | null
  assignee?: Profile | null
  creator?: Profile | null
}

export interface CreateTaskInput {
  title: string
  description?: string
  status: TaskStatus
  assigned_to?: string
  due_date?: string
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'K vyřešení',
  'in-progress': 'Probíhá',
  done: 'Hotovo',
}

export const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: 'bg-gray-100 text-gray-700 ring-gray-200',
  'in-progress': 'bg-blue-100 text-blue-700 ring-blue-200',
  done: 'bg-green-100 text-green-700 ring-green-200',
}
