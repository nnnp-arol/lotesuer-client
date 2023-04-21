type newContestType = {
  handleChange: (e: any) => void;
  game: string;
};

export const NewContest: (props: newContestType) => JSX.Element = ({
  handleChange,
  game,
}) => {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex flex-row justify-between">
        <p className="text-slate-400 mr-6">juego</p>
        <input disabled type="text" name="juego" value={game} />
      </div>
      <div className="flex flex-row justify-between">
        <p className="text-slate-400 mr-6">sorteo</p>
        <input type="text" name="sorteo" onChange={(e) => handleChange(e)} />
      </div>
      <div className="flex flex-row justify-between">
        <p className="text-slate-400 mr-6">precio</p>
        <input type="text" name="precio" onChange={(e) => handleChange(e)} />
      </div>
      <div className="flex flex-row justify-between">
        <p className="text-slate-400 mr-6">cartones</p>
        <input type="text" name="cartones" onChange={(e) => handleChange(e)} />
      </div>

      <div className="flex flex-row justify-between">
        <p className="text-slate-400 mr-6">fecha sorteo</p>
        <input
          type="date"
          name="fecha_sorteo"
          onChange={(e) => handleChange(e)}
        />
      </div>
    </div>
  );
};
