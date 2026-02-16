'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, 
  Download, 
  Trash2, 
  FileSpreadsheet,
  Calendar,
  AlertCircle,
  FileText,
  Calculator,
  ClipboardList,
  Edit2,
  Check,
  X,
  Loader2
} from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface FileMetadata {
  id?: string
  file_type: string
  file_name: string
  file_path: string
  file_size: number
  uploaded_at: string
  updated_at?: string
}

interface FileSlot {
  id: string
  label: string
  icon: React.ReactNode
  fileType: string // 'ledger', 'profit', or 'schedule'
  metadata: FileMetadata | null
}

const BUCKET_NAME = 'construction-ledger'

export default function ConstructionLedgerManager() {
  const [fileSlots, setFileSlots] = useState<FileSlot[]>([
    {
      id: 'ledger',
      label: '工事台帳',
      icon: <FileText className="h-5 w-5" />,
      fileType: 'ledger',
      metadata: null
    },
    {
      id: 'profit',
      label: 'プロジェクト管理',
      icon: <Calculator className="h-5 w-5" />,
      fileType: 'profit',
      metadata: null
    },
    {
      id: 'schedule',
      label: '工程表',
      icon: <ClipboardList className="h-5 w-5" />,
      fileType: 'schedule',
      metadata: null
    }
  ])
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState('ledger')
  const [editingFileId, setEditingFileId] = useState<string | null>(null)
  const [editingFileName, setEditingFileName] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  // Load files from Supabase on mount
  useEffect(() => {
    loadFilesFromSupabase()
  }, [])

  const loadFilesFromSupabase = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        // For anonymous users, we'll use a fixed ID or localStorage fallback
      }

      // Fetch file metadata from database
      const { data: files, error } = await supabase
        .from('construction_ledger_files')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) {
        // Fall back to localStorage if database is not set up
        loadFromLocalStorage()
        return
      }

      if (files && files.length > 0) {
        const updatedSlots = fileSlots.map(slot => {
          const fileData = files.find(f => f.file_type === slot.fileType)
          return fileData ? { ...slot, metadata: fileData } : slot
        })
        setFileSlots(updatedSlots)
      }
    } catch {
      // Fall back to localStorage
      loadFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  // Fallback to localStorage for backwards compatibility
  const loadFromLocalStorage = () => {
    const STORAGE_PREFIX = 'iwasaki_construction_ledger_'
    const updatedSlots = fileSlots.map(slot => {
      const savedFile = localStorage.getItem(STORAGE_PREFIX + slot.id)
      if (savedFile) {
        try {
          const parsedFile = JSON.parse(savedFile)
          // Convert old format to new metadata format
          const metadata: FileMetadata = {
            file_type: slot.fileType,
            file_name: parsedFile.name,
            file_path: `legacy/${slot.fileType}/${parsedFile.name}`,
            file_size: parsedFile.size,
            uploaded_at: parsedFile.uploadedAt
          }
          return { ...slot, metadata }
        } catch {
          // Ignore localStorage parse errors
        }
      }
      return slot
    })
    setFileSlots(updatedSlots)
  }

  // Upload file to Supabase Storage
  const uploadToSupabase = async (file: File, slot: FileSlot): Promise<FileMetadata | null> => {
    try {
      setUploading(true)
      
      // Get current user (optional for anonymous uploads)
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id || 'anonymous'
      
      // Generate unique file path
      const timestamp = Date.now()
      const fileExt = file.name.split('.').pop()
      const fileName = `${slot.fileType}_${timestamp}.${fileExt}`
      const filePath = `${userId}/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        toast.error(`アップロードに失敗しました: ${uploadError.message}`)
        return null
      }

      // Delete old file if exists
      if (slot.metadata?.file_path) {
        const { error: deleteError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([slot.metadata.file_path])
        
        // Ignore old file deletion errors

        // Delete old metadata
        if (slot.metadata.id) {
          await supabase
            .from('construction_ledger_files')
            .delete()
            .eq('id', slot.metadata.id)
        }
      }

      // Save metadata to database
      const metadata: Omit<FileMetadata, 'id'> = {
        file_type: slot.fileType,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        uploaded_at: new Date().toISOString()
      }

      const { data: savedMetadata, error: dbError } = await supabase
        .from('construction_ledger_files')
        .upsert({
          ...metadata,
          user_id: user?.id || null
        }, {
          onConflict: 'file_type,user_id'
        })
        .select()
        .single()

      if (dbError) {
        // Still consider it successful if file uploaded
        toast.success(`${slot.label}をアップロードしました`)
        return metadata
      }

      toast.success(`${slot.label}を保存しました`)
      return savedMetadata
    } catch {
      toast.error('アップロードに失敗しました')
      return null
    } finally {
      setUploading(false)
    }
  }

  // Handle file upload
  const handleFileUpload = useCallback(async (uploadedFile: File, slotId: string) => {
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ]
    
    if (!validTypes.includes(uploadedFile.type) && 
        !uploadedFile.name.endsWith('.xlsx') && 
        !uploadedFile.name.endsWith('.xls')) {
      toast.error('Excelファイル（.xlsx または .xls）のみアップロード可能です')
      return
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (uploadedFile.size > maxSize) {
      toast.error('ファイルサイズは10MB以下にしてください')
      return
    }

    const slot = fileSlots.find(s => s.id === slotId)
    if (!slot) return

    // Upload to Supabase
    const metadata = await uploadToSupabase(uploadedFile, slot)
    if (metadata) {
      setFileSlots(prev => prev.map(s => 
        s.id === slotId ? { ...s, metadata } : s
      ))
    }
  }, [fileSlots])

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileUpload(droppedFile, slotId)
    }
  }

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, slotId: string) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileUpload(selectedFile, slotId)
    }
  }

  // Handle file download from Supabase
  const handleDownload = async (slot: FileSlot) => {
    if (!slot.metadata) return

    try {
      // Download from Supabase Storage
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .download(slot.metadata.file_path)

      if (error) {
        toast.error(`ダウンロードに失敗しました: ${error.message}`)
        return
      }

      // Create download link
      const url = URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = slot.metadata.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success(`${slot.label}をダウンロードしました`)
    } catch {
      toast.error(`${slot.label}のダウンロードに失敗しました`)
    }
  }

  // Handle file deletion from Supabase
  const handleDelete = async (slotId: string) => {
    const slot = fileSlots.find(s => s.id === slotId)
    if (!slot || !slot.metadata) return

    if (confirm(`${slot.label}を削除してもよろしいですか？`)) {
      try {
        // Delete from Supabase Storage
        const { error: storageError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([slot.metadata.file_path])

        // Ignore storage deletion errors

        // Delete metadata from database
        if (slot.metadata.id) {
          const { error: dbError } = await supabase
            .from('construction_ledger_files')
            .delete()
            .eq('id', slot.metadata.id)

        }

        setFileSlots(prev => prev.map(s => 
          s.id === slotId ? { ...s, metadata: null } : s
        ))
        toast.success(`${slot.label}を削除しました`)
      } catch {
        toast.error(`${slot.label}の削除に失敗しました`)
      }
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Start editing file name
  const startEditingFileName = (slotId: string, currentName: string) => {
    setEditingFileId(slotId)
    // Remove extension for editing
    const nameWithoutExt = currentName.replace(/\.(xlsx?|xls)$/i, '')
    setEditingFileName(nameWithoutExt)
  }

  // Save edited file name to Supabase
  const saveFileName = async (slotId: string) => {
    const slot = fileSlots.find(s => s.id === slotId)
    if (!slot || !slot.metadata || !editingFileName.trim()) {
      setEditingFileId(null)
      return
    }

    // Get original extension
    const originalExt = slot.metadata.file_name.match(/\.(xlsx?|xls)$/i)?.[0] || '.xlsx'
    const newFileName = editingFileName.trim() + originalExt

    try {
      // Update metadata in database
      const { data, error } = await supabase
        .from('construction_ledger_files')
        .update({ file_name: newFileName })
        .eq('id', slot.metadata.id)
        .select()
        .single()

      if (error) {
        toast.error('ファイル名の変更に失敗しました')
        return
      }

      setFileSlots(prev => prev.map(s => 
        s.id === slotId ? { ...s, metadata: data } : s
      ))
      toast.success('ファイル名を変更しました')
    } catch {
      toast.error('ファイル名の変更に失敗しました')
    }

    setEditingFileId(null)
    setEditingFileName('')
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingFileId(null)
    setEditingFileName('')
  }

  const renderFileSlot = (slot: FileSlot) => (
    <div key={slot.id} className="space-y-3">
      {!slot.metadata ? (
        // Upload area
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-colors duration-200
            ${isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, slot.id)}
          onClick={() => document.getElementById(`excel-file-input-${slot.id}`)?.click()}
        >
          <Upload className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            クリックまたはドラッグ&ドロップ
          </p>
          <p className="text-xs text-gray-500">
            Excel形式 (.xlsx, .xls) 最大10MB
          </p>
          <input
            id={`excel-file-input-${slot.id}`}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => handleFileInputChange(e, slot.id)}
          />
        </div>
      ) : (
        // File display
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <FileSpreadsheet className="h-10 w-10 text-green-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  {editingFileId === slot.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingFileName}
                        onChange={(e) => setEditingFileName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') saveFileName(slot.id)
                          if (e.key === 'Escape') cancelEditing()
                        }}
                        className="h-7 text-sm"
                        autoFocus
                      />
                      <span className="text-sm text-gray-500">.xlsx</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => saveFileName(slot.id)}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={cancelEditing}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <p className="font-medium text-sm text-gray-900 break-all flex-1">
                        {slot.metadata?.file_name}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => startEditingFileName(slot.id, slot.metadata!.file_name)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatFileSize(slot.metadata?.file_size || 0)}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {slot.metadata?.uploaded_at && format(new Date(slot.metadata.uploaded_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleDownload(slot)}
              size="sm"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              ダウンロード
            </Button>
            <Button
              onClick={() => handleDelete(slot.id)}
              size="sm"
              variant="destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Replace file button */}
          <Button
            onClick={() => document.getElementById(`excel-file-replace-${slot.id}`)?.click()}
            size="sm"
            variant="outline"
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            ファイルを更新
          </Button>
          <input
            id={`excel-file-replace-${slot.id}`}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => handleFileInputChange(e, slot.id)}
          />
        </div>
      )}
    </div>
  )

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          工事台帳管理
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            {fileSlots.map(slot => (
              <TabsTrigger 
                key={slot.id} 
                value={slot.id}
                className="flex items-center gap-2"
              >
                {slot.icon}
                <span className="hidden sm:inline">{slot.label}</span>
                {slot.metadata && (
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-1" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {uploading && (
            <div className="mt-4 flex items-center justify-center py-4 bg-blue-50 rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
              <span className="text-sm text-blue-700">アップロード中...</span>
            </div>
          )}
          
          {fileSlots.map(slot => (
            <TabsContent key={slot.id} value={slot.id}>
              {renderFileSlot(slot)}
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800 space-y-1">
              <p>• 工事台帳: 案件の詳細情報を管理</p>
              <p>• プロジェクト管理: プロジェクト全体の管理表</p>
              <p>• 工程表: 工事スケジュールを管理</p>
              <p className="mt-1 font-semibold">• ファイルはクラウドに保存され、どこからでもアクセス可能です</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}