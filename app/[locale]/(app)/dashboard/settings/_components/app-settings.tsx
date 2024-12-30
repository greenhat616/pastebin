'use client'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Select } from 'chakra-react-select'

export default function AppSettings() {
  return (
    <form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Field
          label="Languages"
          helperText="Manage the languages you want to use in the app."
        >
          <Select
            instanceId="lang"
            name="syntax"
            className="cursor-text"
            useBasicStyles
          ></Select>
        </Field>
        <Field
          label="Prefer Theme"
          helperText="Automatically detect or choose a theme for the app."
        >
          <Select
            instanceId="theme"
            name="syntax"
            className="cursor-text"
            useBasicStyles
          ></Select>
        </Field>
      </div>

      <Button type="submit" colorScheme="blue" mt="4">
        Save
      </Button>
    </form>
  )
}
