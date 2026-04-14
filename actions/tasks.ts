'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { TaskStatus, CreateTaskInput, UpdateTaskInput } from '@/lib/types'

const VALID_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done']

function validateTaskInput(data: {
  title?: string
  status?: string
}): string | null {
  if (!data.title || data.title.trim().length < 1) {
    return 'Název úkolu je povinný.'
  }
  if (data.title.trim().length > 200) {
    return 'Název úkolu může mít nejvýše 200 znaků.'
  }
  if (data.status && !VALID_STATUSES.includes(data.status as TaskStatus)) {
    return 'Neplatný stav úkolu.'
  }
  return null
}

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nejste přihlášeni.' }

  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim() || null
  const status = String(formData.get('status') ?? 'todo') as TaskStatus
  const assigned_to = String(formData.get('assigned_to') ?? '').trim() || null
  const due_date = String(formData.get('due_date') ?? '').trim() || null

  const validationError = validateTaskInput({ title, status })
  if (validationError) return { error: validationError }

  const { error } = await supabase.from('tasks').insert({
    title,
    description,
    status,
    assigned_to,
    due_date,
    created_by: user.id,
  })

  if (error) return { error: 'Nepodařilo se vytvořit úkol.' }

  revalidatePath('/dashboard')
  revalidatePath('/tasks')
  redirect('/tasks')
}

export async function updateTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nejste přihlášeni.' }

  const id = String(formData.get('id') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim() || null
  const status = String(formData.get('status') ?? 'todo') as TaskStatus
  const assigned_to = String(formData.get('assigned_to') ?? '').trim() || null
  const due_date = String(formData.get('due_date') ?? '').trim() || null

  if (!id) return { error: 'Chybí ID úkolu.' }

  const validationError = validateTaskInput({ title, status })
  if (validationError) return { error: validationError }

  const { error } = await supabase
    .from('tasks')
    .update({ title, description, status, assigned_to, due_date })
    .eq('id', id)

  if (error) return { error: 'Nepodařilo se aktualizovat úkol.' }

  revalidatePath('/dashboard')
  revalidatePath('/tasks')
  redirect('/tasks')
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nejste přihlášeni.' }

  if (!VALID_STATUSES.includes(status)) return { error: 'Neplatný stav.' }

  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)

  if (error) return { error: 'Nepodařilo se aktualizovat stav.' }

  revalidatePath('/dashboard')
  revalidatePath('/tasks')
  return { success: true }
}

export async function deleteTask(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nejste přihlášeni.' }

  if (!id) return { error: 'Chybí ID úkolu.' }

  const { error } = await supabase.from('tasks').delete().eq('id', id)

  if (error) return { error: 'Nepodařilo se smazat úkol.' }

  revalidatePath('/dashboard')
  revalidatePath('/tasks')
  return { success: true }
}

export async function getTasks(statusFilter?: TaskStatus, assigneeFilter?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { tasks: [], error: 'Nejste přihlášeni.' }

  let query = supabase
    .from('tasks')
    .select(`
      *,
      assignee:profiles!tasks_assigned_to_fkey(id, full_name, email),
      creator:profiles!tasks_created_by_fkey(id, full_name, email)
    `)
    .order('created_at', { ascending: false })

  if (statusFilter) query = query.eq('status', statusFilter)
  if (assigneeFilter) query = query.eq('assigned_to', assigneeFilter)

  const { data, error } = await query

  if (error) return { tasks: [], error: 'Nepodařilo se načíst úkoly.' }

  return { tasks: data ?? [], error: null }
}

export async function getTask(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { task: null, error: 'Nejste přihlášeni.' }

  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assignee:profiles!tasks_assigned_to_fkey(id, full_name, email),
      creator:profiles!tasks_created_by_fkey(id, full_name, email)
    `)
    .eq('id', id)
    .single()

  if (error) return { task: null, error: 'Úkol nebyl nalezen.' }

  return { task: data, error: null }
}

export async function getProfiles() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { profiles: [], error: 'Nejste přihlášeni.' }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, is_admin')
    .order('full_name')

  if (error) return { profiles: [], error: 'Nepodařilo se načíst uživatele.' }

  return { profiles: data ?? [], error: null }
}

export async function getCurrentUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, email, is_admin')
    .eq('id', user.id)
    .single()

  return data ?? null
}
