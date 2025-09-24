import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import { useOrderFormCustom, useToast } from '.'
import { useCheckoutB2BContext } from '../CheckoutB2BContext'
import { apiRequest } from '../services'
import type { ApiResponse, CompleteOrderForm } from '../typings'

type Props = {
  updateOrderForm?: boolean
  onChangeItems?: () => void
}

export function useClearCart(props?: Props) {
  const { updateOrderForm = true, onChangeItems } = props ?? {}
  const showToast = useToast()
  const { query, setQuery } = useRuntime()
  const { orderForm, setOrderForm } = useOrderFormCustom()
  const { setPending, setSelectedCart } = useCheckoutB2BContext()
  const handlePending = useCallback(
    (pending: boolean) => {
      updateOrderForm && setPending(pending)
    },
    [updateOrderForm, setPending]
  )

  const { mutate, isLoading } = useMutation<CompleteOrderForm, Error>({
    mutationFn: async () => {
      handlePending(true)

      return apiRequest<CompleteOrderForm & ApiResponse>(
        `/api/checkout/pub/orderForm/${orderForm.id}/items/removeAll`,
        'POST',
        {}
      ).finally(() => {
        onChangeItems?.()
        handlePending(false)
      })
    },
    onSuccess(newOrderForm) {
      if (!updateOrderForm) return

      setOrderForm(newOrderForm)
      setSelectedCart(null)

      if (query?.savedCart) {
        setQuery({ savedCart: undefined }, { replace: true })
      }
    },
    onError({ message }) {
      showToast({ message })
    },
  })

  return { clearCart: mutate, isLoading }
}
