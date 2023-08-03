import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import control from "../assets/control.png";
import Dashboard from "../assets/dashboard.png";
import Companies from "../assets/companies.png";
import EmployeesLogo from "../assets/employees.png";
import Logout from "../assets/logout.png";
import Leave from "../assets/leave1.png";
import adminLogo from "../assets/adminLogo.png";
import userLogo from "../assets/userLogo.png";
import addUser from "../assets/addUser.png";
import "./style/sidebarLogos.css";
import 'bootstrap/dist/css/bootstrap.css';
import "./style/employees.css";
import SignUP from "./signupComponent";
import axios from "axios";

const Sidebar = ({mainContent}) => {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const navigate = useNavigate();

  const handleShowSignUpModal = () => {
    setShowSignUpModal(true);
  };

  const handleCloseSignUpModal = () => {
    setShowSignUpModal(false);
  };

  const Menus = [
    { title: "Dashboard", src: Dashboard },
    { title: "Employees", src: EmployeesLogo },
    { title: "Companies", src: Companies },
    { title: "Leaves", src: Leave },
  ];

  if (isAdmin) {
    Menus.push({ title: "Add User", src: addUser, onClick: handleShowSignUpModal });
  }

  Menus.push({ title: "LogOut ", src: Logout });

  const [name,setName] =useState("");
  const [surname,setSurname] =useState("");
  const [email,setEmail] =useState("");
  const [rol,setRol] =useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  

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

  useEffect(() => {
    axios
      .get("http://localhost:8081/getUserDetails")
      .then((res) => {
        const { username,email,rol } = res.data;
        setEmail(email);
        setName(username);
        setRol(rol);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="flex">
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-dark-purple h-screen pl-5 pr-0  pt-8 relative duration-300 bar`}
      >
        <img
          src={control}
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
           border-2 rounded-full controller  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <img
            id="sideBarLogo"
            src={isAdmin ? adminLogo : userLogo}
            className={`cursor-pointer duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
        </div>
        {!open && (
          <h1
            id="userTitle"
            className={`text-white origin-left font-medium text-xl duration-200 animate__animated animate__bounceInLeft`}
          >
            {name.toUpperCase()}
          </h1>
        )}

        {open && 
        <div className="userInfoArea">
          <h1
              id="userNameTitle"
              className={`text-white origin-left font-medium text-xl duration-200 `}
            >
              {name.toUpperCase()} {surname.toUpperCase()} 
          </h1> 
          <h1
              id="userEmailTitle"
              className={`text-white origin-left font-medium text-xl duration-200 `}
            >
              {email}
          </h1>
          <h1
              id="userRolTitle"
              className={`text-white origin-left font-medium text-xl duration-200 `}
            >
              ({rol})
          </h1>
        </div>
          
        }
          <ul className="pt-6" id="ulBar">
            {Menus.map((Menu, index) => (
              <div className="sideBarDiv animate__animated animate__bounceInLeft  " key={index}                 
              href={"/" + Menu.title.toLowerCase()} 
              onClick={(e) => {
                e.preventDefault();
                console.log(Menu.onClick);
                if (Menu.onClick) {
                  Menu.onClick(); 
                } else {
                  navigate("/" + Menu.title.toLowerCase());
                }
              }}> 
              <li
                  className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 liSide 
                  ${Menu.gap ? "mt-9" : "mt-2"} ${
                  index === 0 && "bg-light-white"
                  } `}
              >
                  <img className="sideBarLogos" src={Menu.src} />
                  <span
                      id="sidebarmenuTitle"
                      className={`${!open && "hidden"} origin-left duration-200`}
                  >
                      {Menu.title}
                  </span>
              </li>
            </div>
        ))}
        </ul>
      </div>
      <div className="pl-5 Scontent">
        <h1 className="text-2xl font-semibold icerik">{mainContent}</h1>
      </div>
      <SignUP show={showSignUpModal} handleClose={handleCloseSignUpModal} />
    </div>
  );
};
export default Sidebar;