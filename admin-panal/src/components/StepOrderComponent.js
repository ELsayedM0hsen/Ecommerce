import React from 'react';
import { Popover, Steps } from 'antd';

const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

const StepOrderComponent = ({ current = 0, items = [] }) => {
  const { Step } = Steps;
  return (
    <Steps
      current={current}
      progressDot={customDot}
    >
      {items.map((item) => {
        return (
          <Step key={item.title} title={item.title} description={item.description} />
        )
      })}
    </Steps>
  )
}

export default StepOrderComponent
