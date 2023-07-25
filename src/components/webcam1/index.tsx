import { forwardRef, MutableRefObject, useEffect, useImperativeHandle, useRef, useState } from 'react';
// import { Loader } from '../elements/Loader';
// import { CamCanvas, CamVideo, WebcamContainer } from './index.styled';

export type IWebCam = {
  capture: () => Promise<string>;
};

export type WebCamProps = {
  setPredictScore: (v: number) => void;
};


//resize
export const resizeCanvas = (srcCanvas: HTMLCanvasElement, targetWidth: number) => {
  const canvas = document.createElement('canvas');
  const { width } = srcCanvas;
  const { height } = srcCanvas;
  const targetRatio = targetWidth / width;

  canvas.width = width * targetRatio;
  canvas.height = height * targetRatio;

  const context = canvas.getContext('2d');
  if (!context) return null;

  context.scale(targetRatio, targetRatio);
  context.drawImage(srcCanvas, 0, 0);

  return canvas;
};

//close track
let track: MediaStreamTrack | undefined;

const stopMediaTrack = () => {
  if (track) {
    track.stop();
    track = undefined;
  }
};
//useWebcam hook
export const useWebcam = (
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  onReadyCallback: (score: number) => void
) => {
  const [isReady, setReady] = useState<boolean>(false);
  const [isPermissionDenied, setPermissionDenied] = useState<boolean>(false);

  const getVideoAndCanvas = () => {
    const { current: video } = videoRef;
    const { current: canvas } = canvasRef;
    return { video, canvas };
  };

  const handleTakePhoto = () =>
    new Promise<string>((resolve) => {
      const { video, canvas } = getVideoAndCanvas();
      if (!track || !video || !canvas) {
        resolve('');
        return;
      }
      const context = canvas.getContext('2d');
      if (!context) {
        resolve('');
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (onReadyCallback) onReadyCallback(0);

      if (video.videoWidth > video.videoHeight) context.drawImage(video, 0, 0, canvas.width, canvas.height);
      else {
        const sWidth = video.videoWidth;
        const sHeight = sWidth;
        const sy = (video.videoHeight - sHeight) / 2;

        canvas.width = sWidth;
        canvas.height = sHeight;
        context.drawImage(video, 0, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
      }
      canvas.style.opacity = '1';
      setReady(false);
      setTimeout(() => {
        const targetPxWidth = 640;
        const lowQualityCanvas = resizeCanvas(canvas, canvas.width > targetPxWidth ? targetPxWidth : canvas.width); // force image quality to 640px x 640px

        if (!lowQualityCanvas) {
          stopMediaTrack();
          resolve('');
          return;
        }

        const capturedImageString = lowQualityCanvas.toDataURL('image/png');
        resolve(capturedImageString);
        stopMediaTrack();
      }, 1000);
    });
//video loaded
  const onVideoLoaded = () => {
    const { video, canvas } = getVideoAndCanvas();
    if (!video || !canvas) return;
    video.onloadeddata = () => {//onloadeddata -> fire when loading is finished /like event /if data saver is on in browser setting mobile and table are not work
      video.play();
      video.style.opacity = '1';
      setReady(true);
      if (onReadyCallback) onReadyCallback(1);
    };
  };
//permission
  const askCameraPermission = (onSuccess: () => any) => {
    navigator.mediaDevices.enumerateDevices().then((ds) => {
      const foundNotAllowed = ds.find((d) => !d.deviceId);
      if (!foundNotAllowed) {
        onSuccess();
        return;
      }
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: true,
        })
        .then((st) => {
          const vts = st.getVideoTracks();
          if (vts.length > 0) {
            vts[0].stop();
            setTimeout(() => {
              onSuccess();
            }, 300);
          }
        })
        .catch(() => {
          setPermissionDenied(true);
        });
    });
  };
//loading
  const renderLoader = () => {
    if (!isReady && !isPermissionDenied)
      return (
        <div className="absolute left-0 right-0 -top-1 -bottom-1 flex justify-center items-center z-10">
          {/* <Loader /> */}
        </div>
      );
    return null;
  };
//error
  const renderError = () => {
    if (!isReady && isPermissionDenied)
      return (
        <div className="absolute left-0 right-0 -top-1 -bottom-1 flex justify-center items-center p-2">
          <div className="flex flex-col justify-center items-center gap-3 h-full w-full">
            <p className="text-gray-700">Camera Access Denied</p>
            <a className="underline text-blue-800" href={window.location.href}>
              Reload
            </a>
          </div>
        </div>
      );
    return null;
  };
//render box placeholder /background
  const renderBoxPlaceholder = () => {
    if (isReady)
      return (
        <div className="w-full h-full absolute flex items-center justify-center">
          <div className="w-[92%] h-[65%] border-2 border-[#00B1AD] rounded-lg" />
        </div>
      );
    return null;
  };
//take time to settle setting 
  const setupCamera = async () => {
    const { video } = getVideoAndCanvas();
    await new Promise((r) => {
      setTimeout(() => {
        r(null);
      }, 100);
    });

    if (!video) return console.log('Video not ready');
    if (!navigator.mediaDevices.getUserMedia) return alert('userMedia not supported!');
//check device info 
    const devicesInfo = await navigator.mediaDevices.enumerateDevices();

    const targetDevicesInfo = devicesInfo
      .filter((v) => v.kind === 'videoinput')
      .filter((v) => !v.label.toLowerCase().includes('front'));
//if vinput & front is ok,check dinfo in targetDInfo 
    for (const deviceInfo of targetDevicesInfo) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          deviceId: deviceInfo.deviceId,
          width: { ideal: 1920 },
        },
      });
//check focusMode
      const vTrack = stream.getVideoTracks().find((v, i) => i === 0);
      if (!vTrack) return;
      const focusModeCapability = vTrack.getCapabilities().focusMode;

      if (!focusModeCapability) {
        video.srcObject = stream;
        track = vTrack;
        break;
      } else if (focusModeCapability.includes('continuous')) {
        video.srcObject = stream;
        track = vTrack;
        break;
      } else {
        vTrack.stop();
      }
    }
  };

  useEffect(() => {
    if (videoRef.current) askCameraPermission(() => setupCamera());
  }, []);

  useEffect(() => {
    onVideoLoaded();
  }, [videoRef, setReady]);

  return {
    renderLoader,
    renderError,
    renderBoxPlaceholder,
    handleTakePhoto,
  };
};
//webcam compo
export const Webcam = forwardRef<IWebCam, WebCamProps>(({ setPredictScore }, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null)
//get props and method from custom hook (useWebcam)
  const { renderLoader, renderError, handleTakePhoto, renderBoxPlaceholder } = useWebcam(
    videoRef,
    canvasRef,
    (score: number) => setPredictScore(score)
  );
//receive ref , handler and dependency
  useImperativeHandle(
    ref,
    () => ({
      capture: handleTakePhoto,
    }),
    [handleTakePhoto]
  );
//take width and use in below components
  const width = containerRef.current?.clientWidth

  return (
    <div ref={containerRef} style={{ minHeight: 100, height: width, position: "relative" }}>
      {/* <WebcamContainer>
        <CamVideo ref={videoRef} autoPlay={false} muted playsInline controls={false} width={width} height={width} />
        <CamCanvas ref={canvasRef} width={width} height={width} />
        {renderLoader()}
        {renderError()}
        {renderBoxPlaceholder()}
        <div className="absolute w-[1px] h-[1px] rounded-full bg-white animate-pulse" />
      </WebcamContainer> */}
    </div>
  );
});
