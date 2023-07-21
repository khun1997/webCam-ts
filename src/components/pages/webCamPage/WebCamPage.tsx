import { useCallback, useRef, useState } from "react";
import WebCam from "../../webcam/WebCam";
import "./style.css";
import Loading from "../../loading/Loading";
import Photo from "../../photo/Photo";
import Button from "../../button/Button";

const WebCamPage = () => {
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
  }, []);

  const retake = () => {
    setIsCaptureLoading(true);
    setIsLoading(true)
    setTimeout(() => {
      setPicture(null);
      setIsCaptureLoading(false);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="mainContainer">
      <div className="webCamContainer">
        {isLoading || isCaptureLoading ? (
          <Loading />
        ) : (
          <>
            {picture ? (
              <div>
                <Photo photo={picture} />
              </div>
            ) : (
              <div>
                <WebCam videoRef={videoRef} />
              </div>
            )}
          </>
        )}
      </div>

      {picture ? (
        <Button onClick={retake} value="ReCapture" />
      ) : (
        <Button onClick={shoot} value="Capture" />
      )}
    </div>
  );
};

export default WebCamPage;
