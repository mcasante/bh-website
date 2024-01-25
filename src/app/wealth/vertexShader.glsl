uniform float uTime;
uniform float uRadius;
uniform vec2 uMouse;

attribute vec3 color;

varying float vDistance;
varying vec2 vNormalizedMouse;
varying vec3 vColor;

void main() {
  float size = 50.0; 

  vec3 particlePosition = position;

  vec2 normalizedMouse = uMouse * uRadius;

  // Transform to screen space
  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vColor = color;

  gl_Position = projectedPosition;
  gl_PointSize = size;
  gl_PointSize *= (1.0 / -viewPosition.z);

  vec2 vertexPosition = gl_Position.xy / gl_Position.w;
  vec2 repulsionVector = vertexPosition - uMouse;
  float distanceScalingFactor = .2;

  float distance = length(repulsionVector);

  vec2 repulsionForce = (distance > 0.0001) ? repulsionVector / distance * distanceScalingFactor : vec2(0.0);

  vertexPosition += repulsionForce;

  gl_Position.xy = vertexPosition * gl_Position.w;
  // gl_Position.zw = vec2(0.0, 1.0);
}