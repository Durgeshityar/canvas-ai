'use client'

import { CreditCard, Crown, Home, MessageCircleQuestion } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { usePaywall } from '@/features/subscriptions/hooks/use-paywall'
import { useCheckout } from '@/features/subscriptions/api/use-checkout'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { SidebarItem } from './sidebar-items'
import { useBilling } from '@/features/subscriptions/api/use-billing'

const SidebarRoutes = () => {
  const mutation = useCheckout()
  const billingMutation = useBilling()
  const { shouldBlock, isLoading, triggerPaywall } = usePaywall()

  const pathName = usePathname()

  const onClick = () => {
    if (shouldBlock) {
      triggerPaywall()
      return
    }

    billingMutation.mutate()
  }

  return (
    <div className="flex flex-col gap-y-4 flex-1">
      {shouldBlock && !isLoading && (
        <>
          <div className="px-3">
            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="w-full rounded-xl border-none hover:bg-white hover:opacity-75 transition "
              variant={'outline'}
              size={'lg'}
            >
              <Crown className="mr-2 size-4 fill-yellow-500 text-yellow-500" />
              Upgrade to Canvas AI Pro
            </Button>
          </div>
          <div className="px-3">
            <Separator />
          </div>
        </>
      )}

      <ul className=" flex flex-col gap-y-1 px-3">
        <SidebarItem
          href="/"
          icon={Home}
          label="Home"
          isActive={pathName === '/'}
        />
      </ul>
      <div className="px-3">
        <Separator />
      </div>
      <ul className=" flex flex-col gap-y-1 px-3">
        <SidebarItem
          href={pathName}
          icon={CreditCard}
          label="Billing"
          onClick={onClick}
        />
        <SidebarItem
          href={'mailto:durgeshwrk0980@gmail.com'}
          icon={MessageCircleQuestion}
          label="Get help"
        />
      </ul>
    </div>
  )
}

export default SidebarRoutes
