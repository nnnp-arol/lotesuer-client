import React, { useEffect, useState, useRef } from "react";
import { Sale, Seller } from "../../utils/interfaces";
import { Form } from "./Form";
import { useSnackbar } from "notistack";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

type saleFeaturesType = {
  selectedSeller: Seller | null;
  sale: Sale[] | null;
};

type SalesSellersListType = {
  sellers: Seller[] | undefined;
  sales: Sale[] | undefined;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
  date: string;
  saleFeatures: saleFeaturesType;
  setSaleFeatures: React.Dispatch<React.SetStateAction<saleFeaturesType>>;
};

// const useFocus:()=> [] = () => {
//   const htmlElRef:React.MutableRefObject<null> = useRef(null);
//   const setFocus:()=>void = () => {
//     htmlElRef.current && htmlElRef?.current?.focus();
//   };

//   return [htmlElRef, setFocus];
// };

export const SalesSellersList: React.FC<SalesSellersListType> = ({
  sellers,
  sales,
  setEditMode,
  editMode,
  date,
  saleFeatures,
  setSaleFeatures,
}) => {
  // const [component, addFocus] = useFocus();
  const { enqueueSnackbar } = useSnackbar();

  const ChangeUserAndFetch: (sellerItem: Seller) => void = (sellerItem) => {
    if (!!sales && sales.length) {
      return setSaleFeatures({
        selectedSeller: sellerItem,
        sale: sales?.filter((item) => {
          return item.seller._id === sellerItem?._id;
        }),
      });
    }
    return setSaleFeatures({ sale: null, selectedSeller: sellerItem });
  };

  useEffect(() => {
    if (sellers?.length) {
      ChangeUserAndFetch(sellers[0]);
    }
  }, []);

  const RenderStatus: (props: {
    id: string | undefined;
  }) => ReactJSXElement = ({ id }) => {
    const ownSale = sales?.find((item) => item.seller._id === id);
    if (ownSale) {
      if (ownSale.status < 0) {
        return (
          <p className="w-2 h-2 bg-red-500 rounded-full border border-red-600 m-auto "></p>
        );
      }
      return (
        <p className="w-2 h-2 bg-green-400 rounded-full border border-green-600 m-auto "></p>
      );
    }
    return (
      <p className="w-2 h-2 bg-slate-400 rounded-full border border-slate-600 m-auto "></p>
    );
  };

  return (
    <div className="flex-1 flex flex-row mt-5 pb-20">
      <div className="flex flex-col basis-1/2 bg-slate-500">
        <table className="border-collapse ">
          <thead className="bg-slate-900 text-slate-300 border-b border-slate-600 h-12">
            <tr>
              <th className="text-start w-1/6 pl-2">num</th>
              <th className="text-start w-1/2">nombre</th>
              <th className="text-start w-1/6">maquina</th>
              <th className="text-start w-1/6">estado</th>
            </tr>
          </thead>
          <tbody>
            {sellers &&
              sellers.map((item) => (
                <tr
                  className={`cursor-pointer border-slate-500
                    ${
                      saleFeatures.selectedSeller?._id === item?._id
                        ? "bg-slate-800"
                        : "bg-slate-500"
                    }`}
                  key={item?._id}
                  onClick={() => {
                    if (editMode) {
                      return enqueueSnackbar("You may exit edit mode first", {
                        variant: "error",
                      });
                    }
                    ChangeUserAndFetch(item);
                    // setSelectedSeller(item);
                    setEditMode(false);
                  }}
                  onDoubleClick={() => {
                    if (editMode) {
                      return enqueueSnackbar("You may exit edit mode first", {
                        variant: "error",
                      });
                    }
                    ChangeUserAndFetch(item);
                    // setSelectedSeller(item);
                    setEditMode(true);
                  }}
                >
                  <td className="flex justify-start pl-2">{item.id_seller}</td>
                  <td className="">
                    {item.last_name} {item.name}
                  </td>
                  <td className="flex justify-center">02</td>
                  <td className="">
                    <RenderStatus id={item._id} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="basis-3/4 flex flex-col ml-10 ">
        <Form
          date={date}
          editMode={editMode}
          setEditMode={setEditMode}
          saleFeatures={saleFeatures}
        />
      </div>
    </div>
  );
};

const styles = {
  liTextDisabled: "text-white",
  liTextEnabled: "text-black",
  liDisabled: "bg-slate-500 flex-1 flex-row flex w-full py-1 px-3",
  liEnabled: "bg-slate-300 flex-1 flex-row flex w-full py-1 px-3",
};
