import React, { useEffect, useState, useRef } from "react";
import Home from "./componenets/Home";
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import AdminPanel from "./componenets/AdminPanel";
import Navbar from "./componenets/Navbar";
function App() {



  return (
    <div>
      <Router>
      <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/adminpanel' exact component={AdminPanel} />
        </Switch>
        
      </Router> 
    </div>
  );
}

export default App;
