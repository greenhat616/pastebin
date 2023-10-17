'use client'

import { useRouter } from '@/libs/navigation'
import { Button, type ButtonProps } from '@chakra-ui/react'
import { useMemoizedFn } from 'ahooks'

export type Props = {
  className?: string
  children: React.ReactNode
} & ButtonProps

export default function GoBackButton(props: Props) {
  const router = useRouter()
  const goBackFn = useMemoizedFn(() => {
    router.back()
  })

  return (
    <Button
      className={classNames(props.className)}
      colorScheme="blackAlpha"
      onClick={goBackFn}
      {...props}
    >
      {props.children}
    </Button>
  )
}
