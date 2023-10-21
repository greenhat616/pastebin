import { dashboardConfig } from '@/config/dashboard'
import { auth } from '@/libs/auth'
import { redirect } from '@/libs/navigation'
import { Box, Flex } from '@chakra-ui/react'
import AsideNav from './_components/AsideNav'

type DashboardLayoutProps = {
  children: React.ReactNode
  aside: React.ReactNode
  main: React.ReactNode
}

export function useNavItems() {
  return
}

export default async function DashboardLayout(props: DashboardLayoutProps) {
  const session = await auth()
  if (!session) redirect('/auth/signin')
  return (
    <Flex className="mt-5 gap-5">
      <AsideNav items={dashboardConfig.sidebarNavItems} />
      <Box as="main" className="flex-1 container">
        {props.children}
      </Box>
    </Flex>
  )
}
