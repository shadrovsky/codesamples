// Feature-компонент формы для продажи недвижимости, состоящий из нескольких шагов

import { yupResolver } from "@hookform/resolvers/yup"
import React, { PropsWithChildren, useEffect } from "react"
import { useForm, FormProvider, FieldErrors } from "react-hook-form"

import { useResponsive } from "../../../../shared/hooks/useResponsive"
import { Condo, CondoWithTowerId } from "../../../../shared/types/condo"
import { Box } from "../../../../shared/uikit/Box"
import { Button } from "../../../../shared/uikit/Button"
import { Card } from "../../../../shared/uikit/Card"
import { Flex } from "../../../../shared/uikit/Flex"
import { Text } from "../../../../shared/uikit/Text"
import { PAGE_TITLES_A, SELLFORM_ID } from "../../constants/common"
import { STEPS, STEPS_ORDER } from "../../constants/fields"
import { usePartialSellFormSubmit } from "../../hooks/usePartialSellFormSubmit"
import { SellFormValues, Step } from "../../types"
import { CircleProgressBar } from "../CircleProgressBar"
import { SellCheck } from "../SellCheck"
import { SellFormCondo } from "../SellFormCondo"
import { SellFormCondoInfo } from "../SellFormCondoInfo"
import { SellFormStep3 } from "../SellFormStep3"
import { SellFormStep4 } from "../SellFormStep4"
import { SellFormStep5 } from "../SellFormStep5"

import { validationSchema } from "./validation"

import s from "./SellForm.module.scss"

interface SellFormProps {
  initialValues: Partial<SellFormValues>
  currentStep: Step
  onBack: () => void
  onNext: () => void
  onSearchCondo: (query: string) => Promise<Condo[]>
  isSubmitting: boolean
  onSubmit: (formData: SellFormValues) => void
}

export const SellForm: React.FC<SellFormProps> = ({
  initialValues,
  currentStep,
  onBack,
  onNext,
  onSubmit,
  onSearchCondo,
  isSubmitting,
}) => {
  let methods = useForm<SellFormValues>({
    resolver: yupResolver(validationSchema[currentStep]),
    reValidateMode: "onChange",
    defaultValues: { apartmentUnitNumber: "", ...initialValues },
    shouldFocusError: false,
  })

  let { setValue, watch, handleSubmit, getValues, clearErrors } = methods
  let { handleChangePartialSale } = usePartialSellFormSubmit()

  let handleChangeCondominium = (condo: Partial<CondoWithTowerId>) => {
    let { address, city, citySlug, towers } = condo

    setValue("buildingAddress", address || "", {
      shouldValidate: Boolean(address),
    })

    setValue(
      "buildingCity",
      city && citySlug
        ? ({ city, citySlug } as SellFormValues["buildingCity"])
        : null,
      { shouldValidate: Boolean(city && citySlug) },
    )

    if (towers && towers.length !== 0) {
      let tower = towers.find(i => i.id === condo.selectedTowerId) || towers[0]

      setValue("buildingName", tower.name)
      setValue("towerId", tower.id)
      if (tower.floorsCount)
        setValue("buildingTotalFloors", tower.floorsCount, {
          shouldValidate: Boolean(tower.floorsCount),
        })
      if (tower.yearBuilt)
        setValue("buildingYearBuilt", tower.yearBuilt, {
          shouldValidate: Boolean(tower.yearBuilt),
        })
    } else {
      setValue("buildingName", "")
      setValue("buildingTotalFloors", null)
      setValue("buildingYearBuilt", null)
      setValue("towerId", undefined)

      clearErrors()
    }

    if (condo.name && currentStep === STEPS.one) onNext()
  }

  let handleNext = () => {
    onNext()
  }

  let onValidationError = (errors: FieldErrors) => {
    let inputs = document.querySelectorAll(`form[id=${SELLFORM_ID}] input`)
    let firstInvalidInput = Array.from(inputs).find(
      i => errors[i.getAttribute("name")!],
    ) as HTMLInputElement

    if (!firstInvalidInput?.readOnly && firstInvalidInput?.type === "text") {
      firstInvalidInput.focus()
    }

    firstInvalidInput?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  useEffect(() => {
    let subscription = watch(data => handleChangePartialSale(data))

    return () => subscription.unsubscribe()
  }, [handleChangePartialSale, watch])

  return (
    <Wrapper>
      <Box className={s.header} p="2" p_s="3" p_m="6" pb_s="4">
        <Flex g="2" ai="center">
          <CircleProgressBar
            progress={PAGE_TITLES_A[currentStep].progress}
            text={`${STEPS_ORDER.indexOf(currentStep) + 1 || "-"} of ${
              STEPS_ORDER.length
            }`}
          />
          <Text className={s.description} s="12" lh="16">
            {PAGE_TITLES_A[currentStep]?.progressText}
          </Text>
        </Flex>

        <Text color="white" s="24" lh="32" s_s="32" lh_s="40" w="600" mt="8">
          {PAGE_TITLES_A[currentStep]?.title}
        </Text>
        <Text color="white" s="14" lh="20" s_s="16" lh_s="24" mt="2" mt_m="1">
          {PAGE_TITLES_A[currentStep]?.description}
        </Text>
      </Box>

      <Box className={s.content} p="2" py="3" p_s="3" p_m="6" bgColor="white">
        <FormProvider {...methods}>
          <form
            id={SELLFORM_ID}
            onSubmit={handleSubmit(handleNext, onValidationError)}
          >
            {currentStep === STEPS.one && (
              <SellFormCondo
                onChange={handleChangeCondominium}
                onSearchCondo={onSearchCondo}
              />
            )}

            {currentStep === STEPS.two && (
              <SellFormCondoInfo
                onChangeCondo={handleChangeCondominium}
                onSearchCondo={onSearchCondo}
                onNext={handleSubmit(handleNext, onValidationError)}
              />
            )}

            {currentStep === STEPS.three && <SellFormStep3 />}
            {currentStep === STEPS.four && <SellFormStep4 />}
            {currentStep === STEPS.five && <SellFormStep5 />}
          </form>
        </FormProvider>

        {currentStep === STEPS.six && (
          <SellCheck
            formData={getValues()}
            onBack={onBack}
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep !== STEPS.one &&
          currentStep !== STEPS.two &&
          currentStep !== STEPS.six && (
            <Flex g="1" g_m="3" g_l="4" mt="2" mt_s="3" mt_l="5">
              <Button
                fullWidth
                onClick={onBack}
                variant="outlined"
                data-testid="button-back"
              >
                Back
              </Button>

              <Button
                fullWidth
                type="submit"
                data-testid="button-nextStep"
                form={SELLFORM_ID}
              >
                Next
              </Button>
            </Flex>
          )}
      </Box>
    </Wrapper>
  )
}

const Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
  let isMobile = useResponsive("s")

  if (isMobile) {
    return <>{children}</>
  } else {
    return <Card variant="shadow">{children}</Card>
  }
}
