import axios from "axios";

export const createSale = async (nuevaVenta) => {
  await axios.post("http://localhost:4100/venta", nuevaVenta);
};

export const getSales = async () => {
  const response = await axios.get("http://localhost:4100/ventas");
  if (response) {
    return response.data;
  }
  return false;
};

//#region [1]
export const getSalesByDateAndSeller = async (obj) => {
  const response = await axios.get(
    `http://localhost:4100/venta-fecha-vendedor/${obj.fecha}/${obj.vendedor}`
  );
  if (response) {
    return response.data;
  }
  return false;
};
//#endregion

export const updateSale = async (id, sale) => {
  const response = await axios.put(`http://localhost:4100/venta/${id}`, sale);
  if (response) {
    return response.data;
  }
  return false;
};
