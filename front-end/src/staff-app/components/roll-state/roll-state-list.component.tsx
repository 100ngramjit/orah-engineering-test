// @ts-nocheck

//external imports
import React, { useContext } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

//internal imports
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { Spacing, FontWeight } from "shared/styles/styles"
import { RolllStateType } from "shared/models/roll"
import { RollContext } from "shared/context/RollContext"

interface Props {
  onItemClick?: (type: ItemType) => void
  size?: number
}
export const RollStateList: React.FC<Props> = ({ size = 14, onItemClick = true }) => {
  //misc
  const { rollCountStateList, setStudentData, data, iconColor } = useContext(RollContext)

  //func
  const onClick = (type: ItemType) => {
    if (onItemClick) {
      const filteredData = data?.students?.filter((item) => {
        if (type !== "all") {
          if (item.id in iconColor) {
            if (iconColor[item.id] === type) {
              return item
            }
          }
        } else {
          return data?.students
        }
      })
      setStudentData(filteredData)
      onItemClick(type)
    }
  }

  return (
    <S.ListContainer>
      {rollCountStateList.map(({ type, count }, i) => {
        if (type === "all") {
          return (
            <S.ListItem key={i}>
              <FontAwesomeIcon icon="users" size="sm" style={{ cursor: "pointer" }} onClick={() => onClick(type)} />
              <span>{count}</span>
            </S.ListItem>
          )
        }

        return (
          <S.ListItem key={i}>
            <RollStateIcon type={type} size={size} onClick={() => onClick(type)} />
            <span>{count}</span>
          </S.ListItem>
        )
      })}
    </S.ListContainer>
  )
}

const S = {
  ListContainer: styled.div`
    display: flex;
    align-items: center;
  `,
  ListItem: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u2};

    span {
      font-weight: ${FontWeight.strong};
      margin-left: ${Spacing.u2};
    }
  `,
}

type ItemType = RolllStateType | "all"
