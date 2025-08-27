"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Input, Card, Typography, Row, Col, List } from "antd";
import {
  SearchOutlined,
  ThunderboltOutlined,
  HeartOutlined,
} from "@ant-design/icons";

// import RadioGroup from "@/components/RadioGroup";
// import Loading from "@/components/Loading";
import Empty from "@/components/Empty";
import { RhymeTagEasy } from "@/components/RhymeTag";

import { apiClient } from "@/lib/api";
import { debounce } from "@/lib/utils";
// import {
//   RAP_NUM_OPTIONS,
//   TONE_TYPE_OPTIONS,
//   APP_CONFIG,
// } from "@/lib/constants";
import type { SearchParams } from "@/types";

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    word: "失败",
    rap_num: 2,
    tone_type: 2,
  });

  const [rhymes, setRhymes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 防抖搜索
  const debouncedSearch = useCallback(
    debounce(async (params: SearchParams) => {
      if (!params.word.trim()) {
        setRhymes([]);
        return;
      }
      
      setLoading(true);
      try {
        const data = await apiClient.getRhymes(params);
        setRhymes(data);
      } catch (error) {
        console.error("搜索失败:", error);
        setRhymes([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [] // 移除依赖，避免每次 searchParams 变化都重新创建防抖函数
  );

  // // 处理搜索
  // const handleSearch = useCallback(() => {
  //   if (!searchParams.word.trim()) {
  //     message.warning("请输入要查询的韵脚");
  //     return;
  //   }
  //   debouncedSearch(searchParams);
  // }, [searchParams, debouncedSearch]);

  // 处理输入变化
  const handleWordChange = useCallback(
    (value: string) => {
      const newParams = { ...searchParams, word: value };
      setSearchParams(newParams);

      if (value.trim()) {
        debouncedSearch(newParams);
      }
    },
    [searchParams, debouncedSearch]
  );

  // 处理参数变化
  // const handleParamChange = useCallback(
  //   (key: keyof SearchParams, value: number) => {
  //     const newParams = { ...searchParams, [key]: value };
  //     setSearchParams(newParams);

  //     if (searchParams.word.trim()) {
  //       debouncedSearch(newParams);
  //     }
  //   },
  //   [searchParams, debouncedSearch]
  // );

  useEffect(() => {
    if (searchParams.word) {
      debouncedSearch(searchParams);
    }
  }, [searchParams, debouncedSearch]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute"></div>
        <div className="relative max-w-7xl mx-auto px-1 py-2 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* <Title 
              level={1} 
              className="!text-white !text-5xl !font-bold !mb-4 animate-fade-in"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              🎤 {APP_CONFIG.name}
            </Title>
            <Paragraph className="!text-blue-100 !text-xl !mb-8 !max-w-2xl mx-auto">
              {APP_CONFIG.description}
            </Paragraph> */}

            {/* 搜索框 */}
            <div className="max-w-2xl mx-auto">
              <Input
                placeholder="请输入要押韵的韵脚，如：唱、爱、梦想..."
                size="large"
                prefix={<SearchOutlined />}
                value={searchParams.word}
                onChange={(e) => handleWordChange(e.target.value)}
              ></Input>
            </div>
          </div>
        </div>

        {/* 装饰性背景 */}
        {/* <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-300 rounded-full opacity-20 animate-ping"></div> */}
      </div>

      {/* 主要内容区 */}
      <div className=" mx-auto px-4 py-4" style={{ maxWidth: "444px" }}>
        {/* 控制面板 */}
        {/* <Card className="!mb-8 !shadow-xl !border-0 !rounded-2xl overflow-hidden">
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
                  onChange={(value) => handleParamChange("rap_num", value)}
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
                  onChange={(value) => handleParamChange("tone_type", value)}
                  buttonStyle="solid"
                />
              </div>
            </Col>
          </Row>
        </Card> */}

        {/* 搜索结果区域 */}
        {searchParams.word && (
          <div>
            {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 -m-6 mb-6">
              <Title level={3} className="!mb-2 !text-gray-700">
                <HeartOutlined className="mr-2 text-red-500" />
                "{searchParams.word}" 的押韵结果
              </Title>
              {rhymes.length > 0 && (
                <Paragraph className="!mb-0 !text-gray-500">
                  找到 <span className="font-bold text-blue-600">{rhymes.length}</span> 个押韵词汇
                </Paragraph>
              )}
            </div> */}

            <div style={{ height: "100%", width: "100%" }}>
              {!loading && rhymes.length === 0 && <Empty />}

              <List
                grid={{ gutter: 16, column: 6 }}
                dataSource={[
                  {
                    id: 1,
                    word: "差",
                    rate: 5,
                    length: 2,
                  },
                  {
                    id: 2,
                    word: "你",
                    rate: 4,
                    length: 2,
                  },
                  {
                    id: 3,
                    word: "不",
                    rate: 3,
                    length: 2,
                  },
                  {
                    id: 4,
                    word: "快",
                    rate: 2,
                    length: 2,
                  },
                  {
                    id: 5,
                    word: "谁",
                    rate: 1,
                    length: 2,
                  },
                  {
                    id: 6,
                    word: "错",
                    rate: 4,
                    length: 2,
                  },
                  {
                    id: 7,
                    word: "闹",
                    rate: 3,
                    length: 2,
                  },
                  {
                    id: 8,
                    word: "乱",
                    rate: 2,
                    length: 2,
                  },
                  {
                    id: 9,
                    word: "句",
                    rate: 1,
                    length: 2,
                  },
                  {
                    id: 10,
                    word: "认",
                    rate: 4,
                    length: 2,
                  },
                  {
                    id: 11,
                    word: "控",
                    rate: 2,
                    length: 2,
                  },
                  {
                    id: 12,
                    word: "信",
                    rate: 1,
                    length: 2,
                  },
                  {
                    id: 13,
                    word: "家",
                    rate: 4,
                    length: 2,
                  },
                  {
                    id: 14,
                    word: "夜",
                    rate: 3,
                    length: 2,
                  },
                  {
                    id: 15,
                    word: "话",
                    rate: 2,
                    length: 2,
                  },
                  {
                    id: 16,
                    word: "血",
                    rate: 1,
                    length: 2,
                  },
                  {
                    id: 17,
                    word: "天",
                    rate: 4,
                    length: 2,
                  },
                  {
                    id: 18,
                    word: "强",
                    rate: 3,
                    length: 2,
                  },
                ]}
                renderItem={(rhythm) => (
                  <List.Item>
                    <RhymeTagEasy
                      key={rhythm.id || `${rhythm.word}-${rhythm.rate}`}
                      word={rhythm.word}
                      rate={rhythm.rate}
                      length={rhythm.length}
                      onClick={() => handleWordChange(rhythm.word)}
                      className="transform hover:scale-110 transition-all duration-300"
                    ></RhymeTagEasy>
                  </List.Item>
                )}
              />
              {!loading && rhymes.length > 0 && (
                <div className="space-y-2">
                  {/* 按长度分组展示 */}
                  {[4, 3, 2, 5].map((length) => {
                    // console.warn(rhymes.map((k) =>{
                    //   return k.word;
                    // }));
                    // console.warn(rhymes);
                    const lengthRhymes = rhymes.filter(
                      (r) => r.length === length
                    );
                    if (lengthRhymes.length === 0) return null;

                    return (
                      <div key={length} className={`p-1 rounded-xl`}>
                        {/* <Title level={5} className="!mb-3 !text-gray-700">
                          {lengthInfo.icon} {lengthInfo.title} ({lengthRhymes.length}个)
                        </Title> */}
                        <div className="flex flex-wrap gap-2">
                          <List
                            grid={{ gutter: 16, column: length === 2 ? 5 : 4 }}
                            dataSource={lengthRhymes}
                            renderItem={(rhythm) => (
                              <List.Item>
                                <RhymeTagEasy
                                  key={
                                    rhythm.id || `${rhythm.word}-${rhythm.rate}`
                                  }
                                  word={rhythm.word}
                                  rate={rhythm.rate}
                                  length={rhythm.length}
                                  onClick={() => handleWordChange(rhythm.word)}
                                  className="transform hover:scale-110 transition-all duration-300"
                                ></RhymeTagEasy>
                              </List.Item>
                            )}
                          />
                          {/* 
                          {lengthRhymes.map((rhythm: any) => (
                            // <RhymeTag
                            //   key={rhythm.id || `${rhythm.word}-${rhythm.rate}`}
                            //   word={rhythm.word}
                            //   rate={rhythm.rate}
                            //   length={rhythm.length}
                              </List.Item>
                            )}
                          />

                          {lengthRhymes.map((rhythm: any) => (
                            // <RhymeTag
                            //   key={rhythm.id || `${rhythm.word}-${rhythm.rate}`}
                            //   word={rhythm.word}
                            //   rate={rhythm.rate}
                            //   length={rhythm.length}
                            //   onClick={() => handleWordChange(rhythm.word)}
                            //   className="transform hover:scale-110 transition-all duration-300"
                            // />
                           
                          ))} */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
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
                    <Title level={5} className="!mb-2">
                      输入韵脚
                    </Title>
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
                    <Title level={5} className="!mb-2">
                      调整参数
                    </Title>
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
                    <Title level={5} className="!mb-2">
                      获得灵感
                    </Title>
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
      {/* <Loading show={loading} tip="正在搜索押韵词汇..." /> */}
    </div>
  );
}
