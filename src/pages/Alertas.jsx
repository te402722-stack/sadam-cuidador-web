function Alertas() {

  const alertas = [
    {
      adulto: "José García",
      mensaje: "No registró actividad hoy"
    },
    {
      adulto: "María López",
      mensaje: "Reportó dolor de cabeza"
    }
  ];

  return (

    <div>

      <h1 className="text-3xl font-bold mb-8">
        Alertas del sistema
      </h1>

      <div className="space-y-4">

        {alertas.map((a, i) => (

          <div
            key={i}
            className="bg-red-100 border border-red-400 p-6 rounded-xl"
          >

            <h2 className="font-semibold">
              {a.adulto}
            </h2>

            <p>{a.mensaje}</p>

          </div>

        ))}

      </div>

    </div>

  );
}

export default Alertas;