

import type { APIAuthenticatorResponse } from '@/app/api/user/authenticators/route'
import { ResponseCode } from '@/enums/response'
import { ofetchClient as $fetch } from '@/libs/requests'
import { R } from '@/utils/response'
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery
} from '@tanstack/react-query'
import { toaster } from '@/components/ui/toaster'

export function useUserAuthenticatorsQuery(
  options?: Partial<Omit<UseQueryOptions, 'queryKey' | 'queryFn'>>
): UseQueryResult<R<Array<APIAuthenticatorResponse>>, Error> {
  return useQuery({
    queryKey: ['user-authenticators'],
    queryFn: (): Promise<R<Array<APIAuthenticatorResponse>>> =>
      $fetch<R<Array<APIAuthenticatorResponse>>>('/api/user/authenticators', {
        credentials: 'include',
        onResponse({ response }) {
          if (
            response.headers.get('content-disposition') &&
            response.status === 200
          )
            return response
          if (response._data.code !== ResponseCode.OK) {
            toaster.error({
              title: 'Failed to get authenticators',
              description: response._data.message,
              duration: 5000,
            })
            return Promise.reject(response._data)
          }
          return response._data
        },
        onResponseError({ response }) {
          toaster.create({
            title: 'Failed to get authenticators',
            description: response._data.message,
            duration: 5000,
          })
          return Promise.reject(response?._data ?? null)
        }
      }),
    ...(options || {})
  }) as UseQueryResult<R<Array<APIAuthenticatorResponse>>, Error>
}
