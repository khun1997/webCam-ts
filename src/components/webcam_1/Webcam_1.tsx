import { useCallback, useRef, useState } from "react";
import Loading from "../loading/Loading";
import Photo from "../photo/Photo";
import Button from "../button/Button";
import WebCam from "../webcam/WebCam";


const Webcam_1 = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [picture, setPicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCaptureLoading, setIsCaptureLoading] = useState(false);
  const getScreenShot = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (context) {
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;

        canvas.width = videoWidth;
        canvas.height = videoHeight;
        context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

        return canvas.toDataURL();
      }
    }
    return null;
  };

  const shoot = useCallback(() => {
    if (videoRef.current) {
      setIsCaptureLoading(true);
      setIsLoading(true);
      const Image = getScreenShot();
      setPicture(Image);
      setIsCaptureLoading(false);
      setIsLoading(false);
    }
  }, [videoRef.current]);

  const retake = useCallback(() => {
    setIsCaptureLoading(true);
    setIsLoading(true);
    setTimeout(() => {
      setPicture(null);
      setIsCaptureLoading(false);
      setIsLoading(false);
    }, 500);
  }, [videoRef.current]);

  return (
  
    <div style={{ width: "100%", height: "100%" }}>
      {isLoading || isCaptureLoading ? (
        <div style={{ width: "100%", height: "100%" }}>
          <Loading />
        </div>
      ) : (
        <div style={{width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
          {picture ? (
            <div>
              <Photo photo={picture} />
              <Button onClick={retake} value="ReCapture" />
            </div>
          ) : (
            <div>
              <WebCam videoRef={videoRef} />
              <Button onClick={shoot} value="Capture" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Webcam_1;
