import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./style/addEmployee.css";
import Modal from 'react-bootstrap/Modal';
import "./style/employees.css";
import {Navigate, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Validation from './addEmployeeValidation';
import Option from './option';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmployeeProfile from './employeeProfile';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import logo from "../img/profile.png"
import logoW from "../img/profileW.png"

function Employees() {
  const [email,setEmail] = useState("");
  const [name,setName] = useState("");
  const [id,setId] = useState("");
  const [age,setAge] = useState("");
  const [gender,setGender] = useState("");
  const [company,setCompany] = useState("");
  const [avans,setAvans] = useState("");
  const [telefon,setPhone] = useState("");
  const [github,setGithub] = useState("");
  const [linkedIn,setLinkedIn] = useState("");
  const [hakkımda,setHakkımda] = useState("");
  const [isMale, setIsMale] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const[errors,setErrors] = useState({})
  const navigate = useNavigate();

  const [show3, setShow3] = useState(false);

  const handleClose3 = () => {
      setShow3(false);
    }
  const handleShow3 = () => setShow3(true);

  const [show2, setShow2] = useState(false);

  const handleClose2 = () => {
       updateTable();
      setShow2(false);
    }
const handleShow2 = (id, isim, yaş, firmaIsmi, avans,gender) => {
  axios.get(`http://localhost:8081/personeldetaylari/${id}`)
    .then((res) => {
      if(res.data ==="No data"){
        setPhone("No Data");
        setGithub("No Data");
        setLinkedIn("No Data");
        setHakkımda("No Data");
      }else{
        updateTable();
        setPhone(res.data[0].telefon);
        setGithub(res.data[0].github);
        setLinkedIn(res.data[0].linkedIn);
        setHakkımda(res.data[0].hakkımda);
        setEmployeeDetails(res.data);
      }
  })    
  .catch((err) => console.log(err));
  setId(id);
  setName(isim);
  setAge(yaş);
  setCompany(firmaIsmi);
  setAvans(avans);
  setGender(gender);
  setShow2(true);   
};




  const deleteSuccess = () => {
    toast.success('Employee deleted successfully !', {
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
    toast.success('Employee added successfully !', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastId: 'success2',
        });
  }

  const addError = () => {
    toast.error('Employee is already in table !', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastId: 'error1',
        });
  }

  axios.defaults.withCredentials=true;
  useEffect(()=>{
    axios.get("http://localhost:8081/employees")
    .then(res => {
      if(res.data.valid){
        if(res.data.rol==="admin"){
          setIsAdmin(true);
        }
        setEmail(res.data.email);
      }else{
        navigate("/login");
      }
    })
    .catch(err => console.log(err))
  },[])

  const[companyName,setCompanyNames] = useState([]);

  const [show1, setShow1] = useState(false);

  const handleClose1 = () => {
    const err = Validation(values);
    setErrors(err);
    err.avans ="";
    err.isim ="";
    err.yaş ="" ;
    err.firmaID ="";
    err.gender = "";
    setShow1(false);
  }
  const handleShow1 = () => setShow1(true);

  const [values, setValues] = useState({
    isim: '',
    yaş: '',
    firmaID: '',
    avans: '',
    gender: ''
  });
  
  
  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    if (name === "gender") {
      setGender(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const err = Validation(values);
    setErrors(err);
    setShow1(true);
    if (err.avans === "" && err.isim === "" && err.yaş === "" && err.firmaID === "" && err.gender === "" ) {
      axios.post('http://localhost:8081/personeller', values)
        .then((res) => {
          console.log(res.data);
          if(res.data ==="employeeError"){
            addError();
            setShow1(true); 
          }else{
            axios.get("http://localhost:8081/personeller")
            .then(res => {
              setEmployees(res.data);
              addSuccess();
            })
            .catch(err => console.log(err));
            setShow1(false); 
          }
        })
        .catch((err) => console.log(err));
    }
  };


  const updateTable = () => {
    Promise.all([
      axios.get("http://localhost:8081/personeller"),
      axios.get("http://localhost:8081/personeldetaylari")
    ])
      .then(([personellerRes, personelDetaylariRes]) => {
        setEmployees(personellerRes.data);
        setEmployeeDetails(personelDetaylariRes.data);
      })
      .catch(err => console.log(err));
  };

const deleteEmployee = (id) =>{
    axios.delete(`http://localhost:8081/personeldetaylari/${id}`)
        .catch((err) => console.log(err));
    axios.delete(`http://localhost:8081/personeller/${id}`)
        .then((res) => {
          updateTable(); 
        })
        .catch((err) => console.log(err));    
    deleteSuccess();    
}

  const [employees, setEmployees] = useState([]);

  const [employeeDetails, setEmployeeDetails] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/personeller")
      .then(res => {
        setEmployees(res.data);
      })
      .catch(err => console.log(err));


    axios.get("http://localhost:8081/firmalar")
      .then(res => {
        setCompanyNames(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8081/personeldetaylari/${id}`)
        .then((res) => {
          if(res.data ==="No data"){
            setPhone("No Data");
            setGithub("No Data");
            setLinkedIn("No Data");
            setHakkımda("No Data");
          }else{
            updateTable();
            setPhone(res.data[0].telefon);
            setGithub(res.data[0].github);
            setLinkedIn(res.data[0].linkedIn);
            setHakkımda(res.data[0].hakkımda);
            setEmployeeDetails(res.data);
          }

        })
        .catch((err) => console.log(err));
        updateTable(); 
    }
  }, [id]); 

  const [search,setSearch] = useState("");
  const [openSearch,setOpenSearch] = useState(false);

  const [animateOut, setAnimateOut] = useState(false);

  const searchFunction = () =>{
    if(openSearch===true){
      setOpenSearch(false);
      setAnimateOut(true);
    }else{
      setOpenSearch(true);
      setAnimateOut(false);
    }
  }

  const searchButtonStyle = {
    right: isAdmin ? '60px' : '12px',
  };


  const [data,setData] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:8081/upload')
      .then(res => {
        setData(res.data);
      })
      .catch(err => console.log(err));
  },[data]);



  return (
    <div className='app'>
        <main class="table">
          <section className='table_body' >

            {openSearch && (
            <Form className={`searchInputArea animate__animated ${
              animateOut ? "animate__flipOutX" : "animate__flipInX"
            }`}>
              <InputGroup>
                <Form.Control onChange={(e) => setSearch(e.target.value)} placeholder='Search Employee...'/>
              </InputGroup>
            </Form>
            )}
              <table>
                    <thead id='tableHeader'>
                      <tr>
                          <th className='animate__animated animate__bounceInDown'>#</th>
                          <th className='animate__animated animate__bounceInDown'>Photo</th>
                          <th className='animate__animated animate__bounceInDown'>Name</th>
                          <th className='animate__animated animate__bounceInDown'>Age</th>
                          <th className='animate__animated animate__bounceInDown'>Company</th>
                          <th className='animate__animated animate__bounceInDown'>Advance</th>
                          <th className='animate__animated animate__bounceInDown'>Options</th>
                      </tr>
                      {isAdmin && (
                        <Button variant="primary" className='addbtn' onClick={handleShow1} >
                          <i class="fa-solid fa-plus"></i>
                          </Button>
                      )}
                        <Button variant="warning" style={searchButtonStyle}  className='searchbtn' onClick={searchFunction} >
                          <i class="fa-solid fa-magnifying-glass"></i>
                          </Button>
                    </thead> 
                <tbody>
                  {employees.filter((employee) => {
                    return search.toLowerCase() === "" ? employee : employee.isim.toLowerCase().includes(search)
                  }).map((employee, index) => (
                    <tr key={index} >
                      <th className='animate__animated animate__fadeInTopLeft'>{index+1}</th>
                      <td>
                      {data.find((item) => item.id === employee.id)?.image === null ? (
                        employee.gender ==="MALE" ? (
                          <img className='profileImgListe  animate__animated animate__flipInY' src={logo} alt='Profile' />
                        ) : (
                          <img className='profileImgListe  animate__animated animate__flipInY' src={logoW} alt='Profile' />
                        )
                      ) : (
                          <img
                            className='realProfileListe  animate__animated animate__flipInY'
                            src={`http://localhost:8081/img/` + data.find((item) => item.id === employee.id)?.image}
                            style={{ width: "50px" }}
                          />
                      )}
                      </td>
                      <td>
                        <div>
                          <div className='nameArea animate__animated animate__fadeInTopRight'>
                            <h1 className='name'>
                              {employee.isim}
                            </h1>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className='ageArea animate__animated animate__fadeInTopRight'>
                            <h1 className='age'>
                              {employee.yaş}
                            </h1>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className='positionArea animate__animated animate__fadeInTopRight'>
                            <h1 className='position'>
                              {companyName.find(company => company.id === employee.firmaID)?.firmaIsmi}
                            </h1>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className='avansArea animate__animated animate__fadeInTopRight'>
                            <h1 className='avans'>
                              <strong>{employee.avans} TL</strong>
                            </h1>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='btn infoArea animate__animated animate__flipInX' onClick={() => handleShow2(employee.id, employee.isim, employee.yaş, companyName.find(company => company.id === employee.firmaID)?.firmaIsmi, employee.avans,employee.gender)}>
                          <i class="fa-solid fa-circle-info"></i>
                        </div>
                      {isAdmin===true &&
                      <div className='btn deleteArea animate__animated animate__flipInX' onClick={() => deleteEmployee(employee.id)}>
                      <i class="fa-solid fa-trash"></i>
                      </div>     
                      }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </section>
        </main>
        {show2 && (
          <EmployeeProfile
            id={id}
            show2={show2}
            handleClose2={handleClose2}
            isim={name.toUpperCase()}
            yaş={age}
            firmaIsmi={company}
            avans={avans}
            gender={gender}
            telefon={telefon}
            github={github}
            linkedIn={linkedIn}
            hakkımda={hakkımda}
          />
        )}
        <>
              <Modal className='modalAddEmployee' show={show1} onHide={handleClose1}>
                <Modal.Body>
                  <div className="addEmployeeScreen">
                    <div className='eTitle'>
                         <h1 className=" title"><strong>ADD EMPLOYEE</strong></h1>
                    </div>
                    <form action="" onSubmit={handleSubmit}>
                      <div className="row SignUpNameArea areas">
                        <label htmlFor='isim' className="SignUpNameLabel col-4"><h3 className="SignUpNameLabelText">Name: </h3></label>
                        <input  autoComplete="off" type='text' placeholder='Name...' name='isim' onChange={handleInput} className="SignUpNameInput form-control col-8"></input>
                        {errors.isim && <span className='text-danger text-center'>{errors.isim}</span>}
                      </div>
                      <div className="row SignUpSurnameArea areas">
                        <label htmlFor='yaş' className="SignUpSurnameLabel col-4"><h3 className="SignUpSurnameLabelText">Age: </h3></label>
                        <input  autoComplete="off" type='text' placeholder='Age...' name='yaş' onChange={handleInput} className="SignUpSurnameInput form-control col-8"></input>
                        {errors.yaş && <span className='text-danger text-center'>{errors.yaş}</span>}
                      </div>
                      <div className="row SignUpEmailArea areas">
                        <label htmlFor='firmaID' className="SignUpEmailLabel col-4"><h3 className="SignUpEmailLabelText">Company: </h3></label>
                        <select onclick="this.size=5;" onblur='this.size=1;' onchange='this.size=1; this.blur();' class="form-select SignUpEmailInput" aria-label="Default select example" name='firmaID' onChange={handleInput}>
                          <option value="" disabled selected hidden>Choose a Company...</option>
                          {companyName.map(company => (
                            <Option id={company.id} name={company.firmaIsmi}/>
                          ))}
                        </select>
                        {errors.firmaID && <span className='text-danger text-center'>{errors.firmaID}</span>}
                      </div>
                      <div className="row SignUpPasswordArea areas">
                        <label htmlFor='avans' className="SignUpPasswordLabel col-4"><h3 className="SignUpPasswordLabelText">Advance: </h3></label>
                        <input  autoComplete="off" placeholder='Avans...' name='avans' onChange={handleInput} type='text' className="SignUpPasswordInput form-control col-8"></input>
                        {errors.avans && <span className='text-danger text-center'>{errors.avans}</span>}
                      </div>
                      <div className="row SignUpGenderArea areas">
                      <label htmlFor='avans' className="SignUpGenderLabel col-4"><h3 className="SignUpGenderLabelText">Gender: </h3></label>
                      <div className='genderArea row col-8'>
                          <div class="form-check col-6">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="gender"
                            id="male"
                            value="male"
                            onChange={handleInput}
                            checked={gender === "male"}
                          />
                              <label class="form-check-label genderText" for="male">
                                Male
                              </label>
                            </div>
                          <div class="form-check col-6">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="gender"
                            id="female"
                            value="female"
                            onChange={handleInput}
                            checked={gender === "female"}
                          />
                              <label class="form-check-label genderText" for="female">
                                Female
                              </label>
                            </div>
                      </div>    
                        {errors.gender && <span className='text-danger text-center'>{errors.gender}</span>}
                      </div>
                      <div className="row buttonArea2 areas">
                        <button type='submit' className="btn signUpButton2" onClick={handleClose1}>ADD</button>
                      </div>
                    </form>
                  </div>
                </Modal.Body>
              </Modal>
        </>
      </div>
  );
}

export default Employees;
