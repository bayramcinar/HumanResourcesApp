import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import 'animate.css';
import LogIN from './components/loginComponent';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardPanel from "./components/dashboard";
import SignUP from './components/signupComponent';
import Logout from './components/logout';
import MainEmployees from './components/mainEmployees';
import MainCompanies from './components/mainCompanies';
import MainDashboard from './components/mainDashboard';
import Employees from './components/employees';
import EmployeeLeaves from './components/employeeLeaves';
import MainLeave from './components/mainLeave';

function App() {
  return (
    <>
      <Routes>
        <Route path='/login' element={<LogIN/>} />
        <Route path='/leaves' element={<MainLeave/>} />
        <Route path='/' element={<MainDashboard/>} />
        <Route path='/dashboard' element={<MainDashboard/>} />
        <Route path='/employees' element={<MainEmployees/>} />
        <Route path='/companies' element={<MainCompanies/>} />
        <Route path='/logout' element={<Logout/>} />
      </Routes>
    </>
  );
}

export default App;


