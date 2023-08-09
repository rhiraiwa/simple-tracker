import { Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import WeightInput from "./components/pages/WeightInput";
import WeightInquiry from "./components/pages/WeightInquiry";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={ <Login/> }/>
        <Route path='/WeightInput' element={ <WeightInput/> }/>
        <Route path='/WeightInquiry' element={ <WeightInquiry/> }/>
      </Routes>
    </div>
  );
}

export default App;
