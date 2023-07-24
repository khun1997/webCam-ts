import "./App.css";
import WebCamPage from "./components/pages/webCamPage/WebCamPage";

function App() {
  return (
    <div style={{ display: "flex", marginRight: "100px" }}>
      <div
        style={{
          width: 300,
          height: 300,
          background: "red",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <WebCamPage />
      </div>

      <div
        style={{
          width: "100px",
          height: "100px",
          background: "yellow",
        }}
      >
        <WebCamPage />
      </div>
      <div
        style={{
          width: "200px",
          height: "200px",
          background: "green",
          marginTop: "20px",
        }}
      >
        <WebCamPage />
      </div>
    </div>
  );
}

export default App;
