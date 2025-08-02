import React from 'react'

type Props = {
  data: any
}

const TopCard = ({data}: Props) => {
  return (
    <div className='flex flex-col justify-between items-start shadow-sm rounded-md px-3 py-2 min-h-24'>
      <h2 className='text-2xl font-bold'>{`${data.name}  ${data.last_name}`}</h2>
      <h2 className='text-2xl'>{data.email}</h2>
    </div>
  )
}

export default TopCard
