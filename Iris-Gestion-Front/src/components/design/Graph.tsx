import { ResponsiveContainer, BarChart , Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Jan', commandes: 10 },
  { name: 'Fév', commandes: 20 },
  { name: 'Mar', commandes: 30 },
  { name: 'Avr', commandes: 15 },
  { name: 'Mai', commandes: 55 },
  { name: 'Jui', commandes: 47 },
  { name: 'Juil', commandes: 20 },
  { name: 'Aou', commandes: 15 },
  { name: 'Sep', commandes: 10 },
  { name: 'Oct', commandes: 2 },
  { name: 'Nov', commandes: 74 },
  { name: 'Dec', commandes: 142 },
];

const Graph = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart  data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="commandes" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Graph;