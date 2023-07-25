import "./App.css";
import Webcam_1 from "./components/webcam_1/Webcam_1";

function App() {
  return (
    <div>
      <div style={{ width: "400px", height: "400px", background: "red" }}>
        <Webcam_1 />
      </div>
      <div style={{ width: "200px", height: "150px", background: "red" }}>
        <Webcam_1 />
      </div>
      <div style={{ width: "300px", height: "250px", background: "red" }}>
        <Webcam_1 />
      </div>
    </div>
  );
}

export default App;
