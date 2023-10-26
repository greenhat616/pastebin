'use client'

import { Link, pathnames } from '@/libs/navigation'
import { useSelectedLayoutSegment } from 'next/navigation'
import { ComponentProps } from 'react'

export default function NavigationLink<
  Pathname extends keyof typeof pathnames
>({ href, ...rest }: ComponentProps<typeof Link<Pathname>>) {
  const selectedLayoutSegment = useSelectedLayoutSegment()
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/'
  const isActive = pathname === href

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      href={href}
      style={{ textDecoration: isActive ? 'underline' : 'none' }}
      {...rest}
    />
  )
}
