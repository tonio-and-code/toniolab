'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Plus, Send, Clock, Tag, ChevronRight, User, Bot, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toast } from 'sonner';

interface Thread {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  last_message_at: string;
  message_count?: number;
}

interface Message {
  id: number;
  thread_id: string;
  parent_id?: number;
  type: 'question' | 'answer';
  question: string;
  answer?: string;
  status: 'pending' | 'answered';
  created_at: string;
  answered_at?: string;
  metadata?: any;
}

export default function ConsultingThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadDescription, setNewThreadDescription] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    if (selectedThread) {
      fetchMessages(selectedThread.id);
    }
  }, [selectedThread]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchThreads = async () => {
    try {
      const { data: threadData, error: threadError } = await supabase
        .from('consulting_threads')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (threadError) {
        throw threadError;
      }

      // 各スレッドのメッセージ数を取得
      const threadsWithCounts = await Promise.all(
        (threadData || []).map(async (thread) => {
          const { count, error: countError } = await supabase
            .from('consulting_notes')
            .select('*', { count: 'exact', head: true })
            .eq('thread_id', thread.id);

          // Ignore count errors

          return { ...thread, message_count: count || 0 };
        })
      );

      setThreads(threadsWithCounts);
    } catch (error: any) {
      toast.error(`スレッドの取得に失敗しました: ${error?.message || 'Unknown error'}`);
    }
  };

  const fetchMessages = async (threadId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('consulting_notes')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }
      setMessages(data || []);
    } catch (error: any) {
      toast.error(`メッセージの取得に失敗しました: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const createThread = async () => {
    if (!newThreadTitle.trim()) {
      toast.error('スレッドタイトルを入力してください');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('consulting_threads')
        .insert({
          title: newThreadTitle,
          description: newThreadDescription || null,
          category: '一般',
          order_index: 0  // order_indexを追加
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setThreads([data, ...threads]);
      setSelectedThread(data);
      setNewThreadTitle('');
      setNewThreadDescription('');
      setShowNewThreadForm(false);
      toast.success('新しいスレッドを作成しました');
    } catch (error: any) {
      toast.error(`スレッドの作成に失敗しました: ${error?.message || error?.code || 'Unknown error'}`);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedThread) {
      toast.error('メッセージを入力してください');
      return;
    }

    setLoading(true);
    try {
      // 最後のメッセージを取得して、親IDを設定
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

      const { data, error } = await supabase
        .from('consulting_notes')
        .insert({
          thread_id: selectedThread.id,
          parent_id: lastMessage?.id || null,
          type: 'question',
          question: newMessage,
          status: 'pending',
          category: selectedThread.category || '一般'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMessages([...messages, data]);
      const questionText = newMessage;
      setNewMessage('');
      toast.success('質問を送信しました。AI回答を生成中...');

      // AI回答を生成
      try {
        const response = await fetch('/api/generate-consulting-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: data.id,
            threadId: selectedThread.id,
            question: questionText
          })
        });

        if (!response.ok) {
          throw new Error('AI回答の生成に失敗しました');
        }

        const result = await response.json();

        // メッセージリストを更新
        await fetchMessages(selectedThread.id);
        toast.success('AI回答を生成しました');
      } catch {
        toast.error('AI回答の生成に失敗しました。後ほど手動で回答を追加してください。');
      }

      // スレッドリストを更新
      fetchThreads();
    } catch (error: any) {
      toast.error(`メッセージの送信に失敗しました: ${error?.message || error?.code || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteThread = async (threadId: string) => {
    if (!confirm('このスレッドを削除してもよろしいですか？')) return;

    try {
      const { error } = await supabase
        .from('consulting_threads')
        .delete()
        .eq('id', threadId);

      if (error) throw error;

      setThreads(threads.filter(t => t.id !== threadId));
      if (selectedThread?.id === threadId) {
        setSelectedThread(null);
        setMessages([]);
      }
      toast.success('スレッドを削除しました');
    } catch {
      toast.error('スレッドの削除に失敗しました');
    }
  };

  const getMessageIcon = (type: string) => {
    return type === 'question' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />;
  };

  const getMessageContent = (message: Message) => {
    if (message.type === 'question') {
      return message.question;
    }
    return message.answer || '回答待ち...';
  };

  return (
    <div className="h-[calc(100vh-100px)] flex gap-4">
      {/* スレッド一覧 */}
      <Card className="w-1/3 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">スレッド一覧</CardTitle>
            <Button
              size="sm"
              variant={showNewThreadForm ? "secondary" : "default"}
              onClick={() => setShowNewThreadForm(!showNewThreadForm)}
            >
              <Plus className="h-4 w-4 mr-1" />
              新規
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {showNewThreadForm && (
            <div className="p-4 border-b">
              <Input
                placeholder="スレッドタイトル"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                className="mb-2"
              />
              <Textarea
                placeholder="説明（任意）"
                value={newThreadDescription}
                onChange={(e) => setNewThreadDescription(e.target.value)}
                className="mb-2 h-20"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={createThread}>
                  作成
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowNewThreadForm(false);
                    setNewThreadTitle('');
                    setNewThreadDescription('');
                  }}
                >
                  キャンセル
                </Button>
              </div>
            </div>
          )}

          <ScrollArea className="h-[calc(100%-80px)]">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedThread?.id === thread.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedThread(thread)}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-medium text-sm flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1 text-gray-400" />
                    {thread.title}
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteThread(thread.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                {thread.description && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {thread.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {thread.message_count || 0} メッセージ
                    </Badge>
                    {thread.category && (
                      <Badge variant="outline" className="text-xs">
                        {thread.category}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(thread.last_message_at), 'M/d HH:mm', { locale: ja })}
                  </span>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* メッセージエリア */}
      <Card className="flex-1 flex flex-col">
        {selectedThread ? (
          <>
            <CardHeader className="pb-3">
              <div>
                <CardTitle className="text-lg">{selectedThread.title}</CardTitle>
                {selectedThread.description && (
                  <p className="text-sm text-gray-600 mt-1">{selectedThread.description}</p>
                )}
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="flex-1 p-0 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">読み込み中...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      まだメッセージがありません。質問を入力してください。
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div key={message.id} className="flex gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'question' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {getMessageIcon(message.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">
                              {message.type === 'question' ? 'あなた' : 'AI'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(message.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
                            </span>
                            {message.status === 'pending' && message.type === 'question' && (
                              <Badge variant="secondary" className="text-xs">
                                回答待ち
                              </Badge>
                            )}
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm whitespace-pre-wrap">{getMessageContent(message)}</p>
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
                    placeholder="質問を入力してください..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        sendMessage();
                      }
                    }}
                    className="flex-1"
                    rows={3}
                  />
                  <Button onClick={sendMessage} className="self-end" disabled={loading}>
                    <Send className="h-4 w-4 mr-1" />
                    {loading ? '生成中...' : '送信'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Ctrl + Enter で送信 | 質問を送信すると自動的にAI回答が生成されます
                </p>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            左側からスレッドを選択するか、新しいスレッドを作成してください
          </div>
        )}
      </Card>
    </div>
  );
}