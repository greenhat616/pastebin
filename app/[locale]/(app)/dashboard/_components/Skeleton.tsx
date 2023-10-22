import { Skeleton, SkeletonText } from '@chakra-ui/react'

export function H2Skeleton() {
  return <Skeleton height="24px" width="100px" />
}

export function PSkeleton() {
  return <Skeleton height="20px" width="100px" />
}

export function TextSkeleton(props: { lines?: number }) {
  return <SkeletonText mt="4" noOfLines={props.lines || 4} spacing="4" />
}
