'use client'
import { Link, usePathname } from '@/navigation'
import { Disclosure } from '@headlessui/react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import styles from '../Header.module.scss'

const items = [
  { key: 'home', href: '/', current: true },
  { key: 'about', href: '/about', current: false },
  {
    key: 'github',
    href: 'https://github.com/greenhat616/pastebin',
    current: false
  }
]

type Props = {
  className?: string
  platform?: 'pc' | 'mobile'
}

export default function Navigation(props: Props) {
  const { platform = 'pc' } = props
  const pathname = usePathname()
  const t = useTranslations('app.nav.menu')
  const filteredItems = useMemo(() => {
    return items.map((item) => {
      return {
        ...item,
        current: item.href === pathname
      }
    })
  }, [pathname])

  return (
    <>
      {filteredItems.map((item) =>
        platform === 'pc' ? (
          <Link
            key={item.key}
            href={item.href as never}
            className={classNames(
              item.current ? styles.active : '',
              styles.item,
              props.className
            )}
            aria-current={item.current ? 'page' : undefined}
            target={item.href.startsWith('http') ? '_blank' : undefined}
          >
            {t(item.key)}
          </Link>
        ) : (
          <Disclosure.Button
            key={item.key}
            as="a"
            href={item.href}
            className={classNames(
              item.current ? styles.active : '',
              styles.item,
              props.className
            )}
            aria-current={item.current ? 'page' : undefined}
            target={item.href.startsWith('http') ? '_blank' : undefined}
          >
            {t(item.key)}
          </Disclosure.Button>
        )
      )}
    </>
  )
}
