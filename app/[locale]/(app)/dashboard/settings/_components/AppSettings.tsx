'use client'

import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'

export default function AppSettings() {
  return (
    <form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <FormControl>
          <FormLabel>Languages</FormLabel>
          <Select
            instanceId="lang"
            name="syntax"
            className="cursor-text"
            useBasicStyles
          ></Select>
          <FormHelperText>
            Manage the languages you want to use in the app.
          </FormHelperText>
        </FormControl>
      </div>

      <Button type="submit" colorScheme="blue" mt="4">
        Save
      </Button>
    </form>
  )
}
