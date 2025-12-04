#version 300 es
precision mediump float;

in vec2 CornerPosition;
uniform vec2 iResolution;
uniform float iTime;
uniform vec4 mode;

out vec2 CornerPos;

#include "lygia/animation/easing/cubic.glsl"
#include "./utils/animation.glsl"
#include "./utils/utils.glsl"
#include "./utils/constants.glsl"

float fadeInModeTime() {
    bool fromZero = roughly(mode[0], 0.);
    bool toZero = roughly(mode[1], 0.);

    if (!fromZero && !toZero) return mode.w;
    if (fromZero && toZero) return 0.;

    if (fromZero) return mode.z;
    else return mode.w-mode.z;
}

void main() {
    vec2 zeroToOne = CornerPosition/2. + 0.5;
    CornerPos = zeroToOne;

    float modeTime = fadeInModeTime();
    float barAlpha = cubicInOut(timed(modeTime, 1., 2.));

    vec2 centerPos = vec2(0.,1. - (GLOBAL_MARGIN.y + HEADER_HEIGHT + HEADER_LINE_MARGIN) / iResolution.y * 2.);

    float width = (iResolution.x - (GLOBAL_MARGIN.x * 2.)) * barAlpha;
    vec2 size = vec2(width, HEADER_LINE_THICKNESS) / iResolution; // -1 -> 1

    vec2 vertexPos = CornerPosition * size;
    //vertexPos = rotate(vertexPos*iResolution, iTime*6.28/2.)/iResolution;

    gl_Position = vec4(centerPos+vertexPos, 0., 1.);
}