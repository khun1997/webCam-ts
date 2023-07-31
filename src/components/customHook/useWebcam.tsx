import { MutableRefObject, useCallback, useEffect, useState } from "react";

const useWebcam = (
  videoRef: MutableRefObject<HTMLVideoElement | null>,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCaptureLoading, setIsCaptureLoading] = useState(false);
  const [picture, setPicture] = useState<string | null>(null);

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
    }, 400);
  }, [videoRef.current]);

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
  return { getScreenShot, shoot, retake, isLoading, isCaptureLoading, picture };
};
export default useWebcam;
