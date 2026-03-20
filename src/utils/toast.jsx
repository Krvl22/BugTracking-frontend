import { toast } from "react-toastify";
import ToastCard from "./ToastCard";

export const successToast = (msg) =>
  toast(
    <ToastCard
      title="Success"
      message={msg}
      color="#14b8a6"
      gradient="rgba(20,184,166,0.15), rgba(30,41,59,0.8)"
    />,
    { icon: false }
  );

export const errorToast = (msg) =>
  toast(
    <ToastCard
      title="Error"
      message={msg}
      color="#ef4444"
      gradient="rgba(239,68,68,0.15), rgba(30,41,59,0.8)"
    />,
    { icon: false }
  );