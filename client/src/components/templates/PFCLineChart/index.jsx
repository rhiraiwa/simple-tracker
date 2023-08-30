import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './index.scss';

const PFCLineChart = ({ data }) => {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis className="y-axis" yAxisId="left" mirror={true} domain='auto' />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={CustomTooltip} active={data !== null} payload={data} />
        <Legend verticalAlign="bottom" />
        <Line yAxisId="left" type="monotone" dataKey='calorie' stroke="#a4c4e1" isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label-date">{`${payload[0].payload.date}`}</p>
        <p className="label-calorie">{`${payload[0].name} : ${payload[0].value}`}</p>
        <p className="label-pfc">{`protein : ${payload[0].payload.protein}`}</p>
        <p className="label-pfc">{`fat : ${payload[0].payload.fat}`}</p>
        <p className="label-pfc">{`carbohydrate : ${payload[0].payload.carbohydrate}`}</p>
      </div>
    );
  }

  return null;
};

export default PFCLineChart;