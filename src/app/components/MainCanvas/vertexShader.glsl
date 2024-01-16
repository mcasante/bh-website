uniform float uTime;
uniform float uRadius;
uniform vec2 uMouse;

varying float vDistance;
varying vec2 normalizedMouse;

// Source: https://github.com/dmnsgn/glsl-rotate/blob/main/rotation-3d-y.glsl.js
mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, 0.0, -s,
    0.0, 1.0, 0.0,
    s, 0.0, c
  );
}

void main() {
  // Calculate distance factor
  float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 1.5);

  // Calculate particle size based on distance factor
  float size = distanceFactor * 10.0 + 10.0;

  // Rotate particle position
  vec3 particlePosition = position * rotation3dY(uTime * 0.3 * distanceFactor);

  normalizedMouse = (uMouse);

  // Calculate distance between mouse and particle position
  float distanceToMouse = distance(particlePosition.xy, normalizedMouse);

  // particlePosition.xy += normalize(particlePosition.xy - normalizedMouse);

  particlePosition.xy += normalize(particlePosition.xy - normalizedMouse) * (1.0 / distanceToMouse) * 0.1 * distanceFactor;

  vDistance = distanceFactor;

  // Transform to screen space
  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = size;

  // Size attenuation
  gl_PointSize *= (1.0 / -viewPosition.z);
}