// @ts-nocheck

import React, { useContext, useEffect, useState } from "react"
import { RollContext } from "shared/context/RollContext"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"

interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void
  id: number
}
export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange, id }) => {
  //misc
  const { rollCountStateList, setRollCountStateList, iconColor, setIconColor } = useContext(RollContext)

  //state
  const [rollState, setRollState] = useState(initialState)
  const [currentIndex, setCurrentIndex] = useState(0)

  //func
  const nextState = () => {
    const states: RolllStateType[] = ["unmark", "present", "late", "absent"]
    if (rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const rollStateCountUpdater = () => {
    const updatedRollCountList = [...rollCountStateList]
    if (currentIndex !== 0) {
      updatedRollCountList[currentIndex].count = updatedRollCountList[currentIndex].count - 1
    }
    if (currentIndex !== updatedRollCountList.length - 1) {
      updatedRollCountList[(currentIndex + 1) % updatedRollCountList.length].count++
    }
    setCurrentIndex((currentIndex + 1) % updatedRollCountList.length)
    setRollCountStateList?.(updatedRollCountList)
  }

  const rollIconUpdater = (id: number) => {
    if (!(id in iconColor)) {
      setIconColor?.({ ...iconColor, [id]: "present" })
    } else {
      setIconColor?.({ ...iconColor, [id]: nextState() })
    }
  }

  const onClick = () => {
    const next = nextState()
    setRollState(next)
    if (onStateChange) {
      onStateChange(next)
    }
    rollStateCountUpdater()
    rollIconUpdater(id)
  }

  return <RollStateIcon type={iconColor[id] ? iconColor[id] : "unmark"} size={size} onClick={onClick} />
}
