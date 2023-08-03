import { useEffect, useState } from 'react';
import "./style/signup.css";
import Validation from "./signupValidation";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-bootstrap/Modal';

function SignUP({show,handleClose}){

  const [editedUsername, setEditedUsername] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [id, setId] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [edit,setEdit] = useState(false);

  const[usersOpen,setUsersOpen] = useState(false);
  const handeOpenUsers = () =>{
    if(usersOpen){
      setUsersOpen(false);
    }else{
      setUsersOpen(true);
    }
  }

  const deleteSuccess = () => {
    toast.success('User deleted successfully !', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastId: 'success1',
        });
  }

  const addSuccess = () => {
    toast.success('Account is Created successfully !', {
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

  const editSuccess = () => {
    toast.success('Account is Edited successfully !', {
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

  const addError = () => {
    toast.error('E-mail is already using !', {
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

  const editUser = (id) =>{
    if(!edit){
      axios.get(`http://localhost:8081/getLoginInfo/${id}`)
      .then((res) => {
        setEditedEmail(res.data[0].email);
        setEditedPassword(res.data[0].password);
        setEditedUsername(res.data[0].username);
        setId(res.data[0].id);
        setValues((prevValues) => ({
          ...prevValues,
          id: res.data[0].id,
        }));  
        axios.get('http://localhost:8081/getAllUsers')
          .then(res => {
                    setUsers(res.data);
                  })
        .catch(err => console.log(err));
      })
      .catch((err) => console.log(err));    
      setEdit(true);    
    }else{
      axios.get('http://localhost:8081/getAllUsers')
      .then(res => {
                setUsers(res.data);
              })
    .catch(err => console.log(err));
      setEdit(false);
    }
    axios.get('http://localhost:8081/getAllUsers')
            .then(res => {
              setUsers(res.data);
            })
    .catch(err => console.log(err));
}  

    const [values,setValues] = useState({
        username: '',
        email:'',
        password: '',
        id: ''
      })

    const [values1,setValues1] = useState({
        username: '',
        email:'',
        password: ''
      })  

      const[showPassword,setShowPassword] = useState(false)
      const handleShowPassword=()=>{
        setShowPassword(!showPassword);
      }
    
      const navigate = useNavigate();

      const[errors,setErrors] = useState({})
      const handleInput = (event) =>{
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
      }
      const handleInput1 = (event) =>{
        setValues1(prev => ({...prev, [event.target.name]: [event.target.value]}))
      }
      const handleSubmit = (event) => {
        event.preventDefault();
        const err = Validation(values1);
        setErrors(err);
        
        if (
          err.name === "" &&
          err.email === "" &&
          err.password === ""
        ) {
          axios
            .post('http://localhost:8081/myapp', values1)
            .then((res) => {
              if(res.data ==="emailError"){
                addError();
              }else{  
                setTimeout(() => {
                  addSuccess();
                  setValues1({
                    username: '',
                    email: '',
                    password: ''
                  });
                  axios.get('http://localhost:8081/getAllUsers')
                  .then(res => {
                    setUsers(res.data);
                  })
                  .catch(err => console.log(err));   
                }, 10);
              } 
            })
            .catch((err) => console.log(err));
        } 
      };
      
      const [users,setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/getAllUsers')
          .then(res => {
            setUsers(res.data);
          })
          .catch(err => console.log(err));
      },[]);

    const deleteUser = (id) =>{
        axios.delete(`http://localhost:8081/deleteUser/${id}`)
            .then((res) => {
            })
            .catch((err) => console.log(err));    
        axios.get('http://localhost:8081/getAllUsers')
            .then(res => {
              setUsers(res.data);
            })
            .catch(err => console.log(err));    
        deleteSuccess();    
    }  



    const handleUsernameChange = (event) => {
      setEditedUsername(event.target.value);
    };
    
    const handleEmailChange = (event) => {
      setEditedEmail(event.target.value);
    };
    
    const handlePasswordChange = (event) => {
      setEditedPassword(event.target.value);
    };
    
    const handleEmailChangeAndInput = (event) => {
      handleEmailChange(event);
      setValues((prevValues) => ({
        ...prevValues,
        email: event.target.value,
      }));
    };
    
    const handleUsernameChangeAndInput = (event) => {
      handleUsernameChange(event);
      setValues((prevValues) => ({
        ...prevValues,
        username: event.target.value,
      }));
    };
    
    const handlePasswordChangeAndInput = (event) => {
      handlePasswordChange(event);
      setValues((prevValues) => ({
        ...prevValues,
        password: event.target.value,
      }));
    };
    
    
    const handeleEdit = () => {
      axios
        .post("http://localhost:8081/updateLogin/", values)
        .then((res) => {
          editSuccess();
        })
        .catch((err) => console.log(err));
        axios.get('http://localhost:8081/getAllUsers')
        .then(res => {
                  setUsers(res.data);
                })
      .catch(err => console.log(err));
        setEdit(false);
    };

    useEffect(() => {
      if (edit) {
        setValues((prevValues) => ({
          ...prevValues,
          username: editedUsername,
          email: editedEmail,
          password: editedPassword,
          id: id,
        }));
      } else {
        setValues({
          username: '',
          email: '',
          password: '',
          id: '',
        });
      }
    }, [edit, editedUsername, editedEmail, editedPassword, id]);

    return (
      <>
      <Modal className='modalProfile' show={show} onHide={handleClose} id="signupModalContentScreen" >
        <Modal.Body id='signupModalScreen'>
            <div className="signUpScreen1">
            <div className='ustTaraf'>
                <h1 className="signUpTitle title"><strong>ADD USER</strong></h1>
                <form action="" onSubmit={handleSubmit}>
                <div className="row SignUpNameArea areas">
                  <label htmlFor='username' className="SignUpNameLabel col-4"><h3 className="SignUpNameLabelText">Username: </h3></label>
                  {edit === false && (
                      <>
                        <input autoComplete="off" type='text' placeholder='Username...' name='username' value={values1.username} onChange={handleInput1} className="SignUpNameInput form-control col-8 animate__animated animate__fadeInLeft"/>
                        {errors.name && <span className='text-danger'>{errors.name}</span>}
                      </>
                    )}
                  {edit === true && (
                      <>
                        <input autoComplete="off" type='text' placeholder='Username...' name='username' onChange={edit === true ? handleUsernameChangeAndInput : handleInput} value={edit === true ? editedUsername : values.username} className="SignUpNameInput form-control col-8 animate__animated animate__fadeInLeft"/>
                        {errors.name && <span className='text-danger'>{errors.name}</span>}
                      </>
                    )}
                </div>
                <div className="row SignUpEmailArea areas">
                  <label htmlFor='email' className="SignUpEmailLabel col-4"><h3 className="SignUpEmailLabelText">E-mail: </h3></label>
                  {edit === false && (
                      <>
                        <input autoComplete="off" value={values1.email} type='e-mail' placeholder='E-mail...' name='email' onChange={handleInput1} className="SignUpEmailInput form-control col-8 animate__animated animate__fadeInLeft"/>
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                      </>
                    )}
                    {edit === true && (
                      <>
                        <input autoComplete="off" type='e-mail' placeholder='E-mail...' name='email'  onChange={edit === true ? handleEmailChangeAndInput : handleInput} value={edit === true ? editedEmail : values.email} className="SignUpEmailInput form-control col-8 animate__animated animate__fadeInLeft"/>
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                      </>
                    )}
                </div>
                <div className="row SignUpPasswordArea areas">
                  <label htmlFor='password' className="SignUpPasswordLabel col-4"><h3 className="SignUpPasswordLabelText">Password: </h3></label>
                  {edit === false && (
                      <>
                        <input autoComplete="off" placeholder='Password...' value={values1.password} name='password' onChange={handleInput1} type={showPassword?"text":"password"} className="SignUpPasswordInput form-control col-8 animate__animated animate__fadeInLeft"/>
                        <label onClick={handleShowPassword} className='showPassword'><i class="fa-regular fa-eye"></i></label>
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                      </>
                    )}
                    {edit === true && (
                      <>
                        <input autoComplete="off" placeholder='Password...' name='password' onChange={edit === true ? handlePasswordChangeAndInput : handleInput} type={showPassword?"text":"password"} className="SignUpPasswordInput form-control col-8 animate__animated animate__fadeInLeft"  value={edit === true ? editedPassword : values.password}/>
                        <label onClick={handleShowPassword} className='showPassword'><i class="fa-regular fa-eye"></i></label>
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                      </>
                    )}
                </div>
                {edit === false &&
                  <div className="row buttonArea2 areas animate__animated animate__zoomIn">
                  <button type='submit' className="btn signUpButton2">ADD</button>
                </div>
                }
                {edit === true &&
                  <div className="row buttonArea2 areas animate__animated animate__zoomIn">
                  <button onClick={handeleEdit} className="btn saveButton2">SAVE</button>
                </div>
                }
                </form>
            </div>
            <div className='altTaraf'>
              <div className='userListArea'>
                <button className='btn btn-warning listeTusu animate__animated animate__zoomIn' onClick={handeOpenUsers}>
                  <i class="fa-solid fa-bars" ></i>
                </button>
                {usersOpen && 
                <h4 id='userlistTitle' className='animate__animated animate__zoomIn'>User List</h4>
                }
                {usersOpen &&
                  <ul class="list-group usersList animate__animated animate__fadeInLeft">
                    {users.map((user, index) => (
                      <li key={index} class="list-group-item">
                        <span className='userEmail'>E-mail : {user.email}</span>
                        <span className='userPassword'>Password : {user.password}</span>
                        <button onClick={() => editUser(user.id)}>
                          <i class="fa-solid fa-user-pen"></i>
                        </button>
                        <button onClick={() => deleteUser(user.id)}>
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </li>
                  ))}
                  </ul>
                }

              </div>
            </div>    
            </div>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>  
   

    )
}

export default SignUP;