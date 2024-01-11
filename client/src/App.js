import { Routes, Route } from "react-router";
import Signup from "./pages/Signup/Signup";

import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route strict exact path="/signup" component={Signup} />
      </Routes>
    </div>
  );
}

export default App;
