import { createContext, useContext, useState, useEffect } from "react";
// Importamos las funciones de axios (get, post, put, delete)
import {
  obtenerUsuarios,
  eliminarUsuario,
  obtenerUsuario,
  actualizarUsuario,
  crearUsuario,
} from "../api/apiUsuarios.js";

const UsuariosContext = createContext();

export const useUsuarios = () => {
  const context = useContext(UsuariosContext);

  if (!context) {
    throw new Error("useUsuarios debe usarse dentro de un UsuariosProvider");
  }

  return context;
};

export function UsuariosProvider({ children }) {
  const [usuarios, setUsuarios] = useState([]); // Obtenemos todos los usuarios de la base de datos
  const [records, setRecords] = useState([]); // Obtenemos todos los registros para buscar en la tabla
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const getUsuarios = async () => {
    try {
      const res = await obtenerUsuarios();
      setLoading(false);
      setUsuarios(res.data);
      setRecords(res.data);
    } catch (error) {
      setLoading(true);
      console.error(error);
    }
  };

  const postUsuario = async (body) => {
    try {
      const res = await crearUsuario(body);
      console.log(res.data);
    } catch (error) {
      setErr(error.response.data.message);
      console.log(err);
    }
  };

  const getUsuario = async (id) => {
    try {
      const res = await obtenerUsuario(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };
  const putUsuario = async (id, data) => {
    try {
      const res = await actualizarUsuario(id, data);
      console.log(res.data); // Obtenemos el usuario actualizado
    } catch (error) {
      console.error(error);
      setErr(error.response.data.message);
    }
  };

  const deleteUsuario = async (id) => {
    try {
      const res = await eliminarUsuario(id);
      if (res.status === 204)
        setUsuarios(usuarios.filter((usuarios) => usuarios._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <UsuariosContext.Provider
      value={{
        // Datos
        usuarios,
        records,
        loading,
        err,

        // Funciones
        setRecords,
        getUsuario,
        putUsuario,
        getUsuarios,
        postUsuario,
        deleteUsuario,
        setErr,
      }}
    >
      {children}
    </UsuariosContext.Provider>
  );
}
