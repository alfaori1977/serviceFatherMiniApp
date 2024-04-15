import React, { useState, useEffect } from "react";
import axios from "axios";

const ServiceControl = ({ services, token }) => {
  const [selectedHost, setSelectedHost] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [action, setAction] = useState("status");
  const [message, setMessage] = useState(""); // State to store the response or error message

  const mode = process.env.REACT_APP_MODE || "dev";
  const herokuCors =
    mode == "dev" ? "https://cors-anywhere.herokuapp.com/" : "";

  useEffect(() => {
    if (services.length > 0) {
      // Default to the first host if none in local storage
      const defaultHost = selectedHost || services[0].HOSTNAME;
      setSelectedHost(defaultHost);

      // Filter services for the default or selected host and set default service
      const filteredServices = services.filter(
        (service) => service.HOSTNAME === defaultHost
      );
      const defaultService =
        filteredServices.length > 0 ? filteredServices[0].SERVICE : "";
      console.log("defaultService: ", defaultService);
      setSelectedService(defaultService);
    }
  }, [services, selectedHost]); // Run this effect when services array changes

  useEffect(() => {}, [selectedService, selectedHost]);

  const handleControlService = async () => {
    const endpoint = `${herokuCors}https://sf.${selectedHost}/api`;
    console.log("endpoint: ", endpoint);
    const payload = {
      serviceName: selectedService,
      action: action,
      token: token,
    };
    /*
    try {
      const response = await axios.post(endpoint, payload);
      alert("Response: " + JSON.stringify(response.data));
    } catch (error) {
      alert("Error: " + error.message);
    }*/

    try {
      const response = await axios.post(endpoint, payload);
      setMessage(`Response: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ marginTop: "10px", padding: "10px" }}>
      <select
        onChange={(e) => setSelectedHost(e.target.value)}
        value={selectedHost}
      >
        {[...new Set(services.map((item) => item.HOSTNAME))].map((host) => (
          <option key={host} value={host}>
            {host}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => setSelectedService(e.target.value)}
        value={selectedService}
      >
        {services
          .filter((service) => service.HOSTNAME === selectedHost)
          .map((item, index) => (
            <option key={index} value={item.SERVICE}>
              {item.SERVICE}
            </option>
          ))}
      </select>
      <select onChange={(e) => setAction(e.target.value)} value={action}>
        {["status", "start", "kill", "restart", "enable", "disable"].map(
          (act) => (
            <option key={act} value={act}>
              {act}
            </option>
          )
        )}
      </select>
      <button onClick={handleControlService}>Execute</button>
      <div
        style={{ marginTop: "10px", padding: "10px", border: "1px solid #ccc" }}
      >
        <strong>Output:</strong>
        <textarea
          value={message}
          readOnly
          style={{ width: "100%", height: "500px" }}
        />
      </div>
    </div>
  );
};

export default ServiceControl;
