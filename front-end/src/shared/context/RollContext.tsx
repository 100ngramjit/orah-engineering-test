import { useState, createContext, Dispatch, SetStateAction } from "react"
import * as React from "react"
import { RolllStateType } from "shared/models/roll"

type ItemType = RolllStateType | "all"
interface StateList {
  type: ItemType
  count: number
}

interface RollContextType {
  rollCountStateList: StateList[]
  setRollCountStateList?: Dispatch<SetStateAction<StateList[]>>
}

const defaultState = {
  rollCountStateList: [
    { type: "all", count: 14 },
    { type: "present", count: 0 },
    { type: "late", count: 0 },
    { type: "absent", count: 0 },
  ] as StateList[],
}

const RollContext = createContext<RollContextType>(defaultState)
const RollProvider = ({ children }: any) => {
  const [rollCountStateList, setRollCountStateList] = useState(defaultState.rollCountStateList)

  return (
    <RollContext.Provider
      value={{
        rollCountStateList,
        setRollCountStateList,
      }}
    >
      {children}
    </RollContext.Provider>
  )
}

export { RollContext, RollProvider }
