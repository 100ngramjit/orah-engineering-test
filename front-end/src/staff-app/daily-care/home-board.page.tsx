import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { searchByName, sortByFirstName, sortByLastName } from "shared/helpers/toolbar-utils"
import { RollContext } from "shared/context/RollContext"
import { Box, TextField } from "@material-ui/core"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const rollContext = useContext(RollContext)
  const { studentData, setStudentData, data, loadState } = rollContext

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
      setStudentData?.(data?.students!)
    } else if (action === "descending") {
      const sortedStudents = [...data?.students!].reverse()
      setStudentData?.(sortedStudents)
    } else if (action === "First Name") {
      const sortedStudents = sortByFirstName(studentData!)
      setStudentData?.(sortedStudents)
    } else if (action === "Last Name") {
      const sortedStudents = sortByLastName(studentData!)
      setStudentData?.(sortedStudents)
    }
  }

  const searchButtonHandler = (query: string) => {
    if (query === "") {
      setStudentData?.(data?.students!)
    } else {
      const res = searchByName(data?.students!, query)
      setStudentData?.(res)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} onSortButtonClick={sortButtonHandler} onSearchButtonClick={searchButtonHandler} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && studentData && (
          <>{studentData.length > 0 ? studentData.map((s) => <StudentListTile key={s.id} isRollMode={isRollMode} student={s} id={s.id} />) : <Box>No Students Available</Box>}</>
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
  onSearchButtonClick: (query: string) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, onSortButtonClick, onSearchButtonClick } = props

  const handleSelectChange = (event: any) => {
    onSortButtonClick(event.target.value)
  }

  const handleInputChange = (event: { target: { value: string } }) => {
    onSearchButtonClick(event.target.value)
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
      <div>
        <TextField
          style={{ border: "2px solid white", borderRadius: "5px" }}
          inputProps={{ style: { color: "white", fontWeight: `${FontWeight.strong}` } }}
          variant="outlined"
          size="small"
          placeholder="Search by name"
          type="text"
          onChange={handleInputChange}
        />
      </div>
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
