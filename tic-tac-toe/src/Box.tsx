import { useRef } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function Box({ position, onClick, color, player }:
  { position: any, onClick: any, color: any, player: string }) {

  const mesh = useRef<THREE.Mesh>(null);

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={(e: any) => {
        e.stopPropagation();
        onClick(e);
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} transparent={true} opacity={0.51} depthWrite={false} />
      {player && 
        <Text
        fontSize={0.5}
        position={[0, 0, 0]}
        color="black"
        anchorX="center"
        anchorY="middle"
        renderOrder={1}
        >
          {player}
        </Text>
      }
    </mesh>
  );
}

export default Box;