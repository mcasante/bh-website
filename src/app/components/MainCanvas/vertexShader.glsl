uniform float uTime;
uniform float uRadius;

varying float vDistance;
varying vec2 vNormalizedMouse;

// Source: https://github.com/dmnsgn/glsl-rotate/blob/main/rotation-3d-y.glsl.js
mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, 0.0, -s,
    0.0, 1.0, 0.0,
    s , 0.0, c
  );
}

mat3 modifyParticles(float offset, float verticalOffset) {
  return mat3(
    1.0 / offset, 0.0, 0.0,
    0.0, verticalOffset / offset, 0.0,
    0.0, 0.0, 1.0 / offset
  );
}

mat3 closeness(float distance) {
  return mat3(
    1.0 / distance, 0.0, 0.0,
    0.0, 1.0 / distance, 0.0,
    0.0, 0.0, 1.0 / distance
  );
}

void main() {
  // Calculate distance factor
  float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 1.5);

  float xzDistanceFactor = pow(uRadius - distance(vec3(position.x, 0.0, position.z), vec3(0.0)), 1.5);

  // Calculate particle size based on distance factor
  float size = distanceFactor * 10.0 + 20.0;

  // Rotate particle position
  vec3 particlePosition = position;
  particlePosition = particlePosition * rotation3dY(uTime * 0.5 * distanceFactor);
  particlePosition = particlePosition * modifyParticles(0.4 , log(xzDistanceFactor) * 0.02);
  particlePosition = particlePosition * closeness(distanceFactor * uTime * 0.4);

  particlePosition.xyz += normalize(particlePosition.xyz - vec3(0.0)) / 1.2;

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