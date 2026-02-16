'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Building, User, Calendar, ExternalLink, Briefcase } from 'lucide-react'
import type { Craftsman } from '@/types/database'

interface CraftsmanDetailModalProps {
  craftsman: Craftsman | null
  isOpen: boolean
  onClose: () => void
}

export function CraftsmanDetailModal({ craftsman, isOpen, onClose }: CraftsmanDetailModalProps) {
  if (!craftsman) return null

  const details = craftsman.details as any || {}

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            {craftsman.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 基本情報カード */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="default">{craftsman.trade}</Badge>
                {details.age && (
                  <span className="text-sm text-muted-foreground">
                    {details.age}歳
                  </span>
                )}
                {details.employment_type && (
                  <Badge variant="outline">{details.employment_type}</Badge>
                )}
              </div>

              {details.company_name && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{details.company_name}</span>
                </div>
              )}

              {details.residence && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{details.residence}</span>
                </div>
              )}

              {craftsman.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${craftsman.phone}`} className="text-blue-600 hover:underline">
                    {craftsman.phone}
                  </a>
                </div>
              )}

              {craftsman.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${craftsman.email}`} className="text-blue-600 hover:underline">
                    {craftsman.email}
                  </a>
                </div>
              )}

              {craftsman.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{craftsman.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 対応エリア */}
          {details.coverage_areas && details.coverage_areas.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  対応エリア
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {details.coverage_areas.map((area: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 対応職種 */}
          {details.coverage_trades && details.coverage_trades.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  対応職種
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {details.coverage_trades.map((trade: string, index: number) => (
                    <Badge key={index} variant="default">
                      {trade}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 自己紹介 */}
          {(details.introduction || details.self_introduction) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">自己紹介</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {details.introduction || details.self_introduction}
                </p>
              </CardContent>
            </Card>
          )}

          {/* 助太刀リンク */}
          {(craftsman.sukedachi_url || details.sukedachi_profile_url) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">助太刀プロフィール</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={craftsman.sukedachi_url || details.sukedachi_profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  助太刀プロフィールを見る
                </a>
              </CardContent>
            </Card>
          )}

          {/* 備考 */}
          {craftsman.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">備考</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {craftsman.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* ステータス */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">ステータス</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {craftsman.message_sent && (
                  <Badge variant="outline">メッセージ送信済み</Badge>
                )}
                {craftsman.awaiting_reply && (
                  <Badge variant="secondary">返信待ち</Badge>
                )}
                {!craftsman.message_sent && !craftsman.awaiting_reply && (
                  <Badge variant="outline">未連絡</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}