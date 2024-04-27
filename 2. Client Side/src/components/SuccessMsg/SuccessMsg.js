import Swal from "sweetalert2";
import { resetSuccessAction } from "../../redux/slices/global/globalActions";
import { useDispatch } from "react-redux";

export const sweetSuccess = (message) => {
  Swal.fire({
    icon: "success",
    title: "Good job!",
    text: message,
  });
}

const SuccessMsg = ({ message }) => {
  const dispatch = useDispatch();
  sweetSuccess(message);
  dispatch(resetSuccessAction());
};

export default SuccessMsg;
