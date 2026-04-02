import { useMutation } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

import { client } from '@/lib/hono'
import { toast } from 'sonner'
import { SUBSCRIPTION_DEMO_MESSAGE } from '@/features/subscriptions/constants'

type ResponseType = InferResponseType<
  (typeof client.api.subscriptions.billing)['$post'],
  200
>

export const useBilling = () => {
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.subscriptions.billing.$post()

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string }
        throw new Error(payload.error || SUBSCRIPTION_DEMO_MESSAGE)
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      window.location.href = data
    },
    onError: (error) => {
      toast.error(error.message || SUBSCRIPTION_DEMO_MESSAGE)
    },
  })
  return mutation
}
