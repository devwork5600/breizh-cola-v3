uniform vec3 uColor;
varying float vAlpha;
uniform float uOpacity;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.0, dist);

  gl_FragColor = vec4(uColor, alpha * vAlpha * uOpacity);
}