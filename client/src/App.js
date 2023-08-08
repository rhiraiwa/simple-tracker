import { Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import WeightInput from "./components/pages/WeightInput";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={ <Login/> }/>
        <Route path='/WeightInput' element={ <WeightInput/> }/>
      </Routes>
    </div>
  );
}

export default App;
