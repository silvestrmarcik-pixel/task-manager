'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/actions/auth'
import { useState } from 'react'

interface NavbarProps {
  userName: string
  userEmail: string
}

export default function Navbar({ userName, userEmail }: NavbarProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: '/dashboard', label: 'Přehled' },
    { href: '/tasks', label: 'Úkoly' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-gray-900">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="hidden sm:block">Správce úkolů</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith(link.href)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[160px] truncate">
                {userName}
              </span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 card z-20 py-1 shadow-lg">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>
                  <div className="py-1">
                    {/* Mobile nav links */}
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="sm:hidden flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <form action={logout}>
                      <button
                        type="submit"
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Odhlásit se
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
