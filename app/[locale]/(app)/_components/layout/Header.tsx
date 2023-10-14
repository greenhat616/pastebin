'use client'
import AnimatedLogo from '@/components/AnimatedLogo'
import { Box } from '@chakra-ui/react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import styles from './Header.module.scss'
import Navigation from './header/Navigation'

type Props = {
  className?: string
}

export function Header(props: Props) {
  return (
    <Disclosure as="nav" className={classNames('bg-gray-800', props.className)}>
      {({ open }) => (
        <>
          <Box className={styles['header-container']}>
            <Box className={styles['header']}>
              <Box className={styles['hamburger-menu-container']}>
                {/* Mobile menu button*/}
                <Disclosure.Button className={styles['hamburger-menu']}>
                  {open ? (
                    <XMarkIcon className={styles.icon} aria-hidden="true" />
                  ) : (
                    <Bars3Icon className={styles.icon} aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </Box>
              <Box className={styles.main}>
                <AnimatedLogo
                  className={classNames(styles.logo, 'h-10 w-10')}
                  emojiClassName="!w-10 !h-10"
                />
                <Box className={styles['menu-container']}>
                  <Box className={styles.menu}>
                    <Navigation platform="mobile" />
                  </Box>
                </Box>
              </Box>
              <Box className={styles['info-panel']}>
                <button type="button" className={styles.notification}>
                  <BellIcon className=":ouo: h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as={Box} className={styles.user}>
                  <Box>
                    <Menu.Button className={styles.avatar}>
                      <NImage
                        width={32}
                        height={32}
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="avatar"
                      />
                    </Menu.Button>
                  </Box>
                  <Transition
                    as={Fragment}
                    enter=":ouo: transition ease-out duration-100"
                    enterFrom=":ouo: transform opacity-0 scale-95"
                    enterTo=":ouo: transform opacity-100 scale-100"
                    leave=":ouo: transition ease-in duration-75"
                    leaveFrom=":ouo: transform opacity-100 scale-100"
                    leaveTo=":ouo: transform opacity-0 scale-95"
                  >
                    <Menu.Items className={styles['dropdown-menu']}>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              styles.item,
                              active && styles.active
                            )}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              styles.item,
                              active && styles.active
                            )}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              styles.item,
                              active && styles.active
                            )}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </Box>
            </Box>
          </Box>

          <Disclosure.Panel className={styles['mobile-hamburger-dropdown']}>
            <Box className={styles.menu}>
              <Navigation platform="mobile" />
            </Box>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
