import React, { useEffect, useState, useContext } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "./context/context";
import { useCallback } from "react";
function App() {
  const { state, dispatch } = useContext(GlobalContext);

  const [login, setLogin] = useState(null);


  return (
    <div>
      
      
    </div>
  ); 
}

export default App;