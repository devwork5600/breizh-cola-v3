uniform float uTime;
uniform float uSize;
uniform float uSpeed;

attribute float aRandom;

varying float vAlpha;

void main() {
  vec3 pos = position;
  float t = uTime * uSpeed;

  pos.y += t * (0.2 + aRandom * 0.5);
  pos.y = mod(pos.y + 2.0, 6.0) - 1.0;

  pos.x += sin(t + pos.y + aRandom * 10.0) * 0.01;
  pos.z += cos(t + pos.y + aRandom * 10.0) * 0.15;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  gl_PointSize = uSize * (700.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;

  vAlpha = 0.6 + aRandom * 0.4;
}