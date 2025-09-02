import React from 'react'
import { Github, Linkedin, Instagram } from 'lucide-react'
import Link from 'next/link'
type Props = {
  icon: string
  url: string
}

const SocialIcon = ({icon, url}: Props) => {
  return (
    <Link href={url}>
    {icon == "github" && <Github className='w-6 h-6 duration-300 hover:text-white'/>}
    {icon == "instagram" && <Instagram className='w-6 h-6 duration-300 hover:text-white'/>}
    {icon == "linkedin" && <Linkedin className='w-6 h-6 duration-300 hover:text-white'/>}
    </Link>
  )
}

export default SocialIcon
