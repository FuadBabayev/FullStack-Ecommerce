import Swal from "sweetalert2";
import { resetErrorAction } from "../../redux/slices/global/globalActions";
import { useDispatch } from "react-redux";

export const sweetError = (message) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
  });
}

const ErrorMsg = ({ message }) => {
  const dispatch = useDispatch();
  sweetError(message);
  dispatch(resetErrorAction());
};

export default ErrorMsg;
