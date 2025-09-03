"use client";

import { Button, Card, List } from "antd";

export function Page() {
  return (
    <Card>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={["1", "2"]}
        renderItem={(rhythm) => <List.Item>
          <Button>{rhythm}</Button>
        </List.Item>}
      />
    </Card>
  );
}

export default Page;
