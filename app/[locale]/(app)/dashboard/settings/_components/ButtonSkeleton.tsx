import { Skeleton } from '@chakra-ui/react'

export default function InputSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton height="40px" rounded="md" />
    </div>
  )
}
