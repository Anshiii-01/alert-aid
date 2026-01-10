import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';
import { Card, Text } from '../../styles/components';

const LandscapeContainer = styled(Card)`
  position: relative;
  width: 350px;
  height: 350px;
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  overflow: hidden;
`;

const ScoreOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  pointer-events: none;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e2e8f0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  min-width: 200px;
`;

const RiskScore = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const RiskLevel = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const LoadingFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const InstructionOverlay = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.lg};
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e2e8f0;
  backdrop-filter: blur(10px);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: #64748b;
  text-align: center;
  z-index: 10;
`;

// Placeholder terrain component
const TerrainMesh: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  // Create a simple heightmap-based terrain
  const geometry = React.useMemo(() => {
    const geometry = new THREE.PlaneGeometry(5, 5, 32, 32);
    const vertices = geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      // Create mountain-like terrain
      vertices[i + 2] = Math.sin(x * 0.5) * Math.cos(y * 0.5) * 0.5 + 
                       Math.random() * 0.1;
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <meshStandardMaterial 
        color="#1a4d3a"
        wireframe={false}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
};

// Simple mountain peaks
const Mountains: React.FC = () => {
  return (
    <group>
      {/* Background mountains */}
      <mesh position={[-2, 0, -2]}>
        <coneGeometry args={[0.8, 2, 8]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh position={[1.5, 0, -1.5]}>
        <coneGeometry args={[0.6, 1.5, 8]} />
        <meshStandardMaterial color="#353535" />
      </mesh>
      <mesh position={[0, 0, -3]}>
        <coneGeometry args={[1, 2.5, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
};

// Water/river simulation
const Water: React.FC = () => {
  const waterRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05 - 0.8;
    }
  });

  return (
    <mesh ref={waterRef} position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2, 0.5]} />
      <meshStandardMaterial 
        color="#1e3a8a"
        transparent
        opacity={0.7}
        roughness={0}
        metalness={0.1}
      />
    </mesh>
  );
};

// Scene composition
const Scene: React.FC = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, 5, 5]} intensity={0.3} color="#ff7043" />
      
      {/* Environment */}
      <Environment preset="sunset" />
      
      {/* Terrain and landscape elements */}
      <TerrainMesh />
      <Mountains />
      <Water />
      
      {/* Camera controls */}
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={8}
      />
    </>
  );
};

interface Central3DLandscapeProps {
  riskScore?: number;
  riskLevel?: string;
}

const Central3DLandscape: React.FC<Central3DLandscapeProps> = ({
  riskScore = 0,
  riskLevel = "Calculating Risk..."
}) => {
  return (
    <LandscapeContainer>
      <CanvasContainer>
        <Canvas
          camera={{ position: [0, 2, 5], fov: 60 }}
          shadows
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </CanvasContainer>
      
      {/* Removed ScoreOverlay - risk score shown in main panel above */}
      
      <InstructionOverlay>
        Drag to rotate • Scroll to zoom • 3D Landscape Visualization
      </InstructionOverlay>
    </LandscapeContainer>
  );
};

export default Central3DLandscape;