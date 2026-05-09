import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function GraficaSalud() {

  const data = [
    { dia: "Lun", animo: 4 },
    { dia: "Mar", animo: 3 },
    { dia: "Mie", animo: 5 },
    { dia: "Jue", animo: 4 },
    { dia: "Vie", animo: 2 }
  ];

  return (

    <LineChart width={400} height={250} data={data}>

      <CartesianGrid stroke="#ccc" />

      <XAxis dataKey="dia" />

      <YAxis />

      <Tooltip />

      <Line
        type="monotone"
        dataKey="animo"
        stroke="#3b82f6"
      />

    </LineChart>

  );
}

export default GraficaSalud;