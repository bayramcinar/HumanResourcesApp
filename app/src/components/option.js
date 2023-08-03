import React from 'react'
import "./style/option.css"
function Option({id,name}) {
  return (
    <option value={id}>{name}</option> 
  )
}

export default Option;
