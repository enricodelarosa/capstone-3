import {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AppNavbar from './components/AppNavbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import Products from './pages/Products';


import {UserProvider} from './UserContext';

import {Container} from 'react-bootstrap';

import './App.css';


function App() {
    const [user, setUser] = useState({
        id: null,
        isAdmin: null
    });

    const unsetUser = () => {
        localStorage.clear();
        setUser({
            id: null,
            isAdmin: null
        });
    }

  return (
    <UserProvider value={{user, setUser, unsetUser}}>
    <Router>
      <AppNavbar />
      <Container>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/products" element={<Products />} />

          {/* <Route path="/courses/:courseId" element={<CourseView />} /> */}

          <Route path="/register" element={<Register />}/>
          <Route path = "/login" element={<Login />}/>
          <Route path = "/logout" element={<Logout/>}/>

          {/* <Route path = "/*" element={<Error404/>}/> */}
          
        </Routes>
      </Container>
    </Router>
    </UserProvider>
  );
}

export default App;
