import { Person } from "shared/models/person"

export const sortByFirstName=(arr:Person[])=>{
    const res= [...arr].sort((a, b)=> {
    const nameA = a.first_name
    const nameB = b.first_name
    if (nameA > nameB) return 1
    if (nameA < nameB) return -1
    return 0
  })
  return res

}

export const sortByLastName=(arr:Person[])=>{
   const res= [...arr].sort((a, b)=> {
    const nameA = a.last_name
    const nameB = b.last_name
    if (nameA > nameB) return 1
    if (nameA < nameB) return -1
    return 0
  })
  return res
}

export const searchByName=(arr:Person[],query:string)=>{
    const res=[...arr].filter((ele)=>{
        if(ele.first_name.toLowerCase().includes(query.toLowerCase())||ele.first_name.toLowerCase().includes(query.toLowerCase())||(ele.first_name.toLowerCase()+" "+ele.last_name.toLowerCase()).includes(query.toLowerCase())){
            return ele
        }
    })
    return res
}