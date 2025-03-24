import "./counter.css";


import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";

function Counter() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const squatDownRef = useRef(false);

  const [repCount, setRepCount] = useState(0);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [inRestMode, setInRestMode] = useState(false);
  const [feedback, setFeedback] = useState("");

  const MIN_SCORE = 0.3;
  const CALORIES_PER_SQUAT = 0.32; // Rough estimate of calories burned per squat

  useEffect(() => {
    async function setupCameraAndDetector() {
      try {
        await tf.ready();
        await tf.setBackend("webgl");
      } catch (err) {
        console.error("Error initializing TensorFlow backend:", err);
      }
      
      // Set up the video stream.
      const video = videoRef.current;
      if (!video) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          video.play();
        };
      } catch (err) {
        console.error("Error accessing video:", err);
      }

      // Load the MoveNet detector.
      try {
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        };
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          detectorConfig
        );
        detectorRef.current = detector;
      } catch (err) {
        console.error("Error loading detector:", err);
      }
    }
    setupCameraAndDetector();
  }, []);

  useEffect(() => {
    let timer;
    if (!inRestMode) {
      timer = setInterval(() => setWorkoutTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [inRestMode]);

  useEffect(() => {
    if (inRestMode && restTime > 0) {
      const timer = setTimeout(() => setRestTime(restTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (inRestMode && restTime === 0) {
      setInRestMode(false);
    }
  }, [inRestMode, restTime]);

  useEffect(() => {
    async function setupCameraAndDetector() {
      await tf.ready();
      await tf.setBackend("webgl");

      const video = videoRef.current;
      if (!video) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        video.play();
      };

      const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
      detectorRef.current = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );
    }
    setupCameraAndDetector();
  }, []);

  useEffect(() => {
    let animationFrameId;

    async function detectPose() {
      if (detectorRef.current && videoRef.current) {
        const poses = await detectorRef.current.estimatePoses(videoRef.current);
        if (poses.length > 0) {
          const pose = poses[0];
          drawPose(pose);
          detectSquat(pose);
          provideFeedback(pose);
        }
      }
      animationFrameId = requestAnimationFrame(detectPose);
    }
    detectPose();
    return () => cancelAnimationFrame(animationFrameId);
  }, [inRestMode]);

  const drawPose = (pose) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Draw each keypoint as a red circle.
        pose.keypoints.forEach((kp) => {
          if (kp.score > MIN_SCORE) {
            ctx.beginPath();
            ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
          }
        });
        drawSkeleton(pose.keypoints, ctx);
      };
    
      // Draw skeleton by connecting specific keypoints.
      const drawSkeleton = (keypoints, ctx) => {
        const connections = [
          ["left_shoulder", "right_shoulder"],
          ["left_shoulder", "left_elbow"],
          ["left_elbow", "left_wrist"],
          ["right_shoulder", "right_elbow"],
          ["right_elbow", "right_wrist"],
          ["left_shoulder", "left_hip"],
          ["right_shoulder", "right_hip"],
          ["left_hip", "right_hip"],
          ["left_hip", "left_knee"],
          ["left_knee", "left_ankle"],
          ["right_hip", "right_knee"],
          ["right_knee", "right_ankle"],
        ];
    
        const keypointMap = {};
        keypoints.forEach((kp) => {
          const key = kp.name || kp.part;
          keypointMap[key] = kp;
        });
    
        connections.forEach(([p1, p2]) => {
          const kp1 = keypointMap[p1];
          const kp2 = keypointMap[p2];
          if (kp1 && kp2 && kp1.score > MIN_SCORE && kp2.score > MIN_SCORE) {
            ctx.beginPath();
            ctx.moveTo(kp1.x, kp1.y);
            ctx.lineTo(kp2.x, kp2.y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "green";
            ctx.stroke();
          }
        });
      };
    
      // Helper: calculate the angle (in degrees) at point B, given points A, B, and C.
      const calculateAngle = (A, B, C) => {
        const AB = { x: A.x - B.x, y: A.y - B.y };
        const CB = { x: C.x - B.x, y: C.y - B.y };
        const dot = AB.x * CB.x + AB.y * CB.y;
        const magAB = Math.hypot(AB.x, AB.y);
        const magCB = Math.hypot(CB.x, CB.y);
        const angleRad = Math.acos(dot / (magAB * magCB));
        return angleRad * (180 / Math.PI);
      };
    
      const detectSquat = (pose) => {
            const leftHip = pose.keypoints.find((kp) => (kp.name || kp.part) === "left_hip");
            const leftKnee = pose.keypoints.find((kp) => (kp.name || kp.part) === "left_knee");
            const leftAnkle = pose.keypoints.find((kp) => (kp.name || kp.part) === "left_ankle");
        
            if (
              leftHip &&
              leftKnee &&
              leftAnkle &&
              leftHip.score > MIN_SCORE &&
              leftKnee.score > MIN_SCORE &&
              leftAnkle.score > MIN_SCORE
            ) {
              const angle = calculateAngle(leftHip, leftKnee, leftAnkle);
              console.log("Left knee angle:", angle);
        
              // Define thresholds for the squat state.
              const downThreshold = 100; // Knee angle when squatting down
              const upThreshold = 140;   // Knee angle when standing up
        
              // If the knee angle goes below the down threshold and we haven't marked a squat down yet...
              if (angle < downThreshold && !squatDownRef.current) {
                squatDownRef.current = true;
                console.log("Squat down detected");
              }
        
              // If the knee angle rises above the up threshold after a squat down, count a rep.
              if (angle > upThreshold && squatDownRef.current) {
                setRepCount((prev) => prev + 1);
                squatDownRef.current = false;
                console.log("Squat up detected, rep counted");
              }
            }
          };

  const provideFeedback = (pose) => {
    const leftShoulder = pose.keypoints.find((kp) => kp.name === "left_shoulder");
    const leftHip = pose.keypoints.find((kp) => kp.name === "left_hip");
    const leftKnee = pose.keypoints.find((kp) => kp.name === "left_knee");
    
    if (!leftShoulder || !leftHip || !leftKnee) return;

    if (leftHip.y < leftShoulder.y) {
      setFeedback("Try keeping your back straight");
    } else {
      setFeedback("Good form! Keep going!");
    }
  };

  return (
    <div style={{ textAlign: "center", color: "white" }}>
  <h1>Squat Counter</h1>
  
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
    
    {/* Left Box */}
    <div style={{ backgroundColor: "black", padding: "20px", borderRadius: "10px" }}>
      <h2>Reps: {repCount}</h2>
      {inRestMode ? <h2>Resting... {restTime}s</h2> : null}
      <h3>{feedback}</h3>
    </div>

    {/* Right Box */}
    <div style={{ marginLeft: "auto", textAlign: "left", backgroundColor: "black", padding: "20px", borderRadius: "10px" }}>
      <h2>Workout Time: {workoutTime}s</h2>
      <h2>Calories Burned: {(repCount * CALORIES_PER_SQUAT).toFixed(2)} kcal</h2>
    </div>
  </div>

  <div style={{ position: "relative", width: 640, height: 480, margin: "auto", border: "1px solid #ccc" }}>
    <video ref={videoRef} width={640} height={480} style={{ position: "absolute", top: 0, left: 0 }} autoPlay muted playsInline />
    <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
  </div>
</div>


  );
}

export default Counter;
