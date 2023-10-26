'use client'

import AnimatedLogo, {
  type AnimatedLogoProps
} from '@/components/animated-logo'
import { usePathname } from 'next/navigation'

export default function Logo(props: AnimatedLogoProps) {
  const pathname = usePathname()
  return <AnimatedLogo key={pathname} {...props} />
}
