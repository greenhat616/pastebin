// import YAML from 'yaml'
import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'

export default getRequestConfig(async ({ locale }) => {
  const header = await headers()
  const now = header.get('x-now')
  const timeZone = header.get('x-time-zone') ?? 'Asia/Shanghai'
  return {
    now: now ? new Date(now) : undefined,
    timeZone,
    // messages: YAML.parse((await import(`./messages/${locale}.yml`)).default)
    messages: (await import(`@/messages/${locale}.yml`)).default,
    defaultTranslationValues: {
      globalString: 'Global string',
      highlight: (chunks) => <strong>{chunks}</strong>
    },
    formats: {
      dateTime: {
        medium: {
          dateStyle: 'medium',
          timeStyle: 'short',
          hour12: false
        }
      }
    },
    onError(error) {
      if (
        error.message ===
        (process.env.NODE_ENV === 'production'
          ? 'MISSING_MESSAGE'
          : 'MISSING_MESSAGE: Could not resolve `missing` in `Index`.')
      ) {
        // Do nothing, this error is triggered on purpose
      } else {
        console.error(JSON.stringify(error.message))
      }
    },
    getMessageFallback({ key, namespace }) {
      return (
        '`getMessageFallback` called for ' +
        [namespace, key].filter((part) => part != null).join('.')
      )
    }
  }
})
