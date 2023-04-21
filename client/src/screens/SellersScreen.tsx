import React, { useEffect, useState } from "react";
import SellerList from "../components/SellerList";
import { Button } from "@mui/material";
import { Seller } from "../utils/interfaces";
import { trpc } from "../utils/trpc";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";

function SellersScreen({
  setSelectedRoute,
}: {
  setSelectedRoute: (val: string) => void;
}) {
  const [formType, setFormType] = useState("personal");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [searchBy, setSearchBy] = useState("");
  const [addMode, setAddMode] = useState(false);

  setSelectedRoute("sellers");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setFocus,
    reset,
  } = useForm();

  const { data: sellers } = trpc.seller.get.useQuery({
    searchBy: searchBy,
  });

  useEffect(() => {
    if (!!selectedSeller) {
      const {
        name,
        last_name,
        dni,
        id_seller,
        machine_number,
        phone,
        address,
        percent: {
          brinco,
          express,
          loto,
          loto5,
          machineRent,
          poceada,
          quini6,
          quiniela,
          super15,
          telebingo,
          telekino,
        },
      } = selectedSeller;

      setValue("name", name);
      setValue("last_name", last_name);
      setValue("dni", dni);
      setValue("id_seller", id_seller);
      setValue("machine_number", machine_number);
      setValue("phone", phone);
      setValue("address", address);

      setValue("brinco", brinco);
      setValue("express", express);
      setValue("loto", loto);
      setValue("loto5", loto5);
      setValue("machineRent", machineRent);
      setValue("poceada", poceada);
      setValue("quini6", quini6);
      setValue("quiniela", quiniela);
      setValue("super15", super15);
      setValue("telebingo", telebingo);
      setValue("telekino", telekino);
    }
  }, [selectedSeller]);

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  const PersonalForm = () => {
    return (
      <>
        <div className="flex flex-row flex-1">
          <div className="flex flex-col items-center flex-1 ">
            <CustomInput title="nombre" label="name" size="w-full" />
            <CustomInput title="apellido" label="last_name" size="w-full" />
            <CustomInput title="dni" label="dni" size="w-full" />
            <CustomInput title="telefono" label="phone" size="w-full" />
          </div>
          <div className="flex flex-col flex-1 items-center ">
            <CustomInput title="direccion" label="address" size="w-full" />
            <CustomInput title="numero" label="id_seller" size="w-full" />
            <CustomInput title="maquina" label="machine_number" size="w-full" />
          </div>
        </div>
      </>
    );
  };

  const CustomInput = ({
    title,
    label,
    required = true,
    size = "w-1/3",
  }: {
    title: string;
    label: string;
    required?: boolean;
    size?: string;
  }) => {
    return (
      <div className="flex flex-col items-start my-2">
        <p className="text-slate-400">{title}</p>
        <input
          type="text"
          className={`text-white rounded-md ${size} pl-2 mt-2 py-1 bg-slate-900`}
          {...register(label, { required })}
        />
      </div>
    );
  };
  const SalesForm = () => {
    return (
      <>
        <div className="flex flex-row h-5/6 ">
          <div className="flex flex-1 flex-col items-center px-5">
            <CustomInput title="quiniela" label="quiniela" size="w-full" />
            <CustomInput title="quini 6" label="quini6" size="w-full" />
            <CustomInput title="loto" label="loto" size="w-full" />
            <CustomInput title="loto 5" label="loto5" size="w-full" />
          </div>
          <div className="flex flex-1 flex-col items-center px-5">
            <CustomInput title="brinco" label="brinco" size="w-full" />
            <CustomInput title="poceada" label="poceada" size="w-full" />
            <CustomInput title="express" label="express" size="w-full" />
            <CustomInput title="telebingo" label="telebingo" size="w-full" />
          </div>
          <div className="flex flex-1 flex-col items-center px-5">
            <CustomInput title="telekino" label="telekino" size="w-full" />
            <CustomInput title="super 15" label="super15" size="w-full" />
            <CustomInput
              title="alquiler maquina"
              label="machineRent"
              size="w-full"
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="h-full flex pt-10 px-10">
      <SellerList
        sellers={sellers}
        selectedSeller={selectedSeller}
        setSelectedSeller={setSelectedSeller}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        addMode={addMode}
      />
      <form
        onSubmit={onSubmit}
        className="flex flex-1 bg-slate-700 flex-col rounded-xl py-4 ml-10 h-5/6"
      >
        <div className="flex w-full items-center pl-5 gap-2">
          <div className="flex flex-1 gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            <h1 className="text-2xl text-slate-400">vendedor</h1>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setAddMode(true);
                reset();
                setSelectedSeller(null);
                setTimeout(() => {
                  setFocus("name");
                }, 200);
              }}
            >
              <AddIcon color="primary" />
            </Button>
          </div>
        </div>
        <div className="flex w-full justify-center items-center mt-2 pb-1 gap-3 h-10">
          <h1 className="text-2xl text-slate-500">
            {!!selectedSeller ? ` ${selectedSeller.id_seller} ` : ""}
          </h1>
          <h1 className="text-2xl text-slate-900">
            {!!selectedSeller
              ? ` ${selectedSeller.last_name} ${selectedSeller.name}`
              : ""}
          </h1>
        </div>
        <div className="flex flex-1 flex-col gap-5 mt-2 ">
          <div className="w-full flex justify-between px-10">
            <div className="flex flex-1 flex-col justify-center items-center ">
              <Button fullWidth onClick={() => setFormType("personal")}>
                datos personales
              </Button>
              {formType === "personal" && (
                <div
                  className="w-2/3 h-1"
                  style={{ backgroundColor: "#1876D2" }}
                ></div>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-center items-center ">
              <Button fullWidth onClick={() => setFormType("sales")}>
                porcentajes
              </Button>
              {formType === "sales" && (
                <div
                  className="w-1/2 h-1"
                  style={{ backgroundColor: "#1876D2" }}
                ></div>
              )}
            </div>
          </div>
          <div className="flex flex-1 flex-col px-10 bg-slate-700 pb-5 rounded-xl">
            {formType === "personal" ? <PersonalForm /> : <SalesForm />}
            <div className="mt-8 px-20">
              <Button
                size="medium"
                variant="contained"
                fullWidth
                onClick={onSubmit}
              >
                guardar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SellersScreen;
