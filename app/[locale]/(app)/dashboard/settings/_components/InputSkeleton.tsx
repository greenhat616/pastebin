import { Skeleton } from '@chakra-ui/react'

export default function InputSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton height="20px" />
      <Skeleton height="40px" />
      <Skeleton height="20px" />
    </div>
  )
}
