import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import ExercisesPage from './pages/ExercisesPage';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ForbiddenPage from './pages/ForbiddenPage';
import { DiscordUser } from './models/discordUser';
import * as DiscordUserApi from './network/discordUser_api';
import Other from './pages/Other';
import Calendar from './pages/CalendarPage';
import HomepagePage from './pages/HomepagePage';
import { Container } from 'react-bootstrap';
import VantaBar from './components/VantaBar';
import NotFoundPage from './pages/NotFoundPage';
import ExercisePage from './pages/ExercisePage';
import AdminPage from './pages/AdminPage';
import Footer from './components/Footer';
import SearchPage from './pages/SearchPage';
import AboutMePage from './pages/AboutMePage';
import { ToastContainer } from 'react-toastify';
import { makeNotification } from './utils/toastNotification';

function App() {
  const [loggedInUser, setLoggedInUser] = useState<DiscordUser|null>(null);

  useEffect(() =>{
    async function fetchLoggedInUser() {
      try {
        const user = await DiscordUserApi.fetchAuthenticatedUser();
        setLoggedInUser(user);
      } catch (error) {
        // User is not authenticated
        //console.log(error);
        //makeNotification(""+error, "Error");
      }
    }
    fetchLoggedInUser();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Header 
          loggedUser={loggedInUser}
          onLoginClicked={DiscordUserApi.loginWithDiscord}
          onLogoutSuccessful={() => setLoggedInUser(null)}
        />

        <div className='mainContainer'>
          <div className='content'>
            
              <Routes>
                <Route
                  path='/'
                  element={<HomepagePage />}
                />
                <Route
                  path='/exercises/:id'
                  element={<ExercisePage loggedUser={loggedInUser} />}
                />
                <Route
                  path='/exercises'
                  element={<ExercisesPage />}
                />
                <Route 
                  path='/forbidden'
                  element={<ForbiddenPage />}
                />
                <Route
                  path="/auth/failure"
                  element={<HomepagePage/>}
                />
                <Route
                  path="/auth/success"
                  element={<HomepagePage/>}
                />
                <Route 
                  path='/other'
                  element={<Other />}
                />
                <Route 
                  path='/calendar'
                  element={<Calendar loggedUser={loggedInUser} />}
                />
                <Route
                  path="/about"
                  element={<AboutMePage />}
                />
                <Route 
                  path='/search'
                  element={<SearchPage />}
                />
                <Route
                  path='/admin'
                  element={<AdminPage />}
                />
                <Route
                  path='*'
                  element={<NotFoundPage />}
                />
              </Routes>   
              <Footer /> 
              <ToastContainer />      
          </div>
        </div> 
      </BrowserRouter>
    
    </>
  );
}

export default App;
