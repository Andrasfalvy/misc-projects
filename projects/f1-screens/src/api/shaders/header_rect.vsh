#version 300 es
precision mediump float;

in vec2 CornerPosition;
uniform vec2 iResolution;
uniform float iTime;

uniform float lastMode;
uniform float modeSwitchTime;
uniform float currentMode;

uniform vec2 size;

out vec2 CornerPos;

void main() {
    vec2 zeroToOne = CornerPosition/2. + 0.5;
    CornerPos = zeroToOne * iResolution;
    gl_Position = vec4(CornerPosition, 0., 1.);
}