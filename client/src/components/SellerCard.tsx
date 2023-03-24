import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Percent, Props, Seller } from "../utils/interfaces";
import { trpc } from "../utils/trpc";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import RecentActorsOutlinedIcon from "@mui/icons-material/RecentActorsOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

function SellerCard({ seller }: Props) {
  const [isCollapse, setIsCollapse] = useState(false);
  const utils = trpc.useContext();
  const deleteSeller = trpc.seller.delete.useMutation();
  const updatePercent = trpc.seller.updateSellerPercent.useMutation();
  const [percentForm, setPercentForm] = useState<Percent>({
    quiniela: "",
    quini6: "",
    loto: "",
    brinco: "",
    express: "",
    poceada: "",
    telekino: "",
    telebingo: "",
    super15: "",
    otro: "",
  });

  useEffect(() => {
    if (seller) {
      setPercentForm(seller.percent);
    }
  }, [seller]);

  const handlerChange = (e: any) => {
    setPercentForm({
      ...percentForm,
      [e.target.name]: e.currentTarget.value,
    });
  };

  return (
    <div className="mb-4 rounded-xl">
      <div className="bg-zinc-800 p-3 flex justify-between">
        <div className="mx-5 flex items-center justify-center">
          <button
            className="bg-gray-600 w-20 h-20 rounded-full"
            onClick={() => setIsCollapse(!isCollapse)}
          ></button>
        </div>
        <div className="flex-1">
          <div className="flex-row flex gap-3">
            <PersonOutlineIcon color="error" className="scale-90" />
            <h1 className="font-bold text-xl text-neutral-400">
              {seller.id_seller} - {seller.name} {seller.last_name}
            </h1>
          </div>
          <div className="flex-row flex gap-3">
            <BadgeOutlinedIcon color="error" className="scale-90" />
            <p>{seller.dni}</p>
          </div>
          <div className="flex-row flex gap-3">
            <CallOutlinedIcon color="error" className="scale-90" />
            <p>{seller.phone}</p>
          </div>
        </div>
        <div className="flex gap-x-2">
          <button
            className="bg-red-500 px-3 py-2 rounded-md text-white ml-auto"
            onClick={() => {
              deleteSeller.mutate(seller._id, {
                onSuccess: () => {
                  utils.seller.get.invalidate();
                },
                onError: (error) => {
                  console.log(error);
                },
              });
            }}
          >
            Delete
          </button>
        </div>
      </div>
      {isCollapse ? (
        <div className="w-full h-1/2 bg-zinc-800 flex-row flex justify-center px-8 py-5">
          <div className="flex flex-1 bg-gray-500"></div>
          <div className={styles.gameContainer}>
            <div className={styles.gameInputContainer}>
              <p className={styles.gameLabel}>quiniela</p>
              <input
                type="text"
                className={styles.gameInput}
                name="quiniela"
                onChange={(e) => handlerChange(e)}
                value={percentForm.quiniela}
              />
            </div>
            <div className={styles.gameInputContainer}>
              <p className={styles.gameLabel}>quini6</p>
              <input
                type="text"
                className={styles.gameInput}
                name="quini6"
                onChange={(e) => handlerChange(e)}
                value={percentForm.quini6}
              />
            </div>
            <div className={styles.gameInputContainer}>
              <p className={styles.gameLabel}>loto</p>
              <input
                type="text"
                className={styles.gameInput}
                name="loto"
                onChange={(e) => handlerChange(e)}
                value={percentForm.loto}
              />
            </div>
            <div className={styles.gameInputContainer}>
              <p className={styles.gameLabel}>brinco</p>
              <input
                type="text"
                className={styles.gameInput}
                name="brinco"
                onChange={(e) => handlerChange(e)}
                value={percentForm.brinco}
              />
            </div>
            <div className={styles.gameInputContainer}>
              <p className={styles.gameLabel}>express</p>
              <input
                type="text"
                className={styles.gameInput}
                name="express"
                onChange={(e) => handlerChange(e)}
                value={percentForm.express}
              />
            </div>
            <div className={styles.gameInputContainer}>
              <p className={styles.gameLabel}>poceada</p>
              <input
                type="text"
                className={styles.gameInput}
                name="poceada"
                onChange={(e) => handlerChange(e)}
                value={percentForm.poceada}
              />
            </div>
          </div>
          <div className={styles.gameContainer}>
            <div className={styles.gameInputContainer}>
              <p className={styles.gameLabel}>telekino</p>
              <input
                type="text"
                className={styles.gameInput}
                name="telekino"
                onChange={(e) => handlerChange(e)}
                value={percentForm.telekino}
              />
            </div>
            <div className={styles.gameInputContainer}>
              <p className={styles.gameLabel}>telebingo</p>
              <input
                type="text"
                className={styles.gameInput}
                name="telebingo"
                onChange={(e) => handlerChange(e)}
                value={percentForm.telebingo}
              />
            </div>
            <div className={styles.gameInputContainer}>
              <p className={styles.gameLabel}>super15</p>
              <input
                type="text"
                className={styles.gameInput}
                name="super15"
                onChange={(e) => handlerChange(e)}
                value={percentForm.super15}
              />
            </div>
            <div className={styles.gameInputContainer}>
              <p className={styles.gameLabel}>otro</p>
              <input
                type="text"
                className={styles.gameInput}
                name="otro"
                onChange={(e) => handlerChange(e)}
                value={percentForm.otro}
              />
            </div>
            <div className="w-full h-full flex justify-end items-start">
              <button
                className="bg-green-600 px-3 py-2 rounded-md"
                onClick={() => {
                  updatePercent.mutate(
                    { percent: percentForm, id: seller._id },
                    {
                      onSuccess: () => {
                        // utils.seller.get.invalidate();
                        console.log("great");
                      },
                      onError: (error) => {
                        console.log(error);
                      },
                    }
                  );
                }}
              >
                save
              </button>
            </div>
          </div>
          <div className="flex flex-1 bg-gray-500"></div>
        </div>
      ) : null}
    </div>
  );
}

export default SellerCard;

const styles = {
  gameContainer: " bg-gray-500 p-5 flex-col flex",
  gameInputContainer: "flex-row flex py-2 items-center",
  gameInput: "bg-neutral-800 px-3 py-2 w-full block rounded-md mb-3",
  gameLabel: "w-1/2",
};
