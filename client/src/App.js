import { Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import WeightInput from "./components/pages/WeightInput";
import WeightInquiry from "./components/pages/WeightInquiry";
import UserSetting from "./components/pages/UserSetting";
import PFCInput from "./components/pages/PFCInput";
import TodaysInfo from "./components/pages/TodaysInfo";
import UserInfo from "./components/pages/UserInfo";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={ <Login/> }/>
        <Route path='/WeightInput' element={ <WeightInput/> }/>
        <Route path='/WeightInquiry' element={ <WeightInquiry/> }/>
        <Route path='/UserSetting' element={ <UserSetting/> }/>
        <Route path='/PFCInput' element={ <PFCInput/> }/>
        <Route path='/TodaysInfo' element={ <TodaysInfo/> }/>
        <Route path='/UserInfo' element={ <UserInfo/> }/>
      </Routes>
    </div>
  );
}

export default App;
