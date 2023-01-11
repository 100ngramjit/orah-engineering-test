import { useState, createContext, Dispatch, SetStateAction } from "react"
import * as React from "react"
import { RolllStateType } from "shared/models/roll"

type ItemType = RolllStateType | "all"
interface StateList {
  type: ItemType
  count: number
}

interface RollContextType {
  rollState: StateList[]
  setRollState?: Dispatch<SetStateAction<StateList[]>>
}

const defaultState = {
  rollState: [
    { type: "all", count: 14 },
    { type: "present", count: 0 },
    { type: "late", count: 0 },
    { type: "absent", count: 0 },
  ] as StateList[],
}

const RollContext = createContext<RollContextType>(defaultState)
const RollProvider = ({ children }: any) => {
  const [rollState, setRollState] = useState(defaultState.rollState)

  return (
    <RollContext.Provider
      value={{
        rollState,
        setRollState,
      }}
    >
      {children}
    </RollContext.Provider>
  )
}

export { RollContext, RollProvider }
