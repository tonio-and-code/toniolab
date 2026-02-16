'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Send, User, Bot, Mountain, Trash2, Edit2,
  MoreVertical, RefreshCw, Trash, X, Check
} from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Message {
  id: number;
  type: 'question' | 'answer';
  question: string;
  answer?: string;
  status: 'pending' | 'answered';
  created_at: string;
}

export default function KazuoConsulting() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showClearDialog, setShowClearDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const defaultThreadId = '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    initializeThread();
    fetchMessages();

    // リアルタイム更新の設定
    const channel = supabase
      .channel('consulting_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'consulting_notes',
        filter: `thread_id=eq.${defaultThreadId}`
      }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeThread = async () => {
    try {
      const { data: thread } = await supabase
        .from('consulting_threads')
        .select('*')
        .eq('id', defaultThreadId)
        .single();

      if (!thread) {
        await supabase
          .from('consulting_threads')
          .insert({
            id: defaultThreadId,
            title: '岩崎社長との対話',
            description: '日常の経営相談',
            category: '経営相談'
          });
      }
    } catch {
      // Thread initialization error silently handled
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('consulting_notes')
        .select('*')
        .eq('thread_id', defaultThreadId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch {
      // Error fetching messages silently handled
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { data, error } = await supabase
        .from('consulting_notes')
        .insert({
          thread_id: defaultThreadId,
          type: 'question',
          question: newMessage,
          status: 'pending',
          category: '経営相談'
        })
        .select()
        .single();

      if (error) throw error;

      setMessages([...messages, data]);
      setNewMessage('');

      toast.success('質問を送信しました。ターミナルで「コンサル」と入力してください。');

    } catch {
      toast.error('送信に失敗しました');
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      const { error } = await supabase
        .from('consulting_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.filter(m => m.id !== id));
      toast.success('メッセージを削除しました');
    } catch {
      toast.error('削除に失敗しました');
    }
  };

  const startEdit = (message: Message) => {
    setEditingId(message.id);
    setEditingText(message.type === 'question' ? message.question : message.answer || '');
  };

  const saveEdit = async () => {
    if (!editingId || !editingText.trim()) return;

    try {
      const message = messages.find(m => m.id === editingId);
      if (!message) return;

      const updateData = message.type === 'question'
        ? { question: editingText }
        : { answer: editingText };

      const { error } = await supabase
        .from('consulting_notes')
        .update(updateData)
        .eq('id', editingId);

      if (error) throw error;

      setMessages(messages.map(m =>
        m.id === editingId
          ? { ...m, ...updateData }
          : m
      ));

      setEditingId(null);
      setEditingText('');
      toast.success('メッセージを更新しました');
    } catch {
      toast.error('更新に失敗しました');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const clearAllMessages = async () => {
    try {
      const { error } = await supabase
        .from('consulting_notes')
        .delete()
        .eq('thread_id', defaultThreadId);

      if (error) throw error;

      setMessages([]);
      setShowClearDialog(false);
      toast.success('すべてのメッセージを削除しました');
    } catch {
      toast.error('削除に失敗しました');
    }
  };

  return (
    <Card className="h-[calc(100vh-120px)] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Mountain className="h-5 w-5 text-green-600" />
            岩崎社長の経営相談室
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMessages}
              title="更新"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearDialog(true)}
              title="すべて削除"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          質問を入力して送信後、ターミナルで「コンサル」と入力すると回答が生成されます
        </p>
      </CardHeader>
      <Separator />

      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                読み込み中...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                質問をどうぞ
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex gap-3 group">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'question' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {message.type === 'question' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {message.type === 'question' ? '岩崎社長' : 'Claude'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(message.created_at), 'M月d日 HH:mm', { locale: ja })}
                      </span>
                      {message.status === 'pending' && message.type === 'question' && (
                        <Badge variant="secondary" className="text-xs">
                          回答待ち
                        </Badge>
                      )}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEdit(message)}>
                              <Edit2 className="h-3 w-3 mr-2" />
                              編集
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => deleteMessage(message.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-3 w-3 mr-2" />
                              削除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      {editingId === message.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="min-h-[60px]"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={saveEdit}>
                              <Check className="h-3 w-3 mr-1" />
                              保存
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEdit}>
                              <X className="h-3 w-3 mr-1" />
                              キャンセル
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">
                          {message.type === 'question' ? message.question : (message.answer || '...')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Separator />
        <div className="p-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="質問を入力..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="flex-1"
              rows={3}
            />
            <Button onClick={sendMessage} className="self-end">
              <Send className="h-4 w-4 mr-1" />
              送信
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Enter で送信 | 送信後、ターミナルで「コンサル」と入力
          </p>
        </div>
      </CardContent>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>すべてのメッセージを削除</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。本当にすべてのメッセージを削除しますか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={clearAllMessages}>
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}