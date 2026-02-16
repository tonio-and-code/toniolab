'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Calendar,
  FileText,
  Users,
  Settings,
  LogOut,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  Menu,
  X,
  ChevronRight,
  Home,
  Globe
} from 'lucide-react'
import { toast } from 'sonner'

interface SidebarProps {
  children: React.ReactNode
}

export default function CraftsmanSidebar({ children }: SidebarProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [craftsmanName, setCraftsmanName] = useState('')
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ログインフォーム
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user?.email) {
        const { data: craftsman } = await supabase
          .from('craftsmen')
          .select('*')
          .eq('email', session.user.email)
          .single()

        if (craftsman) {
          setIsAuthenticated(true)
          setCraftsmanName(craftsman.name)
        }
      }
    } catch {
      // Auth check error silently handled
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error('メールアドレスとパスワードを入力してください')
      return
    }

    setAuthLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('メールアドレスまたはパスワードが正しくありません')
        } else {
          toast.error(error.message)
        }
        return
      }

      if (data.session) {
        const { data: craftsman } = await supabase
          .from('craftsmen')
          .select('*')
          .eq('email', email)
          .single()

        if (craftsman) {
          setIsAuthenticated(true)
          setCraftsmanName(craftsman.name)
          toast.success('ログインしました')
          router.push('/craftsman/calendar')
        }
      }
    } catch {
      toast.error('ログインに失敗しました')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignUp = async () => {
    if (!email || !password) {
      toast.error('メールアドレスとパスワードを入力してください')
      return
    }

    if (password.length < 6) {
      toast.error('パスワードは6文字以上にしてください')
      return
    }

    if (!name) {
      toast.error('お名前を入力してください')
      return
    }

    setAuthLoading(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          toast.error('このメールアドレスは既に登録されています')
        } else {
          toast.error(authError.message)
        }
        return
      }

      if (authData.user) {
        const { error: insertError } = await supabase
          .from('craftsmen')
          .insert({
            name: name,
            email: email,
            trade: '内装工事'
          })

        // Ignore insert errors - proceed with registration

        toast.success('登録完了しました！')

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        })

        if (!signInError) {
          setIsAuthenticated(true)
          setCraftsmanName(name)
          router.push('/craftsman/calendar')
        }
      }
    } catch {
      toast.error('登録に失敗しました')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setCraftsmanName('')
    setEmail('')
    setPassword('')
    setName('')
    toast.success('ログアウトしました')
    router.push('/craftsman/calendar')
  }

  const menuItems = [
    {
      icon: Calendar,
      label: 'カレンダー',
      path: '/craftsman/calendar',
      color: 'text-emerald-600'
    },
    {
      icon: Users,
      label: '仲間',
      path: '/craftsman/colleagues',
      color: 'text-emerald-600'
    },
    {
      icon: Calendar,
      label: 'みんなの予定',
      path: '/craftsman/team-calendar',
      color: 'text-emerald-600'
    },
    {
      icon: Globe,
      label: '公開カレンダー',
      path: '/craftsman/public-team',
      color: 'text-emerald-600'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-emerald-50 flex">
      {/* サイドバー */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-white shadow-xl transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-72 sm:w-80 lg:translate-x-0 lg:static lg:z-auto lg:shadow-none lg:border-r lg:border-emerald-200
      `}>
        <div className="h-full flex flex-col">
          {/* ヘッダー */}
          <div className="p-4 sm:p-6 border-b bg-white border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src="/iwasaki-logo.png"
                  alt="イワサキ内装 職人ポータル"
                  width={420}
                  height={120}
                  className="object-contain"
                />
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1"
              >
                <X className="h-5 w-5 text-emerald-600" />
              </button>
            </div>
          </div>

          {/* コンテンツ */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
            {isAuthenticated ? (
              <div className="space-y-6">
                {/* ユーザー情報 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm sm:text-base">
                        {craftsmanName.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base text-emerald-900 truncate">{craftsmanName}</p>
                      <p className="text-xs text-emerald-600">ログイン中</p>
                    </div>
                  </div>
                </div>

                {/* ナビゲーション */}
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.path
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          router.push(item.path)
                          setSidebarOpen(false)
                        }}
                        className={`
                          w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all
                          ${isActive
                            ? 'bg-emerald-100 text-emerald-800 font-semibold'
                            : 'hover:bg-emerald-100 text-emerald-700'
                          }
                        `}
                      >
                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${item.color}`} />
                        <span className="flex-1 text-left text-sm sm:text-base">{item.label}</span>
                        {isActive && <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />}
                      </button>
                    )
                  })}
                </nav>

                {/* ログアウトボタン */}
                <div className="pt-4 border-t border-emerald-200">
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    ログアウト
                  </Button>
                </div>
              </div>
            ) : (
              /* ログインフォーム */
              <div className="space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-center">
                  {isSignUp ? '新規登録' : 'ログイン'}
                </h2>

                {isSignUp && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">お名前 *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="山田太郎"
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">メールアドレス *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">パスワード *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="6文字以上"
                      className="pl-10 pr-10"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          isSignUp ? handleSignUp() : handleSignIn()
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 hover:text-emerald-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={isSignUp ? handleSignUp : handleSignIn}
                  disabled={authLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      処理中...
                    </>
                  ) : (
                    isSignUp ? '登録する' : 'ログイン'
                  )}
                </Button>

                <div className="text-center">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-emerald-600 hover:underline"
                  >
                    {isSignUp ? 'すでにアカウントをお持ちの方' : '新規登録はこちら'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* モバイル用メニューボタン */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-2 sm:top-4 left-2 sm:left-4 z-40 lg:hidden bg-emerald-100 p-2 rounded-lg shadow-lg"
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-700" />
        </button>
      )}

      {/* メインコンテンツ */}
      <div className="flex-1 lg:ml-0">
        {children}
      </div>

      {/* モバイル用オーバーレイ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}