function Card({ titulo, valor, icono }) {

  return (
    <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">

      <div className="text-3xl">
        {icono}
      </div>

      <div>
        <p className="text-gray-500">{titulo}</p>
        <h2 className="text-xl font-bold">{valor}</h2>
      </div>

    </div>
  );
}

export default Card;