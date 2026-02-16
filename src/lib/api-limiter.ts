/**
 * APIレート制限管理
 * Google Maps API等の外部API使用を制限
 */

type APIUsage = {
  count: number
  resetTime: number
}

class APILimiter {
  private storage: Map<string, APIUsage> = new Map()

  // 制限設定
  private limits = {
    'google-maps': {
      perDay: 1000,      // 1日1,000リクエスト
      perHour: 100,      // 1時間100リクエスト
      perMinute: 10      // 1分10リクエスト
    },
    'ai-analysis': {
      perDay: 50,        // 1日50リクエスト（GPT-4o Vision は高額）
      perHour: 10,       // 1時間10リクエスト
      perMinute: 3       // 1分3リクエスト
    },
    'contact-form': {
      perDay: 100,       // 1日100リクエスト
      perHour: 10,       // 1時間10リクエスト
      perMinute: 2       // 1分2リクエスト（スパム防止）
    }
  }

  /**
   * APIリクエスト可否をチェック
   */
  canRequest(apiName: string, period: 'day' | 'hour' | 'minute' = 'day'): boolean {
    const key = `${apiName}-${period}`
    const usage = this.storage.get(key)
    const now = Date.now()

    // リセット時間の計算
    const resetTime = this.getResetTime(period)

    // リセット時間を過ぎていたらカウンターリセット
    if (usage && now >= usage.resetTime) {
      this.storage.delete(key)
      return true
    }

    // 制限チェック
    const limit = this.getLimit(apiName, period)
    if (!usage) return true

    return usage.count < limit
  }

  /**
   * APIリクエストを記録
   */
  recordRequest(apiName: string) {
    const now = Date.now()

    // 各期間でカウント
    ;(['day', 'hour', 'minute'] as const).forEach(period => {
      const key = `${apiName}-${period}`
      const usage = this.storage.get(key)
      const resetTime = this.getResetTime(period)

      if (!usage || now >= usage.resetTime) {
        this.storage.set(key, { count: 1, resetTime })
      } else {
        usage.count++
      }
    })
  }

  /**
   * 使用状況を取得
   */
  getUsage(apiName: string): {
    day: { used: number; limit: number; remaining: number }
    hour: { used: number; limit: number; remaining: number }
    minute: { used: number; limit: number; remaining: number }
  } {
    const result = {
      day: this.getUsageForPeriod(apiName, 'day'),
      hour: this.getUsageForPeriod(apiName, 'hour'),
      minute: this.getUsageForPeriod(apiName, 'minute')
    }
    return result
  }

  private getUsageForPeriod(apiName: string, period: 'day' | 'hour' | 'minute') {
    const key = `${apiName}-${period}`
    const usage = this.storage.get(key)
    const limit = this.getLimit(apiName, period)
    const used = usage?.count || 0

    return {
      used,
      limit,
      remaining: Math.max(0, limit - used)
    }
  }

  private getLimit(apiName: string, period: 'day' | 'hour' | 'minute'): number {
    const config = this.limits[apiName as keyof typeof this.limits]
    if (!config) return Infinity

    switch (period) {
      case 'day': return config.perDay
      case 'hour': return config.perHour
      case 'minute': return config.perMinute
    }
  }

  private getResetTime(period: 'day' | 'hour' | 'minute'): number {
    const now = new Date()

    switch (period) {
      case 'day':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime()
      case 'hour':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1).getTime()
      case 'minute':
        return now.getTime() + 60 * 1000
    }
  }
}

// シングルトンインスタンス
export const apiLimiter = new APILimiter()

/**
 * API制限チェック用ミドルウェア
 */
export function withAPILimit(apiName: string) {
  return function(handler: Function) {
    return async function(...args: any[]) {
      // 分単位、時間単位、日単位すべてチェック
      if (!apiLimiter.canRequest(apiName, 'minute')) {
        throw new Error('API rate limit exceeded (1分あたりの制限超過)')
      }
      if (!apiLimiter.canRequest(apiName, 'hour')) {
        throw new Error('API rate limit exceeded (1時間あたりの制限超過)')
      }
      if (!apiLimiter.canRequest(apiName, 'day')) {
        throw new Error('API rate limit exceeded (1日あたりの制限超過)')
      }

      // リクエスト記録
      apiLimiter.recordRequest(apiName)

      // 元の処理を実行
      return handler(...args)
    }
  }
}
