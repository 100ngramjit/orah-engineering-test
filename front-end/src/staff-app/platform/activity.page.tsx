import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"

export const ActivityPage: React.FC = () => {
  const [getRoll, RollData, RollLoadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })
  useEffect(() => {
    getRoll()
    console.log("getRollData", RollData)
  }, [getRoll])
  useEffect(() => {
    console.log("getRollData", RollData)
  }, [RollLoadState])
  return (
    <S.Container>
      {RollLoadState === "loaded" && RollData?.activity?.map((ele) => <>{ele.date}</>)}
      Activity Page
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
