"use client";

import React, { useState, useCallback } from "react";
import { Input, Card, Typography, Button, List, Space, message } from "antd";
import {
  SearchOutlined,
  ThunderboltOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Empty from "@/components/Empty";
import { requestAILocal } from "@/lib/ai";

const { Title, Paragraph, Text } = Typography;

interface WordRate {
  word: string;
  rate: number;
  found: boolean;
}

interface SentenceResult {
  sentence: string;
  words: WordRate[];
}

function TestsPage() {
  const [inputWord, setInputWord] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<SentenceResult[]>([]);

  // 分词函数 - 这里需要在客户端调用 API
  const segmentSentence = async (sentence: string): Promise<string[]> => {
    try {
      const response = await fetch("/api/segment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: sentence }),
      });

      if (!response.ok) {
        throw new Error("分词服务调用失败");
      }

      const data = await response.json();
      // 只返回2字词语
      return data.words.filter((word: string) => word.length === 2);
    } catch (error) {
      console.error("分词错误:", error);
      return [];
    }
  };

  // 查询词语评分
  const queryWordRates = async (words: string[]): Promise<WordRate[]> => {
    try {
      const response = await fetch("/api/word-rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ words }),
      });

      if (!response.ok) {
        throw new Error("词语评分查询失败");
      }

      const data = await response.json();
      return data.wordRates;
    } catch (error) {
      console.error("查询词语评分错误:", error);
      return words.map((word) => ({ word, rate: 0, found: false }));
    }
  };

  const handleSingleWord = useCallback(async () => {
    if (!inputWord.trim()) {
      message.warning("请输入一个词语");
      return;
    }

    const wordRates = await queryWordRates([inputWord]);
    console.warn(wordRates);
    return wordRates;
  }, [inputWord]);

  // 处理用户输入和AI生成
  // const handleGenerate = useCallback(async () => {
  //   if (!inputWord.trim()) {
  //     message.warning("请输入一个词语");
  //     return;
  //   }

  //   setLoading(true);
  //   setResults([]);

  //   try {
  //     // 1. 使用本地AI生成句子
  //     const aiResponse = await requestAILocal({
  //       model: "qwen2.5:0.5b",
  //       prompt: `请用"${inputWord}"这个词造3个不同的句子，每个句子独占一行，不要添加序号或其他标记。句子要自然流畅，长度在10-20字之间。`,
  //       options: {
  //         temperature: 0.8,
  //         num_predict: 200,
  //       },
  //     });

  //     if (!aiResponse.success) {
  //       throw new Error(aiResponse.error || "AI生成失败");
  //     }

  //     // 解析AI返回的句子
  //     const generatedText = aiResponse.data.response || "";

  //     const sentences = generatedText
  //       .split("\n")
  //       .map((s) => s.trim())
  //       .filter((s) => s.length > 0)
  //       .slice(0, 3); // 只取前3个句子
  //     console.warn(sentences);
  //     if (sentences.length === 0) {
  //       throw new Error("AI未能生成有效句子");
  //     }

  //     // 2. 对每个句子进行分词和评分
  //     const sentenceResults: SentenceResult[] = [];

  //     for (const sentence of sentences) {
  //       // 分词
  //       const words = await segmentSentence(sentence);

  //       // 去重
  //       const uniqueWords = [...new Set(words)];
  //       console.warn(uniqueWords);
  //       // 查询评分
  //       const wordRates = await queryWordRates(uniqueWords);

  //       // sentenceResults.push({
  //       //   sentence,
  //       //   words: wordRates,
  //       // });
  //     }

  //     // setResults(sentenceResults);
  //     // message.success(`成功生成${sentences.length}个句子并完成分析`);
  //   } catch (error) {
  //     console.error("生成分析失败:", error);
  //     message.error(error instanceof Error ? error.message : "生成分析失败");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [inputWord]);

  // 渲染词语评分
  const renderWordRate = (wordRate: WordRate) => {
    const getScoreColor = (rate: number) => {
      if (rate >= 80) return "#52c41a"; // 绿色 - 高频
      if (rate >= 50) return "#faad14"; // 黄色 - 中频
      if (rate >= 20) return "#fa8c16"; // 橙色 - 低频
      return "#f5222d"; // 红色 - 极低频或未找到
    };

    return (
      <div
        key={wordRate.word}
        className="inline-block m-1 px-3 py-1 rounded-full border"
        style={{
          backgroundColor: wordRate.found
            ? `${getScoreColor(wordRate.rate)}20`
            : "#f5f5f5",
          borderColor: wordRate.found
            ? getScoreColor(wordRate.rate)
            : "#d9d9d9",
        }}
      >
        <Text
          strong={wordRate.found}
          style={{
            color: wordRate.found ? getScoreColor(wordRate.rate) : "#999",
          }}
        >
          {wordRate.word}
        </Text>
        <Text
          type="secondary"
          style={{
            marginLeft: 8,
            fontSize: "12px",
            color: wordRate.found ? getScoreColor(wordRate.rate) : "#ccc",
          }}
        >
          {wordRate.found ? wordRate.rate : "未找到"}
        </Text>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 输入区域 */}
        <Card className="!mb-6 !shadow-lg !border-0 !rounded-2xl">
          <div className="text-center">
            <Title level={4} className="!mb-4 !text-gray-700">
              <ThunderboltOutlined className="mr-2 text-blue-500" />
              请输入一个词语
            </Title>

            <Space.Compact style={{ width: "100%", maxWidth: 400 }}>
              <Input
                placeholder="例如：科技、爱情、梦想..."
                size="large"
                prefix={<SearchOutlined />}
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                // onPressEnter={handleGenerate}
                disabled={loading}
              />
              <Button
                size="large"
                type="primary"
                // onClick={handleGenerate}
                onClick={handleSingleWord}
                loading={loading}
              >
                {loading ? "生成中..." : "开始分析"}
              </Button>
            </Space.Compact>
          </div>
        </Card>

        {/* 结果展示区域 */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card
                key={index}
                className="!shadow-lg !border-0 !rounded-2xl"
                title={
                  <div className="flex items-center">
                    <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                      {index + 1}
                    </span>
                    <Text strong>句子分析</Text>
                  </div>
                }
              >
                {/* 原句 */}
                <div className="mb-4">
                  <Text type="secondary">原句：</Text>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <Text className="text-lg">{result.sentence}</Text>
                  </div>
                </div>

                {/* 分词结果 */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Text type="secondary">
                      分词结果（共 {result.words.length} 个二字词）：
                    </Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      颜色表示词频：
                      <span style={{ color: "#52c41a", marginLeft: 4 }}>
                        高频
                      </span>
                      <span style={{ color: "#faad14", marginLeft: 4 }}>
                        中频
                      </span>
                      <span style={{ color: "#fa8c16", marginLeft: 4 }}>
                        低频
                      </span>
                      <span style={{ color: "#f5222d", marginLeft: 4 }}>
                        未找到
                      </span>
                    </Text>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    {result.words.length > 0 ? (
                      result.words.map(renderWordRate)
                    ) : (
                      <Text type="secondary">该句子中没有找到二字词语</Text>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 空状态 */}
        {!loading && results.length === 0 && inputWord && (
          <Card className="!shadow-lg !border-0 !rounded-2xl">
            <Empty />
          </Card>
        )}
      </div>
    </div>
  );
}

export default TestsPage;
