async function loadmodules() {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
  await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
  await faceapi.nets.faceExpressionNet.loadFromUri("/models");
}
loadmodules().then(startVideo);

let video = document.querySelector("video");
let constraints = {
  video: {
    facingMode: "environment",
    width: 640,
    height: 480,
  },
};
let button1 = document.getElementById("Detection");
let button2 = document.getElementById("Emotions");
let button3 = document.getElementById("Edges");
let Detection = false;
let Emotions = false;
let Edges = false;

function startVideo() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (mediaStream) {
      video.srcObject = mediaStream;
      video.onloadedmetadata = function (e) {
        video.play();
      };
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });
}

button1.addEventListener("click", () => {
  Detection = !Detection;
});
button2.addEventListener("click", () => {
  Emotions = !Emotions;
});

button3.addEventListener("click", () => {
  Edges = !Edges;
});

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    Detection ? faceapi.draw.drawDetections(canvas, resizedDetections) : null;
    Emotions ? faceapi.draw.drawFaceLandmarks(canvas, resizedDetections) : null;
    Edges ? faceapi.draw.drawFaceExpressions(canvas, resizedDetections) : null;
  }, 100);
});
