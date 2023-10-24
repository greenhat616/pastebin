import { Grid } from '@chakra-ui/react'

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <Grid gap={8} alignItems="flex-start">
      {children}
    </Grid>
  )
}
