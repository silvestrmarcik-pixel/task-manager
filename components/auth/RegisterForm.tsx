'use client'

import { useState, useTransition } from 'react'
import { register } from '@/actions/auth'

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await register(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="full_name" className="label">Celé jméno</label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          required
          placeholder="Jan Novák"
          className="input"
        />
      </div>
      <div>
        <label htmlFor="email" className="label">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="vas@email.cz"
          className="input"
        />
      </div>
      <div>
        <label htmlFor="password" className="label">Heslo</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="••••••••"
          className="input"
        />
        <p className="text-xs text-gray-500 mt-1">Alespoň 8 znaků</p>
      </div>
      <button type="submit" disabled={isPending} className="btn-primary w-full">
        {isPending ? 'Registrace…' : 'Zaregistrovat se'}
      </button>
    </form>
  )
}
