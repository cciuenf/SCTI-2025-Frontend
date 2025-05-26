"use client"
import React from 'react'
import { Button } from './ui/button'

type Props = {
  onClick: (param: string) => any
  text: string
  param: string
}

const TestsButton = ({onClick, text, param}: Props) => {
  return (
    <Button onClick={()=> onClick(param)}> {text} </Button>
  )
}

export default TestsButton
