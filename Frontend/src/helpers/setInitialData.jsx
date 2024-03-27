import toast from "react-hot-toast";
import { initialData } from "../data/initialData";


export const setInitialData = (setProducts) => {
  try {
    localStorage.setItem("products", JSON.stringify(initialData)); 
    setProducts(initialData); 
  } catch (error) {
    toast.error("Error al obtener los datos iniciales.");
    console.log(error);
  }
};
