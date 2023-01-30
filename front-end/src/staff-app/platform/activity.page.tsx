//external imports
import React, { useContext, useEffect } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { makeStyles } from "@material-ui/styles"
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Divider,
  Chip,
  Container,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  withStyles,
} from "@material-ui/core"

//internal
import { FontSize, FontWeight, Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { RolllStateType } from "shared/models/roll"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { RollContext } from "shared/context/RollContext"
import { PersonHelper } from "shared/models/person"
import { Colors } from "shared/styles/colors"

export const ActivityPage: React.FC = () => {
  //misc
  const [getRoll, RollData, RollLoadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })
  const { data } = useContext(RollContext)

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: `${Colors.blue.base}`,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell)

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      padding: `${Spacing.u2}`,
      fontSize: `${FontSize.u4}`,
    },

    details: {
      justifyContent: "space-around",
    },
    column: {
      flexBasis: "50%",
    },
    heading: {
      flexBasis: "50%",
      flexShrink: 0,
    },
    secondaryHeading: {
      color: "#787777",
    },
    pageHeading: {
      padding: 2,
      margin: 2,
    },
  }))
  const classes = useStyles()

  //func
  const getDate = (date: any) => {
    const updatedDate = new Date(date)
    return updatedDate.toLocaleString()
  }

  function getBgColor(type: RolllStateType) {
    switch (type) {
      case "unmark":
        return "#9b9b9b"
      case "present":
        return "#13943b"
      case "absent":
        return "#9b9b9b"
      case "late":
        return "#f5a623"
      default:
        return "#13943b"
    }
  }

  //async
  useEffect(() => {
    getRoll()
  }, [getRoll])

  return (
    <S.Container>
      <Typography className={classes.pageHeading}>List of completed rolls</Typography>
      {RollLoadState === "loading" && (
        <CenteredContainer>
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}

      {RollLoadState === "loaded" &&
        RollData?.activity?.map(({ date, entity }) => (
          <div className={classes.root} key={date.toString()}>
            <Accordion>
              <AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<FontAwesomeIcon icon={faChevronDown} />}>
                <Typography className={classes.heading}>{entity.name}</Typography>
                <Typography className={classes.secondaryHeading}>{getDate(date)}</Typography>
              </AccordionSummary>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="left">Student ID</StyledTableCell>
                      <StyledTableCell align="left">Student Name</StyledTableCell>
                      <StyledTableCell align="left">Roll State</StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {entity.student_roll_states.map(({ student_id, roll_state }, index) => {
                      return (
                        <TableRow hover key={student_id.toString()} className={classes.details}>
                          <TableCell align="left">{student_id}</TableCell>
                          <TableCell align="left">{PersonHelper.getFullName(data?.students[index]!)}</TableCell>
                          <TableCell align="left">
                            <Chip label={roll_state} style={{ backgroundColor: getBgColor(roll_state) }} />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Accordion>
          </div>
        ))}
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
