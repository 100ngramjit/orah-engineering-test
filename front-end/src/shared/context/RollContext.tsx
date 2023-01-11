import { useState, createContext, Dispatch, SetStateAction } from "react"
import * as React from "react"
import { RolllStateType } from "shared/models/roll"
import { useApi } from "shared/hooks/use-api"
import { Person } from "shared/models/person"

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
    { type: "all", count: 0 },
    { type: "present", count: 0 },
    { type: "late", count: 0 },
    { type: "absent", count: 0 },
  ] as StateList[],
}

const RollContext = createContext<RollContextType>(defaultState)
const RollProvider = ({ children }: any) => {
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [rollCountStateList, setRollCountStateList] = useState(defaultState.rollCountStateList)

  React.useEffect(() => {
    void getStudents()
  }, [getStudents])

  React.useEffect(() => {
    loadState === "loaded" &&
      setRollCountStateList(
        [...rollCountStateList].map((ele) => {
          if (ele.type === "all") {
            ele.count = data?.students.length as number
          }
          return ele
        })
      )
    console.log(rollCountStateList)
  }, [loadState])

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
