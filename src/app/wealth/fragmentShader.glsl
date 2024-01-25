varying float vDistance;
varying vec3 vColor;

void main() {
  // float strength = distance(gl_PointCoord, vec2(0.5));
  // strength = 1.0 - strength;
  // strength = pow(strength, 3.0);

  // vec3 color = mix(vColor, vec3(0.97, 0.70, 0.45), vDistance * 0.5);
  // color = mix(vec3(0.0), color, strength);
  // gl_FragColor = vec4(vColor, strength);
  gl_FragColor = vec4(vColor, 1.0);
}
