import React, { useEffect } from "react"
import styled from "styled-components"
import { FontSize, FontWeight, Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { makeStyles } from "@material-ui/styles"
import { Accordion, AccordionSummary, Typography, AccordionDetails, Divider, Chip } from "@material-ui/core"
import { RolllStateType } from "shared/models/roll"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"

export const ActivityPage: React.FC = () => {
  const [getRoll, RollData, RollLoadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })
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
  }))
  const classes = useStyles()

  useEffect(() => {
    getRoll()
  }, [getRoll])

  useEffect(() => {
    console.log("getRollData", RollData)
  }, [RollLoadState])
  return (
    <S.Container>
      <Typography>List of completed rolls</Typography>
      {RollLoadState === "loading" && (
        <CenteredContainer>
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}

      {RollLoadState === "loaded" &&
        RollData?.activity?.map((ele) => (
          <div className={classes.root} key={ele.date.toString()}>
            <Accordion>
              <AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<FontAwesomeIcon icon={faChevronDown} />}>
                <Typography>{ele.entity.name}</Typography>
              </AccordionSummary>
              <Divider />
              <AccordionDetails className={classes.details}>
                <Typography>Student ID</Typography>
                <Typography>Roll State</Typography>
              </AccordionDetails>
              <Divider />
              {ele.entity.student_roll_states.map((ele, i) => {
                return (
                  <AccordionDetails key={i} className={classes.details}>
                    <Typography>{ele.student_id}</Typography>
                    <Chip label={ele.roll_state} style={{ backgroundColor: getBgColor(ele.roll_state) }} />
                  </AccordionDetails>
                )
              })}
            </Accordion>
          </div>
        ))}
    </S.Container>
  )
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

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
