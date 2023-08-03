
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Validation(values) {

    const addError = () => {
        toast.error('Your password must include uppercase letter, lowercase letter, special character and number !', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
                progress: undefined,
                theme: "light",
            });
      }
      const addErrorE = () => {
        toast.error('Please Enter a Valid E-mail !', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
      }

    let error = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /(?=.*\d)(?=.*[a-zığüşöçİĞÜŞÖÇ])(?=.*[A-ZİĞÜŞÖÇ])(?=.*[@$!%*?&.,\/-]).{6,}$/

    if (values.name === "") {
        error.name = "Name should not be empty!";
    } else {
        error.name = "";
    }

    if (values.surname === "") {
        error.surname = "Surname should not be empty!";
    } else {
        error.surname = "";
    }

    if (values.email === "") {
        error.email = "E-mail should not be empty!";
    } else if (!email_pattern.test(values.email)) {
        error.email = addErrorE();
    } else {
        error.email = "";
    }

    if (values.password === "") {
        error.password = "Password should not be empty!";
    } else if (!password_pattern.test(values.password)) {
        error.password = addError();
    } else {
        error.password = "";
    }
    
    return error;
}


export default Validation;


