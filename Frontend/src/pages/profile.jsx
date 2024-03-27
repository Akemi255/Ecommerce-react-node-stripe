import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";

import "../styles/scss/profile/profile.scss";

const Profile = () => {
  const { clearToken, token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/profile`,
          {
            method: "GET",
            headers: {
              Authorization: token,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setUserData(data.user.userId);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      fetchProfileData();
    }

    if (!token) {
      window.location.href = "/log-in";
    }

    return () => {
      setUserData(null);
    };
  }, [token]);

  const handleLogout = () => {
    clearToken();
    window.location.href = "/log-in";
  };

  const handleDeleteAccount = async () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDeleteAccount = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/users/deleteAccount",
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete account");
      }
      toast.success("Cuenta eliminada exitosamente");
      clearToken();
    } catch (error) {
      console.error("Error deleting account:", error.message);
      toast.error("Ha ocurrido un error eliminando la cuenta");
    } finally {
      setOpenDialog(false);
    }
  };

  return (
    <>
      <br />
      <div className="profile-container">
        {userData && (
          <div className="profile">
            <h2>Perfil de Usuario</h2>
            <p>
              <strong>Nombre:</strong> {userData.name}
            </p>
            <p>
              <strong>Correo Electrónico:</strong> {userData.email}
            </p>
            <div>
              <Button onClick={handleLogout}>
                <LogoutIcon /> Cerrar sesión
              </Button>
              <Button onClick={handleDeleteAccount}>
                <DeleteIcon /> Eliminar Cuenta
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>¿Estás seguro de eliminar tu cuenta?</DialogTitle>
        <DialogContent>
          <Typography>
            Esta acción no se puede deshacer y eliminará permanentemente tu
            cuenta.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDeleteAccount} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
