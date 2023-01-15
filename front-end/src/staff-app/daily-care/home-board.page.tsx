//external imports
import React, { useState, useContext } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Box, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField } from "@material-ui/core"

//internal imports
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { searchByName, sortByFirstName, sortByLastName } from "shared/helpers/toolbar-utils"
import { RollContext } from "shared/context/RollContext"

export const HomeBoardPage: React.FC = () => {
  //misc
  const { studentData, setStudentData, data, loadState } = useContext(RollContext)

  //state
  const [isRollMode, setIsRollMode] = useState(false)

  //func
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
          <>
            {studentData.length > 0 ? (
              studentData.map((s) => <StudentListTile key={s.id} isRollMode={isRollMode} student={s} id={s.id} />)
            ) : (
              <CenteredContainer>
                <div>No students available</div>
              </CenteredContainer>
            )}
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
  onSearchButtonClick: (query: string) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, onSortButtonClick, onSearchButtonClick } = props

  const useStyles = makeStyles((theme) => ({
    formControl: {
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },

    select: {
      "&:before": {
        borderColor: "white",
      },
      "&:after": {
        borderColor: "white",
      },
      "&:not(.Mui-disabled):hover::before": {
        borderColor: "white",
      },
      border: "1.5px solid white",
      borderRadius: "5px",
    },
    icon: {
      fill: "white",
    },
    root: {
      color: "white",
    },
    label: { color: "white", fontWeight: FontWeight.strong },
  }))

  const classes = useStyles()

  const handleSelectChange = (event: any) => onSortButtonClick(event.target.value)

  const handleInputChange = (event: { target: { value: string } }) => onSearchButtonClick(event.target.value)

  return (
    <S.ToolbarContainer>
      <FormControl className={classes.formControl} size="small">
        <InputLabel id="demo-simple-select-label" className={classes.label}>
          Sort by
        </InputLabel>
        <Select
          className={classes.select}
          defaultValue="ascending"
          inputProps={{
            classes: {
              icon: classes.icon,
              root: classes.root,
            },
          }}
          onChange={handleSelectChange}
        >
          <MenuItem value="ascending">ascending</MenuItem>
          <MenuItem value="descending">descending</MenuItem>
          <MenuItem value="First Name">First Name</MenuItem>
          <MenuItem value="Last Name">Last Name</MenuItem>
        </Select>
      </FormControl>
      <TextField
        className={classes.select}
        inputProps={{ style: { color: "white", fontWeight: `${FontWeight.strong}` } }}
        variant="outlined"
        size="small"
        placeholder="Search by name"
        onChange={handleInputChange}
      />
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
