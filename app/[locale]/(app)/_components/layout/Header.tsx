'use client'
import AnimatedLogo from '@/components/animated-logo'
import { Box, Link } from '@chakra-ui/react'
import { Avatar } from '@/components/ui/avatar'
import { toaster } from '@/components/ui/toaster'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { signOut } from 'next-auth/react'
import { type Session } from 'next-auth'
import { Fragment } from 'react'
import styles from './Header.module.scss'
import Navigation from './header/Navigation'

import { useRouter } from '@/libs/navigation'
import { useTranslations } from 'next-intl'

type Props = {
  className?: string
  session: Partial<Session> | null
}

export function Header(props: Props) {
  const router = useRouter()
  const t = useTranslations()


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
                {!props.session ? (
                  <>
                    <button
                      type="button"
                      className={classNames(styles['sign-in'], styles.icon)}
                      onClick={() => {
                        router.push({
                          pathname: '/auth/signin',
                          query: { callbackUrl: window.location.href }
                        })
                      }}
                    >
                      <ArrowRightOnRectangleIcon
                        className=":ouo: h-6 w-6"
                        aria-hidden="true"
                      />
                    </button>
                    <Link
                      onClick={() => {
                        router.push({
                          pathname: '/auth/signin',
                          query: { callbackUrl: window.location.href }
                        })
                      }}
                      className={classNames(styles['sign-in'], styles.text)}
                    >
                      {t('app.nav.accounts.sign_in')}
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className={styles.notification}
                      onClick={() => {
                        router.push('/dashboard/notifications')
                      }}
                    >
                      <BellIcon className=":ouo: h-6 w-6" aria-hidden="true" />
                    </button>
                    {/* Profile dropdown */}
                    <Menu as={Box} className={styles.user}>
                      <Box>
                        <Menu.Button className={styles.avatar}>
                          <Avatar
                            size="sm"
                            src={getUserAvatar(props.session as Session)}
                            name={props.session?.user?.name || undefined}
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
                              <Link
                                href="/dashboard"
                                className={classNames(
                                  styles.item,
                                  active && styles.active
                                )}
                              >
                                {t('app.nav.accounts.drop_down.overview')}
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/dashboard/snippets"
                                className={classNames(
                                  styles.item,
                                  active && styles.active
                                )}
                              >
                                {t('app.nav.accounts.drop_down.snippets')}
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/dashboard/settings"
                                className={classNames(
                                  styles.item,
                                  active && styles.active
                                )}
                              >
                                {t('app.nav.accounts.drop_down.settings')}
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                className={classNames(
                                  styles.item,
                                  'cursor-pointer',
                                  active && styles.active
                                )}
                                onClick={() =>
                                  signOut().then(() => {
                                    toaster.create({
                                      title: t(
                                        'app.nav.accounts.sign_out.toast.success.title'
                                      ),
                                      description: t(
                                        'app.nav.accounts.sign_out.toast.success.description'
                                      ),
                                      type: 'success',
                                      duration: 3000
                                    })
                                    setTimeout(() => {
                                      router.refresh()
                                    }, 2000)
                                  })
                                }
                              >
                                {t('app.nav.accounts.sign_out.label')}
                              </Link>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                )}
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
