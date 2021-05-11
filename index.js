const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),
]).then(startVideo)

function startVideo(){
    navigator.getUserMedia(
        {video: {}},
        stream => video.srcObject = stream,
        err => console.log(err)
        )
}

video.addEventListener('play', ()=>{
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const tamanho = {width: video.width, height: video.height}
    faceapi.matchDimensions(canvas, tamanho)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, 
            new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
            const AjustaDetections = faceapi.resizeResults(detections, tamanho)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, AjustaDetections)
            faceapi.draw.drawFaceLandmarks(canvas, AjustaDetections)
            faceapi.draw.drawFaceExpressions(canvas, AjustaDetections)
        }, 100)
})
