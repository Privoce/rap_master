'use client'

import React, { useState, useCallback } from 'react'
import { Input, Card, message, Typography, Button, Row, Col } from 'antd'
import { SearchOutlined, ThunderboltOutlined, StarOutlined, HeartOutlined } from '@ant-design/icons'

import RadioGroup from '@/components/RadioGroup'
import Loading from '@/components/Loading'
import Empty from '@/components/Empty'
import RhymeTag from '@/components/RhymeTag'

import { apiClient } from '@/lib/api'
import { debounce, getHotLevel } from '@/lib/utils'
import { 
  RAP_NUM_OPTIONS, 
  TONE_TYPE_OPTIONS, 
  APP_CONFIG 
} from '@/lib/constants'
import type { SearchParams } from '@/types'

const { Title, Paragraph } = Typography

export default function HomePage() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    word: '',
    rap_num: 1,
    tone_type: 0,
  })
  
  const [rhymes, setRhymes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // 防抖搜索
  const debouncedSearch = useCallback(
    debounce(async (params: SearchParams) => {
      if (!params.word.trim()) {
        setRhymes([])
        return
      }
      
      setLoading(true)
      try {
        const results = await apiClient.getRhymes(params)
        setRhymes(results)
      } catch (error: any) {
        message.error(error.message || '搜索失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }, 500),
    []
  )

  // 处理搜索
  const handleSearch = useCallback(() => {
    if (!searchParams.word.trim()) {
      message.warning('请输入要查询的韵脚')
      return
    }
    debouncedSearch(searchParams)
  }, [searchParams, debouncedSearch])

  // 处理输入变化
  const handleWordChange = useCallback((value: string) => {
    const newParams = { ...searchParams, word: value }
    setSearchParams(newParams)
    
    // if (value.trim()) {
    //   debouncedSearch(newParams)
    // }
  }, [searchParams, debouncedSearch])

  // 处理参数变化
  const handleParamChange = useCallback((key: keyof SearchParams, value: number) => {
    const newParams = { ...searchParams, [key]: value }
    setSearchParams(newParams)
    
    if (searchParams.word.trim()) {
      debouncedSearch(newParams)
    }
  }, [searchParams, debouncedSearch])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <Title 
              level={1} 
              className="!text-white !text-5xl !font-bold !mb-4 animate-fade-in"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              🎤 {APP_CONFIG.name}
            </Title>
            <Paragraph className="!text-blue-100 !text-xl !mb-8 !max-w-2xl mx-auto">
              {APP_CONFIG.description}
            </Paragraph>
            
            {/* 搜索框 */}
            <div className="max-w-2xl mx-auto">
              <Input.Search
                size="large"
                placeholder="请输入要押韵的韵脚，如：唱、爱、梦想..."
                enterButton={
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />}
                    className="!bg-orange-500 !border-orange-500 hover:!bg-orange-400"
                  >
                    搜索押韵
                  </Button>
                }
                value={searchParams.word}
                onChange={(e) => handleWordChange(e.target.value)}
                onSearch={handleSearch}
                className="!shadow-2xl"
                style={{ 
                  fontSize: '18px',
                  borderRadius: '50px',
                }}
              />
            </div>
          </div>
        </div>
        
        {/* 装饰性背景 */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-300 rounded-full opacity-20 animate-ping"></div>
      </div>

      {/* 主要内容区 */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* 控制面板 */}
        <Card className="!mb-8 !shadow-xl !border-0 !rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 -m-6 mb-6">
            <Title level={3} className="!mb-0 !text-gray-700 text-center">
              <ThunderboltOutlined className="mr-2 text-yellow-500" />
              自定义押韵参数
            </Title>
          </div>
          
          <Row gutter={[48, 24]} justify="center">
            <Col xs={24} md={12}>
              <div className="text-center">
                <Title level={5} className="!mb-4 !text-gray-600">
                  <StarOutlined className="mr-2 text-blue-500" />
                  押韵数量
                </Title>
                <RadioGroup
                  options={RAP_NUM_OPTIONS}
                  value={searchParams.rap_num}
                  onChange={(value) => handleParamChange('rap_num', value)}
                  buttonStyle="solid"
                />
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              <div className="text-center">
                <Title level={5} className="!mb-4 !text-gray-600">
                  🎵 音调类型
                </Title>
                <RadioGroup
                  options={TONE_TYPE_OPTIONS}
                  value={searchParams.tone_type}
                  onChange={(value) => handleParamChange('tone_type', value)}
                  buttonStyle="solid"
                />
              </div>
            </Col>
          </Row>
        </Card>

        {/* 搜索结果区域 */}
        {searchParams.word && (
          <Card className="!shadow-xl !border-0 !rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 -m-6 mb-6">
              <Title level={3} className="!mb-2 !text-gray-700">
                <HeartOutlined className="mr-2 text-red-500" />
                "{searchParams.word}" 的押韵结果
              </Title>
              {rhymes.length > 0 && (
                <Paragraph className="!mb-0 !text-gray-500">
                  找到 <span className="font-bold text-blue-600">{rhymes.length}</span> 个押韵词汇
                </Paragraph>
              )}
            </div>
            
            <div className="min-h-[300px]">
              {!loading && rhymes.length === 0 && (
                <Empty />
              )}
              
              {!loading && rhymes.length > 0 && (
                <div className="space-y-6">
                  {/* 按长度分组展示 */}
                  {[4, 3, 2, 5].map(length => {
                    const lengthRhymes = rhymes.filter(r => r.length === length)
                    if (lengthRhymes.length === 0) return null
                    
                    const lengthInfo = {
                      4: { title: '四字词汇', color: 'red', bg: 'bg-red-50', icon: '🔥' },
                      3: { title: '三字词汇', color: 'orange', bg: 'bg-orange-50', icon: '⭐' },
                      2: { title: '二字词汇', color: 'blue', bg: 'bg-blue-50', icon: '💎' },
                      5: { title: '长词汇', color: 'purple', bg: 'bg-purple-50', icon: '🎯' }
                    }[length]!
                    
                    return (
                      <div key={length} className={`p-4 rounded-xl ${lengthInfo.bg}`}>
                        <Title level={5} className="!mb-3 !text-gray-700">
                          {lengthInfo.icon} {lengthInfo.title} ({lengthRhymes.length}个)
                        </Title>
                        <div className="flex flex-wrap gap-2">
                          {lengthRhymes.map((rhythm: any) => (
                            <RhymeTag
                              key={rhythm.id || `${rhythm.word}-${rhythm.rate}`}
                              word={rhythm.word}
                              rate={rhythm.rate}
                              length={rhythm.length}
                              onClick={() => handleWordChange(rhythm.word)}
                              className="transform hover:scale-110 transition-all duration-300"
                            />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* 说明区域 */}
        {!searchParams.word && (
          <Card className="!shadow-xl !border-0 !rounded-2xl !bg-gradient-to-r !from-purple-50 !to-pink-50">
            <div className="text-center py-8">
              <Title level={3} className="!mb-4 !text-gray-700">
                🎯 使用说明
              </Title>
              <Row gutter={[24, 24]} className="mt-8">
                <Col xs={24} md={8}>
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <SearchOutlined className="text-2xl text-blue-600" />
                    </div>
                    <Title level={5} className="!mb-2">输入韵脚</Title>
                    <Paragraph className="!text-gray-500">
                      在搜索框中输入你想要押韵的词汇
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ThunderboltOutlined className="text-2xl text-green-600" />
                    </div>
                    <Title level={5} className="!mb-2">调整参数</Title>
                    <Paragraph className="!text-gray-500">
                      选择押韵类型、音调和词长
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <HeartOutlined className="text-2xl text-purple-600" />
                    </div>
                    <Title level={5} className="!mb-2">获得灵感</Title>
                    <Paragraph className="!text-gray-500">
                      点击结果词汇继续联想创作
                    </Paragraph>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        )}
      </div>

      {/* Loading Overlay */}
      <Loading show={loading} tip="正在搜索押韵词汇..." />
    </div>
  )
}
