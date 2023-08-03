import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./style/addEmployee.css";
import Modal from 'react-bootstrap/Modal';
import "./style/employees.css";
import {Navigate, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Option from './option';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import logo from "../img/profile.png"
import logoW from "../img/profileW.png"


function EmployeeLeaves() {
  const [izinler,setIzinler] = useState([]);
  const [names, setNames] = useState("");
  const [employeeNameLists,setEmployeeNames] = useState([]);
  const [show1, setShow1] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const handleShow1 = () => setShow1(true);
  const handleClose1 = () => setShow1(false);
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [search,setSearch] = useState("");
  const [openSearch,setOpenSearch] = useState(false);
  const [photoList,setPhotoList] = useState([]);

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

  const fetchEmployeePhoto = (id) => {
    axios.get(`http://localhost:8081/upload/${id}`)
      .then(res => {
        const imagePath = res.data[0]?.image || "";
        const gender = res.data[0]?.gender || "UNKNOWN";
        setPhotoList(prevPhotoList => [...prevPhotoList, { id,gender, imagePath }]);
        
      })
      .catch(err => console.log(err));
  };

  const searchButtonStyle = {
    right: isAdmin ? '60px' : '12px',
  };

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

  
  const deleteSuccess = () => {
    toast.success('Employee Leaves is deleted successfully !', {
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

  const invalidError = () => {
    toast.error('Please Enter All Values !', {
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

  const dateError = () => {
    toast.error('Start date can not be bigger than end date !', {
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
    toast.success('Employee Leaves is added successfully !', {
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

  const addError = () => {
    toast.error('Employee Leaves is already in table !', {
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


  useEffect(() => {
    axios.get("http://localhost:8081/leaves")
      .then(res => {
        res.data.forEach(izin => {
          fetchEmployeePhoto(izin.userID);
        });
        setIzinler(res.data);
        const fetchNames = res.data.map(izin => axios.get(`http://localhost:8081/getLeaveName/${izin.userID}`));
        Promise.all(fetchNames)
          .then(responses => {
            const employeeNames = responses.map(response => response.data[0]?.isim || "N/A");
            setNames(employeeNames);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
     
    axios.get("http://localhost:8081/personeller")
      .then(res => {
        setEmployeeNames(res.data);
      })
      .catch(err => console.log(err));  
  }, []);

  const getName = (id) =>{
    axios.get(`http://localhost:8081/getLeaveName/${id}`)
    .then(res => {
      setNames(res.data[0].isim);
      return res.data[0].isim;
    })
    .catch(err => console.log(err));
  }

  const getPhoto = (id) =>{
    axios.get(`http://localhost:8081/upload/${id}`)
    .then(res => {
    })
    .catch(err => console.log(err));
  }

  const calculateRemainingTime = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - now.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    const remainingHours = Math.floor((differenceInTime % (1000 * 3600 * 24)) / (1000 * 3600));
    const remainingMinutes = Math.floor((differenceInTime % (1000 * 3600)) / (1000 * 60));
  
    return { days: differenceInDays, hours: remainingHours, minutes: remainingMinutes };
  };
  

  function convertTimestamp(timestamp) {
    const date = new Date(timestamp);
    date.setHours(date.getHours());   
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
  

  const [values, setValues] = useState({
    baslangic: '',
    bitis: '',
    userID: ''
  });
  
  const handleInput = (event) => {
    const { name, value } = event.target;
  
    if (name === 'employee') {
      setValues((prev) => ({ ...prev, userID: value }));
    } else if (name === 'bitis') {
      const startDate = new Date(values.baslangic).getTime();
      const endDate = new Date(value).getTime();
      if (endDate < startDate) {
        dateError();
      } else {
        setValues((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };
  

  const updateTable = () => {
    axios.get("http://localhost:8081/leaves")
      .then(res => {
        setIzinler(res.data);
        const fetchNames = res.data.map(izin => axios.get(`http://localhost:8081/getLeaveName/${izin.userID}`));
        Promise.all(fetchNames)
          .then(responses => {
            const employeeNames = responses.map(response => response.data[0]?.isim || "N/A");
            setNames(employeeNames);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!values.baslangic || !values.bitis || !values.userID) {
      invalidError();
      setShow1(true);
      return;
    }

    axios.post("http://localhost:8081/sendLeaves", values)
      .then(res => {
        if (res.data.error === "leaves error") {
          addError(); 
          handleShow1();
        } else {
          addSuccess();
          axios.get('http://localhost:8081/upload')
          .then(res => {
          })
    .catch(err => console.log(err));
          updateTable();
          handleClose1();
        }
      })
      .catch(err => console.log(err));

  };
  

  const deleteEmployee = (userID) =>{
    axios.delete(`http://localhost:8081/leaves/${userID}`)
        .catch((err) => console.log(err));  
    updateTable();    
    deleteSuccess();    
}

  return (
    <div>
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
                    <th className='animate__animated animate__bounceInDown'>Start</th>
                    <th className='animate__animated animate__bounceInDown'>End</th>
                    <th className='animate__animated animate__bounceInDown'>Remaining Day</th>
                    <th className='animate__animated animate__bounceInDown'>Options</th>
                </tr>
                {isAdmin && (
                  <Button variant="primary" className='addbtn' onClick={handleShow1} >
                    <i class="fa-solid fa-plus"></i>
                    </Button>
                )}
              </thead> 
          <tbody>
            {izinler.map((izin, index) => (
              <tr key={index} >
                <th className='animate__animated animate__fadeInTopLeft'>{index+1}</th>
                <td>
      {photoList.find((item) => item.id === izin.userID)?.imagePath === "" ? (
        photoList.find((item) => item.id === izin.userID)?.gender === "MALE" ? (
          <img className='profileImgListe  animate__animated animate__flipInY' src={logo} alt='Profile' />
        ) : (
          <img className='profileImgListe  animate__animated animate__flipInY' src={logoW} alt='Profile' />
        )
      ) : (
        <img
          className='realProfileListe  animate__animated animate__flipInY'
          src={`http://localhost:8081/img/` + photoList.find((item) => item.id === izin.userID)?.imagePath}
          style={{ width: "50px" }}
        />
      )}
    </td>
                <td>
                  <div>
                    <div className='nameArea animate__animated animate__fadeInTopRight'>
                      <h1 className='name'>
                      {names[index]}
                      </h1>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <div className='ageArea animate__animated animate__fadeInTopRight'>
                      <h1 className='age'>
                        {convertTimestamp(izin.baslangic)}
                      </h1>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <div className='ageArea animate__animated animate__fadeInTopRight'>
                      <h1 className='age'>
                      {convertTimestamp(izin.bitis)}
                      </h1>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <div className='ageArea animate__animated animate__fadeInTopRight'>
                      <h1 className='age'>
                      {calculateRemainingTime(izin.bitis).days} Days, {calculateRemainingTime(izin.bitis).hours} Hours
                      </h1>
                    </div>
                  </div>
                </td>
                {isAdmin &&
                <div className='btn deleteArea animate__animated animate__flipInX' id='deleteLeaves' onClick={() => deleteEmployee(izin.userID)}>
                                <i class="fa-solid fa-trash"></i>
                          </div>     
                }
              </tr>
            ))}
          </tbody>
        </table>
    </section>
    </main>
        <>
            <Modal className='modalAddEmployee modalLeaves' show={show1} onHide={handleClose1}>
              <Modal.Body>
                <div className="addEmployeeScreen">
                  <div className='eTitle'>
                       <h1 className=" title"><strong>GIVE LEAVES</strong></h1>
                  </div>
                  <form action="" onSubmit={handleSubmit}>
                    <div className="row SignUpEmailArea areas">
                      <label htmlFor='firmaID' className="SignUpEmailLabel col-4"><h3 className="SignUpEmailLabelText">Employee: </h3></label>
                      <select onChange={handleInput} onclick="this.size=5;" onblur='this.size=1;' onchange='this.size=1; this.blur();' class="form-select SignUpEmailInput" aria-label="Default select example" name='employee' >
                        <option value="" disabled selected hidden>Choose a Employee...</option>
                        {employeeNameLists.map(employee => (
                          <Option id={employee.id} name={employee.isim}/>
                        ))}
                      </select>
                    </div>
                    <div className="row SignUpSurnameArea areas">
                        <label htmlFor='start' className="SignUpSurnameLabel col-4"><h3 className="SignUpSurnameLabelText">Start: </h3></label>
                        <input onChange={handleInput} type='datetime-local' name='baslangic' className="SignUpSurnameInput form-control col-8"></input>
                      </div>
                    <div className="row SignUpSurnameArea areas">
                        <label htmlFor='end' className="SignUpSurnameLabel col-4"><h3 className="SignUpSurnameLabelText">End: </h3></label>
                        <input onChange={handleInput} type='datetime-local' name='bitis' className="SignUpSurnameInput form-control col-8"></input>
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
  )
}

export default EmployeeLeaves;
