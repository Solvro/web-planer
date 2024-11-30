import crypto from 'node:crypto'
import OAuth from 'oauth-1.0a'
import { LRUCache } from 'lru-cache'
import env from '#start/env'
import fetch from 'node-fetch'
const baseUrl = `https://apps.usos.pwr.edu.pl/services`

const cache = new LRUCache<string, object>({
  ttl: 60 * 60 * 1000,
  ttlAutopurge: false,
  max: 10000,
})
const oauth = new OAuth({
  consumer: { key: env.get('USOS_CONSUMER_KEY'), secret: env.get('USOS_CONSUMER_SECRET') },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64')
  },
})
export const createClient = ({ token, secret }: { token?: string; secret?: string }) => {
  if (typeof token !== 'string' || typeof secret !== 'string') {
    throw new Error('No token or secret provided')
  }
  return {
    async get<R = unknown>(
      endpoint: string,
      { shouldCache }: { shouldCache: boolean } = { shouldCache: true }
    ): Promise<R> {
      const url = `${baseUrl}/${endpoint}`

      if (cache.has(url) && shouldCache) {
        return cache.get(url) as R
      }

      const data = oauth.authorize(
        {
          url,
          method: 'GET',
        },
        {
          key: token,
          secret,
        }
      )
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: oauth.toHeader(data).Authorization,
        },
      })

      if (response.status === 401) {
        throw new Error('Unauthorized')
      }

      if (!response.ok) {
        console.log('Not ok', await response.text())
        throw new Error('Unauthorized')
      }

      const json: any = await response.json()

      if (shouldCache) {
        cache.set(url, json)
      }

      return json as Promise<R>
    },
    async post<R = unknown>(endpoint: string, body: unknown): Promise<R> {
      const url = `${baseUrl}/${endpoint}`

      const data = oauth.authorize(
        {
          url,
          method: 'POST',
          data: body,
          includeBodyHash: true,
        },
        {
          key: token,
          secret,
        }
      )
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: oauth.toHeader(data).Authorization,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      return response.json() as Promise<R>
    },
  }
}

export type UsosClient = ReturnType<typeof createClient>
