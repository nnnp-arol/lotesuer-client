import axios from "axios";

export const createSeller = async (nuevoVendedor) => {
  await axios.post("http://localhost:4100/vendedor", nuevoVendedor);
};

export const getSellers = async () => {
  const response = await axios.get("http://localhost:4100/vendedores");
  if (response) {
    return response.data;
  }
  return false;
};
