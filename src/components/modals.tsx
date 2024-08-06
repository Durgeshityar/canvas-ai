'use client'

import { SubscriptionModal } from '@/features/subscriptions/components/subscription-modal'
import { FailModal } from '@/features/subscriptions/components/fail-modal'
import { SuccessModal } from '@/features/subscriptions/components/success-modal'
import { useEffect, useState } from 'react'

export const Modals = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <FailModal />
      <SuccessModal />
      <SubscriptionModal />
    </>
  )
}
