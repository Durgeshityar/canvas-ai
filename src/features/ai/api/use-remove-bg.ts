import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<
  (typeof client.api.ai)['remove-bg']['$post'],
  200
>

type RequestType = InferRequestType<
  (typeof client.api.ai)['remove-bg']['$post']
>['json']

export const useRemoveBg = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.ai['remove-bg'].$post({ json })

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string }
        throw new Error(payload.error || 'Failed to remove background')
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-usage'] })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to remove background')
      queryClient.invalidateQueries({ queryKey: ['ai-usage'] })
    },
  })
  return mutation
}
