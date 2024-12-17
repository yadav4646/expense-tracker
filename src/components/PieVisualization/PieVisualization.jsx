import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./PieVisualization.css";

const transformDataForPie = (data) => {
  const categoryTotals = {};

  data.forEach((item) => {
    if (categoryTotals[item.category]) {
      categoryTotals[item.category] += parseInt(item.amount, 10);
    } else {
      categoryTotals[item.category] = parseInt(item.amount, 10);
    }
  });

  return Object.keys(categoryTotals).map((category, index) => ({
    id: index,
    name: category,
    value: categoryTotals[category],
  }));
};

const PieVisualizationComponent = ({ data }) => {
  const transformedData = transformDataForPie(data);
  const COLOR_PALETTE = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  return (
    <PieChart className="pie-chart-container" width={400} height={400}>
      <Pie
        data={transformedData}
        cx="50%"
        cy="50%"
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
        isAnimationActive={true}
      >
        {transformedData.map((entry) => (
          <Cell
            key={`cell-${entry.id}`}
            fill={COLOR_PALETTE[entry.id % COLOR_PALETTE.length]}
          />
        ))}
      </Pie>
      <Tooltip />
      <Legend className="pie-chart-legend" />
    </PieChart>
  );
};

export default PieVisualizationComponent;
