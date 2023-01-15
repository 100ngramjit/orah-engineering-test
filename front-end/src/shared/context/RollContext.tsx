//external imports
import { useState, createContext, Dispatch, SetStateAction, useEffect } from "react"
import * as React from "react"

//internal imports
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
  studentData: Person[] | undefined
  filteredData: Person[] | undefined
  setStudentData?: Dispatch<SetStateAction<Person[]>>
  setFilteredData?: Dispatch<SetStateAction<Person[]>>
  data: { students: Person[] } | undefined
  loadState: string
  setIconColor?: React.Dispatch<
    React.SetStateAction<{
      id: RolllStateType
    }>
  >
  iconColor: { id: RolllStateType }
}

const defaultState = {
  rollCountStateList: [
    { type: "all", count: 0 },
    { type: "present", count: 0 },
    { type: "late", count: 0 },
    { type: "absent", count: 0 },
  ] as StateList[],
  studentData: [] as Person[],
  filteredData: [] as Person[],
  data: {} as { students: Person[] },
  loadState: "loading",
  iconColor: {} as { id: RolllStateType },
}

const RollContext = createContext<RollContextType>(defaultState)
const RollProvider = ({ children }: any) => {
  //misc
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })

  //state
  const [rollCountStateList, setRollCountStateList] = useState(defaultState.rollCountStateList)
  const [studentData, setStudentData] = useState(defaultState.studentData)
  const [filteredData, setFilteredData] = useState(defaultState.filteredData)
  const [iconColor, setIconColor] = useState({} as { id: RolllStateType })

  //async
  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    loadState === "loaded" &&
      setRollCountStateList(
        [...rollCountStateList].map((ele) => {
          if (ele.type === "all") {
            ele.count = data?.students.length as number
          }
          return ele
        })
      )
    setStudentData(data?.students!)
    let colorState = {} as { [key: number]: RolllStateType }
    data?.students.forEach(({ id }) => {
      colorState[id] = "unmark"
    })
    setIconColor(colorState as { id: RolllStateType })
  }, [loadState])

  return (
    <RollContext.Provider
      value={{
        filteredData,
        rollCountStateList,
        setRollCountStateList,
        studentData,
        setStudentData,
        data,
        loadState,
        iconColor,
        setIconColor,
      }}
    >
      {children}
    </RollContext.Provider>
  )
}

export { RollContext, RollProvider }
