'use client'

import { useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type ImageUploadProps = {
  onUploadComplete: (url: string) => void
  currentImage?: string | null
  onRemove?: () => void
}

export default function ImageUpload({ onUploadComplete, currentImage, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      toast.error('ファイルサイズは5MB以下にしてください')
      return
    }

    // 画像ファイルチェック
    if (!file.type.startsWith('image/')) {
      toast.error('画像ファイルを選択してください')
      return
    }

    setIsUploading(true)

    try {
      // プレビュー表示
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)

      // 1. サーバーからダイレクトアップロード用URLを取得
      const uploadUrlResponse = await fetch('/api/upload', {
        method: 'POST',
      })

      if (!uploadUrlResponse.ok) {
        throw new Error('アップロードURLの取得に失敗しました')
      }

      const { uploadURL } = await uploadUrlResponse.json()

      // 2. Cloudflare Imagesへ直接アップロード
      const formData = new FormData()
      formData.append('file', file)

      const cloudflareResponse = await fetch(uploadURL, {
        method: 'POST',
        body: formData,
      })

      const cloudflareResult = await cloudflareResponse.json()

      if (!cloudflareResult.success) {
        throw new Error('Cloudflareへのアップロードに失敗しました')
      }

      // 3. アップロード完了（variantsの最初のURLを使用、またはpublic URLを構築）
      const imageDeliveryUrl = cloudflareResult.result.variants[0]

      toast.success('画像をアップロードしました')
      onUploadComplete(imageDeliveryUrl)

    } catch (error: any) {
      toast.error(error.message || 'アップロードに失敗しました')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    if (onRemove) onRemove()
  }

  return (
    <div className="space-y-3">
      {previewUrl ? (
        <div className="relative border border-[#DAE2E8] overflow-hidden group">
          <img src={previewUrl} alt="アップロード画像" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="block border-2 border-dashed border-[#DAE2E8] p-8 text-center hover:border-[#10B981] transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-12 h-12 text-[#10B981] animate-spin" />
              <span className="text-sm text-[#252423]/70">アップロード中...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <p className="text-sm font-bold text-[#252423]">画像をアップロード</p>
                <p className="text-xs text-[#252423]/60">クリックまたはドラッグ&ドロップ（最大5MB）</p>
              </div>
            </div>
          )}
        </label>
      )}
    </div>
  )
}
