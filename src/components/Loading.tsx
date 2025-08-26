'use client'

import React from 'react'

interface LoadingProps {
  show?: boolean
  tip?: string
  className?: string
}

export default function Loading({ 
  show = false, 
  tip = '正在搜索押韵词汇...',
  className = ''
}: LoadingProps) {
  if (!show) return null

  return (
    <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-2xl p-12 shadow-2xl max-w-sm mx-4">
        <div className="text-center">
          {/* 自定义加载动画 */}
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 w-12 h-12 border-2 border-purple-300 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="text-2xl">🎵</div>
            <h3 className="text-lg font-semibold text-gray-700">
              {tip}
            </h3>
            <p className="text-sm text-gray-500">
              正在为您寻找最佳押韵词汇
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
