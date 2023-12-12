import React, { useState, useEffect } from "react";
import "./App.css";
import { getLogs } from "./axios";
import {
  Typography,
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";

function App() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});

  const [filterConnection, setFilterConnection] = useState(false);
  const [filterDisconnection, setFilterDisconnection] = useState(false);
  const [filterException, setFilterException] = useState(false);
  const [filterWarning, setFilterWarning] = useState(false);
  const [filterInfo, setFilterInfo] = useState(false);

  const setAllFiltersFalse = () => {
    setFilterInfo(false);
    setFilterWarning(false);
    setFilterException(false);
    setFilterDisconnection(false);
    setFilterConnection(false);
  };

  const cleanFilters = () => {
    setFilters({});
  };

  const fetchDataFromHTTP = async () => {
    try {
      const response = await getLogs(filters);
      const reverseData = response.data.reverse();
      setData(reverseData);
    } catch (error) {
      console.error("Erro na consulta HTTP:", error);
    }
  };

  useEffect(() => {
    fetchDataFromHTTP();
  }, [filters]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3003");

    const handleWebSocketMessage = (event) => {
      const newWebSocketData = JSON.parse(event.data);
      const dataCP = JSON.parse(JSON.stringify(data));
      if (filterInfo) {
        if (newWebSocketData.type === "info")
          setData([newWebSocketData, ...dataCP]);
        return;
      }
      if (filterWarning) {
        if (newWebSocketData.type === "warning")
          setData([newWebSocketData, ...dataCP]);
        return;
      }
      if (filterException) {
        if (newWebSocketData.type === "exception")
          setData([newWebSocketData, ...dataCP]);
        return;
      }
      if (filterConnection) {
        if (newWebSocketData.type === "connection")
          setData([newWebSocketData, ...dataCP]);
        return;
      }
      if (filterDisconnection) {
        if (newWebSocketData.type === "disconnection")
          setData([newWebSocketData, ...dataCP]);
        return;
      }
      setData([newWebSocketData, ...dataCP]);
    };

    socket.addEventListener("message", handleWebSocketMessage);

    return () => {
      socket.removeEventListener("message", handleWebSocketMessage);
      socket.close();
    };
  }, [data]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        height: "100vh",
        background: "#000",
      }}
    >
      <Box sx={{ width: "20%", background: "grey" }}>
        <Box sx={{ textAlign: "center", mt: 1 }}>
          <Typography
            sx={{ color: "#FFF", fontWeight: "bold", fontSize: "30px" }}
          >
            {" "}
            Filtros{" "}
          </Typography>
        </Box>
        <Box sx={{ color: "#FFF" }}>
          <FormGroup>
            <FormControlLabel
              sx={{
                background: "#FFF",
                m: 1,
                borderRadius: "1px",
                color: "#000",
              }}
              control={
                <Checkbox
                  checked={filterInfo}
                  onChange={(e) => {
                    setAllFiltersFalse();
                    if (e.target.checked) {
                      setFilters({ type: "info" });
                      setFilterInfo(true);
                      return;
                    }
                    cleanFilters();
                  }}
                />
              }
              label="info"
            />
            <FormControlLabel
              sx={{
                background: "#FFF",
                m: 1,
                borderRadius: "1px",
                color: "#000",
              }}
              control={
                <Checkbox
                  checked={filterWarning}
                  onChange={(e) => {
                    setAllFiltersFalse();
                    if (e.target.checked) {
                      setFilters({ type: "warning" });
                      setFilterWarning(true);
                      return;
                    }
                    cleanFilters();
                  }}
                />
              }
              label="warning"
            />
            <FormControlLabel
              sx={{
                background: "#FFF",
                m: 1,
                borderRadius: "1px",
                color: "#000",
              }}
              control={
                <Checkbox
                  checked={filterException}
                  onChange={(e) => {
                    setAllFiltersFalse();
                    if (e.target.checked) {
                      setFilters({ type: "exception" });
                      setFilterException(true);
                      return;
                    }
                    cleanFilters();
                  }}
                />
              }
              label="exception"
            />{" "}
            <FormControlLabel
              sx={{
                background: "#FFF",
                m: 1,
                borderRadius: "1px",
                color: "#000",
              }}
              control={
                <Checkbox
                  checked={filterDisconnection}
                  onChange={(e) => {
                    setAllFiltersFalse();
                    if (e.target.checked) {
                      setFilters({ type: "disconnection" });
                      setFilterDisconnection(true);
                      return;
                    }
                    cleanFilters();
                  }}
                />
              }
              label="disconnection"
            />{" "}
            <FormControlLabel
              sx={{
                background: "#FFF",
                m: 1,
                borderRadius: "1px",
                color: "#000",
              }}
              control={
                <Checkbox
                  checked={filterConnection}
                  onChange={(e) => {
                    setAllFiltersFalse();
                    if (e.target.checked) {
                      setFilters({ type: "connection" });
                      setFilterConnection(true);
                      return;
                    }
                    cleanFilters();
                  }}
                />
              }
              label="connection"
            />
          </FormGroup>
        </Box>
      </Box>
      <Box
        sx={{
          width: "80%",
          maxHeight: "97%",
          overflow: "scroll",
          overflowX: "hidden",
          background: "#000",
          pt: 1,
        }}
      >
        {data.map((item) => {
          const time = new Date(item.timestamp).toLocaleString();
          const background =
            item.priority === 0
              ? "red"
              : item.priority === 1
              ? "orange"
              : item.type === "connection"
              ? "green"
              : "white";
          const bold =
            item.priority === 0
              ? "bold"
              : item.priority === 1
              ? "bold"
              : "thin";
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                background: background,
                m: 1,
                border: "solid 1px",
                p: 1,
              }}
            >
              <Typography sx={{ pr: 1, fontSize: "13px", fontWeight: bold }}>
                Aplicação: {item.applicationID}
              </Typography>
              <Typography sx={{ pr: 1, fontSize: "13px", fontWeight: bold }}>
                Tipo: {item.type}
              </Typography>
              <Typography sx={{ pr: 1, fontSize: "13px" }}>
                Log: {item.message}
              </Typography>
              <Typography sx={{ pr: 1, fontSize: "13px" }}>
                Horario: {time}
              </Typography>
              <Typography sx={{ pr: 1, fontSize: "13px" }}>
                Aplicação: {item.applicationID}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default App;
