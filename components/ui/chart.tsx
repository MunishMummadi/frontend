"use client"

import type * as React from "react"
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
} from "recharts"

import { cn } from "@/lib/utils"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGrid?: boolean
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["blue", "green", "red", "yellow", "purple", "pink", "orange"],
  valueFormatter = (value: number) => `${value}`,
  yAxisWidth = 56,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showGrid = true,
  className,
  ...props
}: ChartProps) {
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            left: 0,
            bottom: 0,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          {showXAxis && <XAxis dataKey={index} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />}
          {showYAxis && (
            <YAxis
              width={yAxisWidth}
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={valueFormatter}
            />
          )}
          <Tooltip
            formatter={(value: number) => [valueFormatter(value), ""]}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "6px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          />
          {showLegend && <Legend verticalAlign="top" height={36} fontSize={12} iconType="circle" iconSize={8} />}
          {categories.map((category, i) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={`var(--${colors[i % colors.length]}-500)`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["blue", "green", "red", "yellow", "purple", "pink", "orange"],
  valueFormatter = (value: number) => `${value}`,
  yAxisWidth = 56,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showGrid = true,
  className,
  ...props
}: ChartProps) {
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            left: 0,
            bottom: 0,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          {showXAxis && <XAxis dataKey={index} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />}
          {showYAxis && (
            <YAxis
              width={yAxisWidth}
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={valueFormatter}
            />
          )}
          <Tooltip
            formatter={(value: number) => [valueFormatter(value), ""]}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "6px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          />
          {showLegend && <Legend verticalAlign="top" height={36} fontSize={12} iconType="circle" iconSize={8} />}
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={`var(--${colors[i % colors.length]}-500)`}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AreaChart({
  data,
  index,
  categories,
  colors = ["blue", "green", "red", "yellow", "purple", "pink", "orange"],
  valueFormatter = (value: number) => `${value}`,
  yAxisWidth = 56,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showGrid = true,
  className,
  ...props
}: ChartProps) {
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            left: 0,
            bottom: 0,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          {showXAxis && <XAxis dataKey={index} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />}
          {showYAxis && (
            <YAxis
              width={yAxisWidth}
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={valueFormatter}
            />
          )}
          <Tooltip
            formatter={(value: number) => [valueFormatter(value), ""]}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "6px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          />
          {showLegend && <Legend verticalAlign="top" height={36} fontSize={12} iconType="circle" iconSize={8} />}
          {categories.map((category, i) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              fill={`var(--${colors[i % colors.length]}-100)`}
              stroke={`var(--${colors[i % colors.length]}-500)`}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

