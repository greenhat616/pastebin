import { Grid } from '@chakra-ui/react'
import React from 'react'
import Header from '../_components/header'
import Shell from '../_components/shell'

type SettingsLayoutProps = {
  profile: React.ReactNode
  children: React.ReactNode // Site settings
}

export default async function SettingsLayout(props: SettingsLayoutProps) {
  return (
    <Shell>
      <Header heading="Settings" text="Manage account and website settings." />
      <Grid gap={10}>
        {props.profile}
        {props.children}
      </Grid>
    </Shell>
  )
}
