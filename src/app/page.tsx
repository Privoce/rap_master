"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Input, Card, Typography, Row, Col, List, Tabs, InputRef } from "antd";
import {
  SearchOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  CloseCircleOutlined,
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
import type { Rhythm, SearchParams } from "@/types";
import { STANDARD_WORDS } from "@/lib/constants";
import { TabsProps } from "antd/lib";

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    word: "失败",
    rap_num: 2,
    tone_type: 2,
  });

  const [rhymes, setRhymes] = useState<Rhythm[]>([]);
  const [singleRhymes, setSingleRhymes] = useState<Rhythm[]>([]);
  const [singleRhymesHistory, setSingleRhymesHistory] = useState<
    Map<string, Rhythm[]>
  >(new Map());
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Map<string, Rhythm[]>>(new Map());
  // 判断当前输入的是否为中文
  const isKeyChinese = useRef(false);
  const searchInputRef = useRef<InputRef>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current?.input.addEventListener("compositionstart", () => {
        isKeyChinese.current = true;
      });
    }
  }, [searchInputRef.current]);

  // 防抖搜索
  const debouncedSearch = useCallback(
    debounce(async (params: SearchParams) => {
      let hasEnWord = /[a-zA-Z]/.test(params.word);
      if (hasEnWord) {
        setRhymes([]);
        return;
      }
      if (!params.word.trim() && !isKeyChinese.current) {
        setRhymes([]);
        return;
      }

      setLoading(true);
      try {
        let { single, sortedResults: data } = await apiClient.getRhymes(params);
        let existedWords = new Set<string>();
        data = data.filter((item) => {
          let final2 = item.word.length >= 2 ? item.word.slice(-2) : item.word;
          if (!existedWords.has(final2)) {
            existedWords.add(final2);
            return true;
          }
          return false;
        });

        setRhymes(data);
        setSingleRhymes(single);
        setHistory((prev) => new Map(prev).set(params.word, data));
        setSingleRhymesHistory((prev) =>
          new Map(prev).set(params.word, single)
        );
        setActiveKey(params.word);
      } catch (error) {
        console.error("搜索失败:", error);
        setRhymes([]);
      } finally {
        setLoading(false);
      }
    }, 500),
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

  const removeHistory = (key: string) => {
    setHistory((prev) => {
      const newHistory = new Map(prev);
      newHistory.delete(key);
      setActiveKey(newHistory.keys().next().value);
      return newHistory;
    });
    setSingleRhymesHistory((prev) => {
      const newHistory = new Map(prev);
      newHistory.delete(key);
      return newHistory;
    });
  };

  const searchItems: TabsProps["items"] = useMemo(() => {
    let items = [];
    // 限制history长度为5，如果超过3则删除最老的一个
    if (history.size > 5) {
      history.delete(history.keys().next().value);
    }
    history.forEach((value, key) => {
      items.push({
        key,
        label: (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "4px",
              padding: "0 0px",
              width: "74px",
            }}
            onClick={() => setActiveKey(key)}
          >
            <span>{key}</span>
            <CloseCircleOutlined
              onClick={() => removeHistory(key)}
            ></CloseCircleOutlined>
          </div>
        ),
        children: (
          <div className="space-y-2">
            {[4, 3, 2, 5].map((length) => {
              const lengthRhymes = value.filter(
                (r) => r.length === length && r.length > 1
              );
              if (lengthRhymes.length === 0) return null;

              return (
                <div key={length} className={`p-1 rounded-xl`}>
                  <div className="flex flex-wrap gap-2">
                    <List
                      grid={{ gutter: 16, column: length === 2 ? 5 : 4 }}
                      dataSource={lengthRhymes}
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
                  </div>
                </div>
              );
            })}
          </div>
        ),
      });
    });

    return items;
  }, [history]);

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
                onChange={(e) => {
                  isKeyChinese.current = false;
                  handleWordChange(e.target.value);
                }}
                ref={searchInputRef}
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
      <div className="mx-auto px-2 py-4" style={{ maxWidth: "444px" }}>
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
          <div style={{ height: "100%", width: "100%" }}>
            {!loading && rhymes.length === 0 && <Empty />}
          </div>
        )}
        {(singleRhymesHistory.get(activeKey || "") || []).length === 0 ? (
          <StandardWords handleWordChange={handleWordChange}></StandardWords>
        ) : (
          <StandardWordsAfterSearch
            rhythms={singleRhymesHistory.get(activeKey || "") || []}
            handleWordChange={handleWordChange}
          ></StandardWordsAfterSearch>
        )}
        <Tabs
          activeKey={activeKey}
          items={searchItems}
          size="small"
          tabBarGutter={10}
        ></Tabs>
        {/* 说明区域 */}
        {!searchParams.word && history.size === 0 && (
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

function StandardWords({
  handleWordChange,
}: {
  handleWordChange: (value: string) => void;
}) {
  return (
    <List
      grid={{ gutter: 16, column: 6 }}
      dataSource={STANDARD_WORDS}
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
  );
}

function StandardWordsAfterSearch({
  handleWordChange,
  rhythms,
}: {
  rhythms: Rhythm[];
  handleWordChange: (value: string) => void;
}) {
  const [handledRhythms, setHandledRhythms] = useState<Rhythm[]>([]);
  useEffect(() => {
    const existedWords = new Set<string>();
    const res = rhythms
      .filter((r) => {
        if (existedWords.has(r.word.charAt(r.word.length - 1))) return false;
        existedWords.add(r.word.charAt(r.word.length - 1));
        return true;
      })
      .map((r) => {
        r.word = r.word.charAt(r.word.length - 1);
        return r;
      })
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 18);
    setHandledRhythms(res);
  }, [rhythms]);

  return (
    <List
      grid={{ gutter: 16, column: 6 }}
      dataSource={handledRhythms}
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
  );
}
