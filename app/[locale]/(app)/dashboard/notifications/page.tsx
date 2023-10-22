import Header from '../_components/Header'
import Shell from '../_components/Shell'

export default function NotificationsPage() {
  return (
    <Shell>
      <Header
        heading="Notifications"
        text="View notifications from your account."
      />
      <div className="rounded-2xl mt-10">
        <div className="flex items-center h-[150px] justify-center">
          <ISolarInboxLinear width={50} height={50} className="text-gray-200" />
        </div>

        <h2 className="text-center text-sm text-gray-400">
          No notifications found.
        </h2>
      </div>
    </Shell>
  )
}
