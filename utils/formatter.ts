import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

// TODO: load locale files automatically, maybe use a script to generate the list?
import 'dayjs/locale/en'
import 'dayjs/locale/zh-cn'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

export type DayJSOptions = {
  locale?: string
  timeZone?: string
}

export function formatDateTime(
  date: string | number | Date | dayjs.Dayjs | null | undefined,
  { locale = 'zh-CN', timeZone = 'Asia/Shanghai' }: DayJSOptions = {}
) {
  return dayjs(date)
    .locale(locale.toLowerCase())
    .tz(timeZone)
    .format('YYYY-MM-DD HH:mm:ss')
}

export function newDayjs(
  date: string | number | Date | dayjs.Dayjs | null | undefined,
  { locale = 'zh-CN', timeZone = 'Asia/Shanghai' }: DayJSOptions = {}
) {
  return dayjs(date).locale(locale.toLowerCase()).tz(timeZone)
}
