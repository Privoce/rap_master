'use client'

import React from 'react'
import { getHotLevel } from '@/lib/utils'

interface RhymeTagProps {
  word: string
  rate: number
  length: number
  className?: string
  onClick?: () => void
}

const getRateConfig = (level: string) => {
  switch (level) {
    case 'rate-hot':
      return {
        color: 'red',
        icon: '🔥',
        gradient: 'from-red-400 to-red-600',
        text: 'text-white'
      }
    case 'rate-popular':
      return {
        color: 'orange', 
        icon: '🌟',
        gradient: 'from-orange-400 to-orange-600',
        text: 'text-white'
      }
    case 'rate-common':
      return {
        color: 'blue',
        icon: '👍', 
        gradient: 'from-blue-400 to-blue-600',
        text: 'text-white'
      }
    case 'rate-rare':
      return {
        color: 'purple',
        icon: '💎',
        gradient: 'from-purple-400 to-purple-600', 
        text: 'text-white'
      }
    default:
      return {
        color: 'default',
        icon: '',
        gradient: 'from-gray-400 to-gray-600',
        text: 'text-white'
      }
  }
}

export default function RhymeTag({
  word,
  rate,
  length,
  className = '',
  onClick
}: RhymeTagProps) {
  const hotLevel = getHotLevel(length, rate)
  const config = getRateConfig(hotLevel)

  return (
    <div
      className={`
        inline-block cursor-pointer m-1 px-4 py-2 rounded-full
        bg-gradient-to-r ${config.gradient} ${config.text}
        hover:scale-110 hover:shadow-lg hover:shadow-${config.color}-200
        transform transition-all duration-300 ease-out
        font-medium text-sm
        border-2 border-white/20
        ${className}
      `}
      onClick={onClick}
    >
      <span className="mr-1 text-base">{config.icon}</span>
      <span className="font-semibold">{word}</span>
    </div>
  )
}
