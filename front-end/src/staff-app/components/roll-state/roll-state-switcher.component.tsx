import React, { useContext, useState } from "react"
import { RollContext } from "shared/context/RollContext"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"

interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void
}
export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange }) => {
  const [rollState, setRollState] = useState(initialState)
  const rollContext = useContext(RollContext)
  const { rollCountStateList, setRollCountStateList } = rollContext

  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = () => {
    const next = nextState()
    setRollState(next)
    if (onStateChange) {
      onStateChange(next)
    }
    const updatedList = [...rollCountStateList].map((ele) => {
      if (ele.type === next) {
        ele.count = ele.count + 1
      }
      return ele
    })
    setRollCountStateList?.(updatedList)
  }

  return <RollStateIcon type={rollState} size={size} onClick={onClick} />
}
