import { forwardRef, useImperativeHandle, useRef } from "react";
import Photo from "../photo/Photo";
import Button from "../button/Button";
import useWebcam from "../customHook/useWebcam";
import WebCam from "../webcam/WebCam";

export type IWebCam = {
  capture: () => void;
};

export const Webcam_1 = forwardRef<IWebCam>(({}, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { picture, retake, shoot } = useWebcam(videoRef);

  useImperativeHandle(
    ref,
    () => ({
      capture: shoot,
    }),
    [shoot]
  );

  const width = containerRef.current?.clientWidth;

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: 50,
        height: width,
        background: "",
        marginRight:''
      }}
    >
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
    // </div>
  );
});

export default Webcam_1;
