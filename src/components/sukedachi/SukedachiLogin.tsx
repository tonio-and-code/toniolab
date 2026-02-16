'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ExternalLink, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

export default function SukedachiLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({
    organizationId: '',
    email: '',
    password: ''
  })

  const handleLogin = () => {
    const loginUrl = 'https://web.suke-dachi.jp/app/auth/org/login/email'

    // 新しいウィンドウで開く
    const newWindow = window.open(loginUrl, '_blank')

    if (newWindow) {
      toast.info('助太刀のログインページを開きました。認証情報をコピーして使用してください。')
    } else {
      toast.error('ポップアップがブロックされました。ブラウザの設定を確認してください。')
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label}をコピーしました`)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">助太刀</h1>
        <p className="text-muted-foreground mt-2">
          助太刀システムへのログイン情報管理
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>ログイン情報</CardTitle>
            <CardDescription>
              以下の認証情報を使用して助太刀にログインしてください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organizationId">組織ID</Label>
              <div className="flex gap-2">
                <Input
                  id="organizationId"
                  value={credentials.organizationId}
                  readOnly
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(credentials.organizationId, '組織ID')}
                >
                  コピー
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  readOnly
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(credentials.email, 'メールアドレス')}
                >
                  コピー
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    readOnly
                    className="font-mono pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(credentials.password, 'パスワード')}
                >
                  コピー
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleLogin}
                className="w-full"
                size="lg"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                助太刀を開く
              </Button>
            </div>

            <div className="text-sm text-muted-foreground pt-2">
              <p>※ ログインページが新しいタブで開きます</p>
              <p>※ 認証情報は上記からコピーして入力してください</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>使い方</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              <li>「助太刀を開く」ボタンをクリックして、ログインページを開きます</li>
              <li>各認証情報の「コピー」ボタンをクリックして、情報をクリップボードにコピーします</li>
              <li>助太刀のログインページで、コピーした情報を貼り付けてログインします</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}