"use client"

import axios from "axios";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    axios.get(`http://localhost:3001/categorias`)
      .then((res) => {
        console.log(res.data)
      }).catch((error) => {
        console.log(error)
      })

  }, [])


  return (
    <h1>Hello world</h1>
  );
}
