import { useEffect } from "react";

type newContestType = {
  handleChange: (e: any) => void;
  game: string;
};

export const NewContest: (props: newContestType) => JSX.Element = ({
  handleChange,
  game,
}) => {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div>
        <p>juego</p>
        <input disabled type="text" name="game" value={game} />
      </div>
      <div>
        <p>sorteo</p>
        <input
          type="text"
          name="contest_number"
          onChange={(e) => handleChange(e)}
        />
      </div>
      <div>
        <p>precio</p>
        <input type="text" name="price" onChange={(e) => handleChange(e)} />
      </div>
      <div>
        <p>cartones ingresados</p>
        <input type="text" name="cards" onChange={(e) => handleChange(e)} />
      </div>
      <div>
        <p>cartones repartidos</p>
        <input
          type="text"
          name="dealt_cards"
          onChange={(e) => handleChange(e)}
        />
      </div>
      <div>
        <p>devolucion</p>
        <input
          type="text"
          name="returned_cards"
          onChange={(e) => handleChange(e)}
        />
      </div>
      <div>
        <p>fecha sorteo</p>
        <input
          type="date"
          name="contest_date"
          onChange={(e) => handleChange(e)}
        />
      </div>
    </div>
  );
};
