import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './index.scss';

const LineChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}
      //   margin={{
      //     top: 20,
      //     right: 20,
      //     bottom: 20,
      //     left: 20,
      // }}
      >
        <XAxis dataKey="date" />
        <YAxis className="y-axis" mirror={true}/>
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        {/* <Legend /> */}
        <Line type="monotone" dataKey="weight" stroke="#a4c4e1" isAnimationActive={false} />
        {/* <Line type="monotone" dataKey="result" stroke="#d88488" isAnimationActive={false} /> */}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;