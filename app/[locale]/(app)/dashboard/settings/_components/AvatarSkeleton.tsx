import { SkeletonCircle } from '@chakra-ui/react'

export default function InputSkeleton() {
  return (
    <div className="flex gap-3 items-center justify-center">
      <SkeletonCircle size="lg" />
    </div>
  )
}
