#version 300 es
precision mediump float;

in vec2 CornerPosition;
uniform vec2 iResolution;
uniform float iTime;
uniform vec4 mode;
uniform vec4 raceIndex;

uniform float position;

out vec2 CornerPos;
out vec2 boxSize;

#include "./utils/utils.glsl"

float fadeInModeTime() {
    bool fromOne = roughly(mode[0], 1.);
    bool toOne = roughly(mode[1], 1.);

    if (fromOne && toOne) return mode.w;
    if (!fromOne && !toOne) return 0.;

    if (toOne) return mode.z;
    else return mode.w-mode.z;
}
float expandAnim(bool was, bool will) {
    if (was && will) {
        return 1.;
    } else if (!was && !will) {
        return 0.;
    } else if (!was && will) {
        return cubicInOut(timed(raceIndex.z, 0.5, 1.5));
    } else {
        return (1. - cubicInOut(timed(raceIndex.z, 0.5, 1.5)));
    }
}
float expandOffsetAnim() {
    bool was = intlt(raceIndex.x, position);
    bool will = intlt(raceIndex.y, position);
    return expandAnim(was,will);
}
float expandSizeAnim() {
    bool was = inteq(raceIndex.x, position);
    bool will = inteq(raceIndex.y, position);
    return expandAnim(was,will);
}

void main() {
    vec2 zeroToOne = CornerPosition/2. + 0.5;
    CornerPos = zeroToOne;

    /*
    float modeTime = fadeInModeTime();
    float fadeInAlpha = cubicInOut(timed(modeTime, 1., 2.));
    float barAlpha = (1. - cubicInOut(timed(raceIndex.z, 0., 1.)))
                     + cubicInOut(timed(raceIndex.z, 1., 2.));
    float alpha = min(fadeInAlpha, barAlpha);

    vec2 centerAreaSize = vec2(
        iResolution.x-GLOBAL_MARGIN.x*2.,
        iResolution.y-GLOBAL_MARGIN.y-HEADER_HEIGHT-HEADER_LINE_MARGIN*2.-HEADER_LINE_THICKNESS-GLOBAL_MARGIN.y
    )/iResolution; // 0 -> 1

    vec2 centerAreaCenterPos = vec2(
        0.5,
        1. - ((GLOBAL_MARGIN.y + HEADER_HEIGHT + HEADER_LINE_MARGIN * 2.1) / iResolution.y) - centerAreaSize.y /2.
    );

    float gap = PODIUM_COLUMN_GAP/iResolution.x; // 0 -> 1

    float cardWidth = (centerAreaSize.x-(gap*2.)) / 3.; // 0 -> 1
    float remapped = position;
    switch (int(round(position))) {
        case 0: remapped =  0.; break;
        case 1: remapped = -1.; break;
        case 2: remapped =  1.; break;
    }


    float width = cardWidth;
    float height = centerAreaSize.y;
    vec2 size = vec2(width, height); // 0 -> 1


    boxSize = size * iResolution;

    vec2 vertexPos = CornerPosition * size/2.; // -1 -> 1
    //vertexPos = rotate(vertexPos*iResolution, iTime*6.28/2.)/iResolution;

    vec2 finalPos = centerPos+vertexPos;

    */


    vec2 centerAreaTopCenterPos = vec2(
        0.5,
        1. - ((GLOBAL_MARGIN.y + HEADER_HEIGHT + HEADER_LINE_MARGIN * 2.0) / iResolution.y)
    );

    float height = 100.;
    float expandedHeight = 200.;
    float gap = 20.;
    float expandDiff = expandedHeight-height;

    // Expanded offset and size
    float expandOffset = expandDiff * expandOffsetAnim();
    float expandSize = expandDiff * expandSizeAnim();

    // Final calc
    float yOffset = (position+0.5) * ((height+gap)/iResolution.y) + (expandOffset + expandSize/2.)/iResolution.y;

    vec2 centerPos = centerAreaTopCenterPos - vec2(0., yOffset);

    vec2 size = vec2(iResolution.x-GLOBAL_MARGIN.x*2., height + expandSize)/iResolution;
    boxSize = size * iResolution;

    vec2 vertexPos = CornerPosition * size/2.; // -1 -> 1
    //vertexPos = rotate(vertexPos*iResolution, iTime*6.28/2.)/iResolution;

    vec2 finalPos = centerPos+vertexPos;
    gl_Position = vec4(finalPos*2.-1., 0., 1.);
}