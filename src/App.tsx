import "./App.css";
import WebCamPage from "./components/pages/webCamPage/WebCamPage";
import Webcam_1 from "./components/webcam_1/Webcam_1";

function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "30px",
        background: "",
      }}
    >
      <div>
        <Webcam_1 />
      </div>
      <WebCamPage />
    </div>
  );
}

export default App;
