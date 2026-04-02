import { useGetAiUsage } from '@/features/ai/api/use-get-ai-usage'
import { useSubscriptionModal } from '@/features/subscriptions/store/use-subscription-modal'

export const useAiPaywall = () => {
  const {
    data: usage,
    isLoading: isLoadingUsage,
    isError: isUsageError,
  } = useGetAiUsage()
  const subscriptionModal = useSubscriptionModal()

  const shouldBlock = !isLoadingUsage && !isUsageError && !usage?.hasAccess

  return {
    isLoading: isLoadingUsage,
    isError: isUsageError,
    usage,
    shouldBlock,
    triggerPaywall: () => {
      subscriptionModal.onOpen()
    },
  }
}
