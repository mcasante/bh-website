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

mat3 verticalOffset(float offset) {
  return mat3(
    1.0, 0.0, 0.0,
    0.0, offset, 0.0,
    0.0, 0.0, 1.0
  );
}

mat3 closeness(float fDistance) {
  return mat3(
    1.0 / fDistance, 0.0, 0.0,
    0.0, 1.0 / fDistance, 0.0,
    0.0, 0.0, 1.0 / fDistance
  );
}

void main() {
  // Calculate distance factor
  float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 1.5);
  float xzDistanceFactor = pow(uRadius - distance(vec3(position.x, 0.0, position.z), vec3(0.0)), 1.5);

  float factor = 1.0 * sin(uTime * 1.0);

  // float fRotation = distanceFactor * uTime * 0.4;
  float fDistance = mod(distanceFactor * uTime * 0.2, 4.0);
  float fRotation = factor * fDistance;
  float xzFDistance = mod(xzDistanceFactor * uTime * 0.2, 4.0);
  // float fModifier = mod(log(fDistance) * 0.008, 200.0);
  float fModifier = log(xzFDistance) * 0.08;


  // Rotate particle position
  vec3 particlePosition = position;
  particlePosition *= rotation3dY(fRotation);
  particlePosition *= verticalOffset(fModifier);

  particlePosition *= closeness(fDistance) * 2.5;

  // particlePosition = particlePosition * rotation3dY(uTime * 0.4 * distanceFactor);
  // particlePosition = particlePosition * modifyParticles(0.4, log(xzDistanceFactor) * 0.08);
  // particlePosition = particlePosition * closeness(distanceFactor * uTime * 0.2);


  particlePosition.xyz += normalize(particlePosition.xyz - vec3(0.0)) / 1.2;

  vDistance = fDistance;

  // Calculate particle size based on distance factor
  float size = distanceFactor * 10.0 + 20.0;

  // Transform to screen space
  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = size;

  // Size attenuation
  gl_PointSize *= (1.0 / -viewPosition.z);
}