import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export const metadata = { title: 'Přihlášení – Správce úkolů' }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Správce úkolů</h1>
          <p className="text-gray-500 mt-1">Přihlaste se ke svému účtu</p>
        </div>
        <div className="card p-8">
          <LoginForm />
          <p className="text-center text-sm text-gray-600 mt-6">
            Nemáte účet?{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Zaregistrujte se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
