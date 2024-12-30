import {
  Skeleton,
  SkeletonCircle,
  SkeletonText
} from '@/components/ui/skeleton'

export function H2Skeleton() {
  return <Skeleton height="24px" width="100px" />
}

export function PSkeleton() {
  return <Skeleton height="20px" width="100px" />
}

export function TextSkeleton(props: { lines?: number }) {
  return <SkeletonText mt="4" noOfLines={props.lines || 4} spaceX={4} />
}

export function BlockButtonSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton height="40px" rounded="md" width="100%" />
    </div>
  )
}

export function XLargeAvatarSkeleton() {
  return (
    <div className="flex gap-3 items-center justify-center">
      <SkeletonCircle size="6em" />
    </div>
  )
}

export function FormInputSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton height="20px" width="100px" />
      <Skeleton height="40px" width="100%" />
      <Skeleton height="20px" width="100px" />
    </div>
  )
}
