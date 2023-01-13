// @ts-nocheck

import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { useApi } from "shared/hooks/use-api"
import { RolllStateType } from "shared/models/roll"
import { RollContext } from "shared/context/RollContext"

export type ActiveRollAction = "filter" | "exit"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const [saveRoll, saveRollData, rollLoadState] = useApi<{
    id: number
    name: string
    student_roll_states: {
      student_id: number
      roll_state: RolllStateType
    }[]
    completed_at: Date
  }>({ url: "save-roll" })

  const { isActive, onItemClick } = props
  const rollContext = useContext(RollContext)
  const { iconColor } = rollContext

  const [studentRollStates, setStudentRollStates] = useState([] as { student_id: number; roll_state: string }[])

  useEffect(() => {
    let colorState = [] as { student_id: number; roll_state: string }[]
    const iconColorKeys = Object.keys(iconColor)
    const nums = iconColorKeys.map(function (str) {
      return parseInt(str)
    })
    nums.forEach((id) => {
      colorState.push({ student_id: id, roll_state: iconColor[id] })
      setStudentRollStates?.(colorState)
    })
  }, [iconColor])

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Button
              color="inherit"
              style={{ marginLeft: Spacing.u2 }}
              onClick={() => {
                saveRoll({ student_roll_states: studentRollStates })
                onItemClick("exit")
              }}
            >
              Complete
            </Button>
          </div>
        </div>
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}
