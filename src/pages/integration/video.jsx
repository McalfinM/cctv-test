// src/components/RTSPPlayer.js
import React, { useEffect, useRef } from 'react';
import { loadPlayer } from 'rtsp-relay/browser';

const StreamPage = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const player = loadPlayer({
      url: `ws://${window.location.hostname}:2001/api/stream`,
      canvas: canvasRef.current,
      onDisconnect: () => console.log('Connection lost!'),
    });

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }} />;
};

export default StreamPage;
