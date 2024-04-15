import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import ServiceControl from "./components/ServiceControl";

const servicesMock = [
  { HOSTNAME: "ds1.dexynth.com", SERVICE: "dexyntehOracle" },
  { HOSTNAME: "ds2.dexynth.com", SERVICE: "dexynthOracle" },
  // Add the rest of the services here as in the CSV provided
];

const token = process.env.REACT_APP_TOKEN;

const App = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("/services.csv")
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          header: true,
          complete: (results) => {
            setServices(results.data);
          },
        });
      });
  }, []);

  console.log("services: ", services);

  return (
    <div>
      <h2 style={{ marginTop: "10px", padding: "10px" }}>
        Service Father Manager
      </h2>
      <ServiceControl services={services} token={token} />
    </div>
  );
};

export default App;
