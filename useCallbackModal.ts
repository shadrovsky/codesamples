// Хук для управления окнами обратного звонка

import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { useMutation } from "react-query"

import { routes } from "../../app/constants/routes"
import { trackOffer } from "../../features/offers/services/trackOffer"
import { getIsOfferQuestionsView } from "../lib/getIsOfferQuestionsView"
import { useActiveDeal } from "../queries/useActivedeal"
import { requestCallback } from "../services/callback"
import { CallbackReason } from "../types/callback"
import { Sale } from "../types/sale"

import { useModal } from "./useModal"

interface UseCallbackModalParams {
  defaultReason?: CallbackReason
}

export const useCallbackModal = ({
  defaultReason,
}: UseCallbackModalParams = {}) => {
  let { sale } = useActiveDeal()

  let [accepted, setAccepted] = useState<{ [key: number]: boolean }>({})
  let router = useRouter()
  let currentLocation = router.asPath.split("?")[0]
  let reason =
    defaultReason || getCallbackReasonByLocation(currentLocation, sale)

  let { isOpen, open, close } = useModal(false)
  let { isLoading, mutate } = useMutation(
    () =>
      requestCallback({
        saleId: sale!.id,
        reason,
      }),
    {
      onSuccess: () => {
        setAccepted(prev => ({ ...prev, [sale!.id]: true }))
      },
    },
  )

  let handleOpen = useCallback(() => {
    trackOffer.callback(reason)

    open()
  }, [reason, router.asPath, open])

  return {
    isOpen,
    pathname: router.asPath,
    open: handleOpen,
    close,
    isSubmitting: isLoading,
    onSubmit: mutate,
    isAccepted: Boolean(sale?.id && accepted[sale.id] && !isLoading),
  }
}

const REASON_BY_LOCATION: { [key: string]: CallbackReason } = {
  [routes.OFFERS]: "offerQuestion",
  [routes.CHECKING_REPAIR_LEVEL]: "checkRepairQuestion",
  [routes.UPLOADING_DOCUMENTS]: "docsQuestion",
  [routes.PROFESSIONAL_PHOTOGRAPHY]: "bookingPhotographer",
  [routes.SIGNING_CONTRACT]: "contractSigning",
}

const getCallbackReasonByLocation = (
  path: string,
  sale?: Sale,
): CallbackReason => {
  if (path === routes.OFFERS && getIsOfferQuestionsView(sale))
    return "questions"

  return REASON_BY_LOCATION[path] || "commonQuestion"
}
