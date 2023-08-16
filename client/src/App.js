import { Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import WeightInput from "./components/pages/WeightInput";
import WeightInquiry from "./components/pages/WeightInquiry";
import UserSetting from "./components/pages/UserSetting";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={ <Login/> }/>
        <Route path='/WeightInput' element={ <WeightInput/> }/>
        <Route path='/WeightInquiry' element={ <WeightInquiry/> }/>
        <Route path='/UserSetting' element={ <UserSetting/> }/>
      </Routes>
    </div>
  );
}

export default App;
