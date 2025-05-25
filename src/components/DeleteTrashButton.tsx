"use client"
import React from 'react'

import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'
import { Button } from './ui/button'
import { Trash } from 'lucide-react'


type Props = {
  uniqueParam: string
  deleteFunction: (uniqueParam: string) => any
}

const DeleteTrashButton = ({deleteFunction, uniqueParam}: Props) => {
  return (
    <Popover>
          <PopoverTrigger asChild>
            <Trash className="w-7 h-7 p-1 rounded-md cursor-pointer bg-destructive text-popover hover:text-destructive hover:bg-transparent duration-300 " />
          </PopoverTrigger>
          <PopoverContent side="left" className="w-80 h-28" sideOffset={12}>
            <div className="w-full rounded-md flex flex-col items-center justify-around">
              <p className="text-sm">
                Tem certeza que deseja apagar esse evento?
              </p>
              <div className="flex justify-around items-center w-full">
                <Button
                  variant={"destructive"}
                  onClick={() => deleteFunction(uniqueParam)}
                >
                  Sim
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
  )
}

export default DeleteTrashButton
