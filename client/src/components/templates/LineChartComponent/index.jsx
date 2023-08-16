import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './index.scss';

const LineChartComponent = ({ data, dataKey1, dataKey2, dataKey3 }) => {

  // const getAutoYDomain = (data, marginRatio = 0.1)  => {
  //   const values = data.map(entry => entry.uv);
  //   const minValue = Math.min(...values);
  //   const maxValue = Math.max(...values);
  //   const margin = (maxValue - minValue) * marginRatio;
  //   return [minValue - margin, maxValue + margin];
  // }

  // const yDomain = getAutoYDomain(data);

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
        {/* <YAxis className="y-axis" mirror={true}/> */}
        <YAxis className="y-axis" mirror={true} domain='auto' />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend verticalAlign="bottom" />
        <Line type="monotone" dataKey={dataKey1} stroke="#a4c4e1" isAnimationActive={false} />
        {
          dataKey2 !== '' && (
            <Line type="monotone" dataKey={dataKey2} stroke="#f1d6df" isAnimationActive={false} />
          )
        }
        {
          dataKey3 !== '' && (
            <Line type="monotone" dataKey={dataKey3} stroke="#a4e1a9" isAnimationActive={false} dot={false}/>
          )
        }
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;