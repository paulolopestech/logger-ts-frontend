import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { getLogs } from "./axios";
import { Typography, Box } from "@mui/material";

function App() {
  const [data, setData] = useState([]);

  const fetchDataFromHTTP = async () => {
    try {
      const response = await getLogs();
      console.log("res:::", response);
      setData(response.data);
    } catch (error) {
      console.error("Erro na consulta HTTP:", error);
    }
  };

  useEffect(() => {
    fetchDataFromHTTP();
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3003");

    const handleWebSocketMessage = (event) => {
      const newWebSocketData = JSON.parse(event.data);
      console.log("NEW DATA::::", event);
      console.log("NEW newData::::", newWebSocketData);
      const dataCP = JSON.parse(JSON.stringify(data));
      setData([...dataCP, newWebSocketData]);
      console.log("UP DATA:::", data);
    };

    socket.addEventListener("message", handleWebSocketMessage);

    return () => {
      socket.removeEventListener("message", handleWebSocketMessage);
      socket.close();
    };
  }, [data]);

  return (
    <Box>
      <Box sx={{width: '1000px'}}>
        {data.map((item) => {
          const time = new Date(item.timestamp).toLocaleString();
          const color = item.priority === 0 ? 'red' : item.priority === 1 ? 'orange' : 'black'
          const bold = item.priority === 0 ? 'bold' : item.priority === 1 ? 'bold' : 'thin'
          return (
            <Box sx={{ display: "flex", flexDirection: "row", background: '#d7d7d9', m: 1 }}>
              <Typography sx={{ pr: 1, fontSize: '10px', color: color, fontWeight: bold }}>
                Aplicação: {item.applicationID}
              </Typography>
              <Typography sx={{ pr: 1, fontSize: '10px', color: color, fontWeight: bold }}>Tipo: {item.type}</Typography>
              <Typography sx={{ pr: 1, fontSize: '10px', }}>Log: {item.message}</Typography>
              <Typography sx={{ pr: 1, fontSize: '10px', }}>Horario: {time}</Typography>
              <Typography sx={{ pr: 1, fontSize: '10px', }}>
                ID de conexão: {item.applicationID}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default App;
