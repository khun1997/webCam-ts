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
    <div style={{width:'100%',height:'100%'}}>
      <video ref={videoRef} autoPlay muted  width={"100%"} height={"100%"} />
    </div>
  );
};

export default WebCam;
