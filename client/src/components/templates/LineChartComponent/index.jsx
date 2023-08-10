import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './index.scss';

const LineChartComponent = ({ data, dataKey }) => {
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
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke="#a4c4e1" isAnimationActive={false} />
        <Line type="monotone" dataKey="weight" stroke="#f1d6df" isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;