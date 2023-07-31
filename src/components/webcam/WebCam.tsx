import React, { useEffect } from "react";

type WebCamProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
};

const WebCam: React.FC<WebCamProps> = ({ videoRef }) => {
  useEffect(() => {
    const getVideo = async () => {
      try {
        const steam = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = steam;
        }
      } catch (error) {
        console.log(error);
      }
    };

    getVideo();
  }, [videoRef]);

  return (
    <div>
      <video ref={videoRef} autoPlay muted playsInline  controls={false} width='100%' height='100%'/>
    </div>
  );
};

export default WebCam;
