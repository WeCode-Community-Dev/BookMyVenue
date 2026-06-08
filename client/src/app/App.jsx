import {BrowserRouter,Routes,Route} from "react-router-dom";
import Dashboard from "../presentation/pages/vendor/Dashboard";

import React from 'react'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route>
        <Route path="/" element={<Dashboard/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App