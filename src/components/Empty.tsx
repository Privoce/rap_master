"use client";

import React from "react";
import { Button, Card, Empty as AntEmpty, Typography } from "antd";

interface EmptyProps {
  description?: string;
  className?: string;
  onReset?: () => void;
}

export default function Empty({
  description = "未找到符合条件的韵脚",
  className = "",
  onReset,
}: EmptyProps) {
  return (
    <AntEmpty
      description={
        <>
          <Typography.Paragraph strong type="warning">
            {description}
          </Typography.Paragraph>
          <Typography.Paragraph type="secondary">
            没关系，换个词试试吧！ 或者调整一下搜索条件
          </Typography.Paragraph>
        </>
      }
      className={className}
    >
      <Card>
        <Typography.Title level={4}>💡 小贴士：</Typography.Title>
        <div
          style={{
            width: "max-content",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            textAlign: "left",
          }}
        >
          <p>
            <RoundedNumber number={1} /> 尝试使用更常见的字词
          </p>
          <p>
            <RoundedNumber number={2} /> 调整押韵数量设置
          </p>
          <p>
            <RoundedNumber number={3} /> 改变音调类型要求
          </p>
          <p>
            <RoundedNumber number={4} /> 修改词语长度筛选
          </p>
        </div>

        {onReset && (
          <Button
            type="primary"
            size="large"
            onClick={onReset}
            className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 border-0 hover:from-blue-600 hover:to-purple-600"
          >
            重新开始搜索
          </Button>
        )}
      </Card>
    </AntEmpty>
  );
}

function RoundedNumber({ number }: { number: number }) {
  return (
    <Button type="primary" shape="circle" onClick={() => {}} size="small">
      {number}
    </Button>
  );
}
