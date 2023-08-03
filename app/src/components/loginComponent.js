import { useState,useEffect } from 'react';
import "./style/login.css"
import Validation from "./loginValidation";
import 'bootstrap/dist/css/bootstrap.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LogIN() {  

  const notifyEmail = () => {
    toast.error('E-mail or Password is Wrong !', {
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

  const enteredDashboard = () => {
    toast.success('Log In Successfully!', {
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

  const [show1, setShow1] = useState(false);

  const[showPassword,setShowPassword] = useState(false)
  const handleShowPassword=()=>{
    setShowPassword(!showPassword);
  }

  const [values,setValues] = useState({
    email: '',
    password: ''
  })

  const[errors,setErrors] = useState({})
  axios.defaults.withCredentials=true;
  const handleInput = (event) =>{
    setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
  }

  useEffect(()=>{
    axios.get("http://localhost:8081")
    .then(res => {
      if(res.data.valid){
        navigate("/");
      }else{
        console.log(res.data);
        navigate("/login");
      }
    })
    .catch(err => console.log(err))
  },[])

  const navigate = useNavigate();
  const handleSubmit = (event) =>{
    event.preventDefault();
    const err = Validation(values);
    setErrors(err);
    if (
      err.email === "" &&
      err.password === ""
  ) {
      axios
        .post('http://localhost:8081/login', values)
        .then((res) => {
          console.log(res.data);
          if(res.data.Login){
            setTimeout(() => {
              enteredDashboard();
            }, 1000);
            navigate("/");

          }else{
            const kutu = document.querySelector(".loginScreen");
            kutu.classList.add("animate__animated", "animate__shakeX");
            notifyEmail();
            setTimeout(() => {
              kutu.classList.remove("animate__animated","animate__shakeX");
            }, 1000); 
          }
        })
      .catch((err) => console.log(err));
  }
  }

  return (
    <div className='app'>
    <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Signika+Negative:wght@500&display=swap');`}
    </style>
        <div className='ana d-flex justify-content-center align-items-center vh-100 animate__animated animate__flipInY'>
          <div className="loginScreen">
            <h1 className="loginTitle title"><strong>SIGN IN</strong></h1>
            <form action="" onSubmit={handleSubmit}>
              <div className="row usernameArea areas">
                <label htmlFor='email' className="userNameLabel col-4"><h3 className="userNameLabelText">E-mail: </h3></label>
                <input  autoComplete="off" className="userNameInput form-control col-8" onChange={handleInput} name='email' placeholder='Enter E-mail...'></input>
                {errors.email && <span className='text-danger'>{errors.email}</span>}
              </div>
              <div className="row passwordArea areas">
                <label htmlFor='password' className="passwordLabel col-4"><h3 className="passwordLabelText">Password: </h3></label>
                <input  autoComplete="off" type={showPassword?"text":"password"} className="passwordInput form-control col-8" onChange={handleInput} name='password' placeholder='Enter Password...'></input>
                <label onClick={handleShowPassword} className='showPasswordLogin'><i class="fa-regular fa-eye"></i></label>
                {errors.password && <span className='text-danger'>{errors.password}</span>}
              </div>
              <div className="row buttonArea areas">
                <button type='submit' className="btn signInButton">Sign In</button>
              </div>
            </form>
          </div>
        </div>
    <ToastContainer />    
    </div>
  );
};

export default LogIN;
