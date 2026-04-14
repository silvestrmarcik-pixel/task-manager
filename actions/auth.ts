'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Heslo musí mít alespoň 8 znaků.'
  return null
}

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!validateEmail(email)) {
    return { error: 'Zadejte platnou e-mailovou adresu.' }
  }
  if (!password) {
    return { error: 'Zadejte heslo.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Neplatný e-mail nebo heslo.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function register(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const fullName = String(formData.get('full_name') ?? '').trim()

  if (!fullName || fullName.length < 2) {
    return { error: 'Zadejte celé jméno (alespoň 2 znaky).' }
  }
  if (!validateEmail(email)) {
    return { error: 'Zadejte platnou e-mailovou adresu.' }
  }
  const passwordError = validatePassword(password)
  if (passwordError) return { error: passwordError }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Tento e-mail je již zaregistrován.' }
    }
    return { error: 'Registrace se nezdařila. Zkuste to znovu.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
