import { BrowserRouter, Routes, Route } from "react-router-dom"
import Give from '../give/give';
import './App.css';
import Home from '../home/home';
import Navbar from '../navbar/navbar';
import Register from "../Register/Register";
import Login from "../Login/Login";
import GiveSuccess from "../give/giveSuccess";
import GiveUnauthorized from "../give/giveUnauthorized";
import Confirmation from "../give/Confirmation";
import Tips from "../Tips/tips";
import { AuthContextProvider, useAuthContext } from "../../Contexts/auth";
import apiClient from "../../services/apiClient";
import { useEffect } from "react";
import Profile from "../Profile/Profile";
import Settings from "../Profile/Settings";
import UserDonations from "../View/donations";
import UserRecycles from "../View/recycles";
import Points from "../Points/Points"


export default function AppContainer(){
    return (
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    )
}

const App = ()=> {

    const {user, setUser, initialized, setInitialized, donations, setDonations, recycles, setRecycles, error, setError, 
      donateNumber, setDonateNumber, recycleNumber, setRecycleNumber, points, setPoints} = useAuthContext()

    
    //itinnialed by default is false i changed user?.email(true if email is found false if not) to !user?.email(fa)
    const isAuthenticated = Boolean(initialized && !user?.email)
    
    useEffect(() => {
      document.title="Hīrā"
        const initApp = async () => {
          const { data } = await apiClient.fetchUserFromToken()
          if (data) setUser(data.user)
         
          setInitialized(true)
        }
        const token = localStorage.getItem("beauty_token")
        if (token) {
          apiClient.setToken(token)
          initApp()
        } else {
          setInitialized(true)
        }
      }, [isAuthenticated])
      
      
      //Rendering all user had donated
      const fetchDonations = async () => { 
        const { data, error } = await apiClient.fetchDonations()
        if (error) setError(error)
        if (data?.donations) {
          setDonations(data.donations)
        }
      }
      
      
       //Rendering all user has recycled
      const fetchRecycles = async () => {
        const { data, error } = await apiClient.fetchRecycles()
        if (error) setError(error)
        if (data?.recycles) {
          setRecycles(data.recycles)
        }
      }
      

    //Rendering Number of donations and Number of Recycles    
      const ProfileApp = async () => {
          const { data } = await apiClient.fetchNumberDonationsRecycled()
          if (data)  {
          setRecycleNumber(data.recycleNumber)
          setDonateNumber(data.donationNumber)
         }
      }
      const pointsData = async () =>{
        const { data } = await apiClient.viewPoints()
        if ( data != null ) {
          // console.log("data", data)
          // setPoints(data.pointNumber.points_quantity)
          setPoints(data.pointNumber)
        }
      }

      useEffect(() => {
        
        ProfileApp()
        pointsData()
      }, [])


        const clearAppState = () => {
        console.log("function is invoking")
        setUser({})
        setError(null)
      }
    
      const logoutUser = async () => {
        await apiClient.logoutUser()
        clearAppState()
      }
    
    return(
        <div className="App">
            <BrowserRouter>
                <Navbar user={user} error={error} isAuthenticated={isAuthenticated} initialized={initialized} logoutUser={logoutUser}/>
                <Routes>
                    <Route path = "/tips" element={ <Tips /> }/>

                    <Route path="/give" element={ <Give user={user} setUser={setUser} setDonateNumber={setDonateNumber} setRecycleNumber={setRecycleNumber} setDonations={setDonations} setRecycles={setRecycles} initialized={initialized} setPoints={setPoints} points={points}/> }/>

                    <Route path="/give/giveSuccess" element={ <GiveSuccess user={user} setUser={setUser} /> }/>
                    <Route path="/give/giveUnauthorized" element={ <GiveUnauthorized /> }/>
                    <Route path="/give/Confirmation" element={ <Confirmation /> }/>

                    <Route path="/" element={ <Home user={user} setUser={setUser} isAuthenticated={isAuthenticated} /> }/>

                    <Route path="/register" element={ <Register user={user} setUser={setUser} />}/>
                    <Route path="/login" element={ <Login user={user} setUser={setUser}/>}/>
                    <Route path="/profile" element={ <Profile user={user} fetchDonations={fetchDonations} fetchRecycles={fetchRecycles} ProfileApp={ProfileApp} logoutUser={logoutUser} donateNumber={donateNumber} recycleNumber={recycleNumber} setDonateNumber={setDonateNumber} setRecycleNumber={setRecycleNumber} points={points} pointsData={pointsData}/>}/>
                    <Route path="/profile/donations" element={ <UserDonations 
                                                                user={user} 
                                                                setUser={setUser}
                                                                donations={donations} 
                                                                ProfileApp={ProfileApp}
                                                                fetchDonations={fetchDonations}
                                                                donateNumber={donateNumber}
                                                                /> } />

                    <Route path="/profile/recycles" element={ <UserRecycles
                                                                user={user} 
                                                                setUser={setUser}
                                                                recycles={recycles} 
                                                                ProfileApp={ProfileApp}
                                                                fetchRecycles={fetchRecycles}
                                                                recycleNumber={recycleNumber}
                                                                /> } />

                    <Route path="/profile/settings" element={ <Settings user={user}/>}/>
                    <Route path="/points" element={<Points donateNumber={donateNumber} recycleNumber={recycleNumber} setDonateNumber={setDonateNumber} setRecycleNumber={setRecycleNumber} points={points} setPoints={setPoints} setError={setError} pointsData={pointsData}/>}/>

                </Routes>
            </BrowserRouter>
        </div>
    )
}



