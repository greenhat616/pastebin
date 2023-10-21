'use client'
import { Link } from '@/libs/navigation'
import { SidebarNavItem } from '@/types'
import { Flex, Text } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'

// function DropdownItem({
//   children,
//   item
// }: {
//   children: React.ReactNode
//   item: SidebarNavItem
// }) {
//   const [isOpen, setIsOpen] = useState(false)
//   return (
//     <Flex
//       key={item.disabled ? '/' : item.href}
//       as={Link}
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore ts(2322)
//       href={item.href}
//       disabled={item.disabled}
//       gap={2}
//       onClick={() => setIsOpen(!isOpen)}
//     >
//       <Fade in={isOpen}>{children}</Fade>
//     </Flex>
//   )
// }

function Item({ item, active }: { item: SidebarNavItem; active?: boolean }) {
  // if (item.items) {
  //   return (
  //     <DropdownItem item={item}>
  //       {item.items.map((subItem, index) => {
  //         return <Item key={subItem.title} item={subItem} />
  //       })}
  //     </DropdownItem>
  //   )
  // }

  return (
    <Link
      key={item.disabled ? '/' : item.href}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      href={item.href as any}
      className={classNames(
        'flex items-center justify-start hover:bg-gray-100 px-5 py-3 rounded-2xl text-sm font-medium gap-2.5',
        active && 'bg-gray-100'
      )}
    >
      {item.icon && (
        <Flex className="items-center justify-center">{item.icon}</Flex>
      )}
      <Text as="span">{item.title}</Text>
    </Link>
  )
}

export default function AsideNav({ items }: { items: SidebarNavItem[] }) {
  const pathname = usePathname()
  if (!items.length) return null

  return (
    <nav className="hidden md:flex flex-col w-[200px] gap-3">
      {items.map((item) => {
        return (
          <Item item={item} key={item.title} active={pathname === item.href} />
        )
      })}
    </nav>
  )
}
