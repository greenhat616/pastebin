import { DashboardConfig } from '@/types'

export const dashboardConfig = {
  sidebarNavItems: [
    {
      title: 'Overview',
      href: '/dashboard',
      icon: <ISolarHomeSmileLinear width={18} height={18} />
    },
    {
      title: 'Snippets',
      href: '/dashboard/snippets',
      icon: <ISolarDocumentsLinear width={18} height={18} />
    },
    {
      title: 'Notifications',
      href: '/dashboard/notifications',
      icon: <ISolarChatRoundDotsLinear width={18} height={18} />
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: <ISolarSettingsLinear width={18} height={18} />
    }
  ]
} satisfies DashboardConfig
