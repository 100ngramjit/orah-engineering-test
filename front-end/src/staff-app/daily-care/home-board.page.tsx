import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { sortByFirstName, sortByLastName } from "shared/helpers/sort-by-name"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [studentData, setStudentData] = useState(data?.students)

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    setStudentData(data?.students)
  }, [data])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  const sortButtonHandler = (action: ToolbarAction) => {
    if (action === "ascending") {
      setStudentData(data?.students)
    } else if (action === "descending") {
      const sortedStudents = [...data?.students!].reverse()
      setStudentData(sortedStudents)
    } else if (action === "First Name") {
      const sortedStudents = sortByFirstName(studentData!)
      setStudentData(sortedStudents)
    } else if (action === "Last Name") {
      const sortedStudents = sortByLastName(studentData!)
      setStudentData(sortedStudents)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} onSortButtonClick={sortButtonHandler} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && studentData && (
          <>
            {studentData.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "ascending" | "descending" | "First Name" | "Last Name"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  onSortButtonClick: (action: ToolbarAction, value?: string) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, onSortButtonClick } = props

  function handleSelectChange(event: any) {
    onSortButtonClick(event.target.value)
  }

  return (
    <S.ToolbarContainer>
      <div>
        <label>Sort by</label>
        <select onChange={handleSelectChange}>
          <option value="ascending">ascending</option>
          <option value="descending">descending</option>
          <option value="First Name">First Name</option>
          <option value="Last Name">Last Name</option>
        </select>
      </div>
      <div>Search</div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
