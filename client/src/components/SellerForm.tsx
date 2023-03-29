import React, { ChangeEvent, FormEvent, useState } from "react";
import { trpc } from "../utils/trpc";

function SellerForm() {
  const [seller, setSeller] = useState({
    id_seller: "",
    name: "",
    last_name: "",
    dni: "",
    phone: "",
  });
  const addSeller = trpc.seller.create.useMutation();
  const utils = trpc.useContext();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addSeller.mutate(seller, {
      onSuccess: () => {
        console.log("seller added successfully!");
        utils.seller.get.invalidate();
      },
    });
  };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSeller({ ...seller, [e.target.name]: e.target.value });
  };
  return (
    <div className="flex w-1/4 h-screen items-start justify-center mx-10">
      <div className="fixed">
        <h1 className="text-2xl font-bold text-center py-5">nuevo vendedor</h1>
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-10 rounded-md">
          <input
            type="text"
            placeholder="id_seller"
            name="id_seller"
            autoFocus
            onChange={handleChange}
            className="bg-neutral-800 px-3 py-2 w-full block rounded-md mb-3"
          />

          <input
            type="text"
            placeholder="name"
            name="name"
            onChange={handleChange}
            className="bg-neutral-800 px-3 py-2 w-full block rounded-md mb-3"
          />
          <input
            type="text"
            placeholder="last_name"
            name="last_name"
            onChange={handleChange}
            className="bg-neutral-800 px-3 py-2 w-full block rounded-md mb-3"
          />
          <input
            type="text"
            placeholder="dni"
            name="dni"
            onChange={handleChange}
            className="bg-neutral-800 px-3 py-2 w-full block rounded-md mb-3"
          />
          <input
            type="text"
            placeholder="phone"
            name="phone"
            onChange={handleChange}
            className="bg-neutral-800 px-3 py-2 w-full block rounded-md mb-3"
          />
          <button className="bg-zinc-500 px-3 py-2 rounded-md"> save</button>
        </form>
      </div>
    </div>
  );
}

export default SellerForm;
