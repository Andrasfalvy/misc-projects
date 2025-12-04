#version 300 es
precision mediump float;

in vec2 CornerPos;
out vec4 fragColor;

uniform vec2 iResolution;
uniform float iTime;

uniform vec4 mode;
//uniform vec2 cursor;

#define CIRCLE_DISTANCE 10.0
#define CIRCLE_SIZE_MIN 0.3
#define CIRCLE_SIZE_MAX 0.6

#define ANIM_DURATION 20.0
#define DOT_ANIM_SPEED 2.0
#define DOT_COLOR_BASE ivec3(169, 62, 255)
const ivec3[] DOT_ACCENTS = ivec3[3](ivec3(0,0,0), ivec3(255,0,0), ivec3(0,255,0));
#define BG_COLOR ivec3(0,0,0)

#include "lygia/generative/random.glsl"
#include "lygia/generative/cnoise.glsl"
#include "lygia/animation/easing/cubic.glsl"
#include "lygia/animation/easing/sine.glsl"
#include "./utils/utils.glsl"
#include "./utils/animation.glsl"

float circleNoise(vec2 p, float t, float dist) {
    vec4 param = vec4(p, 0., 0.);

    param.z += cos(t*2.*3.1415926) * dist; // hack
    param.w += sin(t*2.*3.1415926) * dist; // using y+z as a pseudo-circle
    return cnoise(param);
}

float bgModeTime() {
    bool fromZero = roughly(mode[0], 0.);
    bool toZero = roughly(mode[1], 0.);

    if (!fromZero && !toZero) return mode.w;
    if (fromZero && toZero) return 0.;

    if (fromZero) return mode.z;
    else return mode.w-mode.z;
}
vec4 background() {
    float modeTime = bgModeTime();
    float bgAlpha = cubicOut(timed(modeTime, 0., 0.4));

    return vec4(vec3(BG_COLOR)/255.,bgAlpha);
}
vec4 circles(vec2 fragCoord) {
    mat2 skew = mat2(0.75, -0.25, 0.5, 1);
    vec2 pos = fragCoord * skew;
    vec2 circleIndex = pos-fract(pos);
    vec2 circleCoord = (fract((fragCoord * skew)/CIRCLE_DISTANCE) - 0.5) * 2.0;

    float dist = length(circleCoord);
    float intensity = 1.-clampDiv(dist, CIRCLE_SIZE_MIN, CIRCLE_SIZE_MAX);
    float perlinIntensity = clamp(intensity * circleNoise(circleIndex/300.0, fract(iTime/ANIM_DURATION), DOT_ANIM_SPEED), 0., 1.);

    //float colorAlpha = circleNoise(circleIndex/300.0 + vec2(51243.842178, 424.1789792), fract(iTime/ANIM_DURATION), DOT_ANIM_SPEED)/2.+0.5;

    //vec3 prevAccentColor = vec3(DOT_ACCENTS[clamp(int(lastMode), 0, DOT_ACCENTS.length())])/255.;
    //vec3 nextAccentColor = vec3(DOT_ACCENTS[clamp(int(currentMode), 0, DOT_ACCENTS.length())])/255.;
    //vec3 accentColor = mix(prevAccentColor, nextAccentColor, modeTime()/modeMaxDuration);

    vec3 baseColor = vec3(DOT_COLOR_BASE)/255.;
    //vec3 pickedColor = mix(baseColor, accentColor, colorAlpha);
    vec3 pickedColor = baseColor;

    float modeTime = bgModeTime();
    float alpha = cubicOut(timed(modeTime, 0.4, 0.8));

    //float cursorDistance = 1.-clamp(length(fragCoord-cursor)/100., 0., 1.);
    //pickedColor = mix(pickedColor,vec3(1,0,0), cursorDistance);

    return vec4(pickedColor, clamp(alpha * perlinIntensity, 0., 1.));
}
const float wMult = 3.;
const float[] widths = float[3](110.,  300.,  209.);
const float widthTotal =       (110. + 300. + 209.) * wMult;
vec4 rects(vec2 fragCoord) {
    float modeTime = bgModeTime();
    float overlayAlpha = cubicOut(timed(modeTime, 0., 0.4));
    float rectsOpenAlpha = cubicOut(timed(modeTime, 0.4, 2.));
    float rectsPushAlpha = sineInOut(mode.z/mode.w);

    mat2 skew = mat2(1, -1, 0, 1);
    //mat2 skew = mat2(1, 0, 0, 1);
    vec2 pos = fragCoord * skew;


    //float vertSplit = rand(float(index)*219.43518) * iResolution.y;
    //float vertSplit = rand(float(index)) * iResolution.y;
    float vertSplit = 0.5 * iResolution.y;
    if (pos.y > vertSplit) {
        pos.x += 0.5*widthTotal;
        pos.x += rectsPushAlpha * widthTotal*2. + widthTotal * (iTime/(ANIM_DURATION));
    } else {
        pos.x -= rectsPushAlpha * widthTotal*2. + widthTotal * (iTime/(ANIM_DURATION));
    }

    //int index = int(floor(pos.x/widthTotal)) * 5 + 100;
    int index = 0;
    float width = 0.;
    float slotCalc = mod(pos.x, widthTotal);
    for (int i = 0; i < 5; i++) {
        float w = widths[i] * wMult;
        if (w < slotCalc) {
            slotCalc -= w;
        } else {
            index += i;
            width = w;
            break;
        }
    }
    float x = slotCalc/width;

    float timeOffset = random(float(index)+20437.1539) * (ANIM_DURATION*0.25) + (pos.y > vertSplit ? ANIM_DURATION*0.125 : 0.);
    float t = fract((iTime+timeOffset)/(ANIM_DURATION*0.25));


    float sweepMin1 =
    t < 0.1 ? 1.01
    : t < 0.3 ? 1.-cubicIn((t-0.1)/0.2)
    : t < 0.6 ? -0.01
    : t < 0.8 ? cubicIn((t-0.6)/0.2)
    :           1.01;

    sweepMin1 = (sweepMin1) * 0.2 + 0.2;
    sweepMin1 *= rectsOpenAlpha;

    float sweepMin2 =
    t < 0.0 ? 1.01
    : t < 0.2 ? 1.-cubicIn((t-0.0)/0.2)
    : t < 0.7 ? -0.01
    : t < 0.9 ? cubicIn((t-0.7)/0.2)
    :           1.01;

    sweepMin2 = (sweepMin2) * 0.2 + 0.5;
    sweepMin2 *= rectsOpenAlpha;


    float b1min = min(sweepMin1, 0.2);
    float b1max = min(sweepMin1, 0.4);
    float b2min = min(sweepMin2, 0.5);
    float b2max = min(sweepMin2, 0.7);

    bool inside = (b1min < x && x < b1max) || (b2min < x && x < b2max);

    vec4 outputColor = inside
    ? vec4(vec3(0.8),0.1 * overlayAlpha)
    : vec4(vec3(0.05),0.8 * overlayAlpha);

    return outputColor;
}
void main()
{
    vec2 fragCoord = CornerPos;
    fragColor = background();
    fragColor = alphaMix(fragColor, circles(fragCoord));
    fragColor = alphaMix(fragColor, rects(fragCoord));

    // Standings
    /*
    vec4 srcPos = vec4(0.,0.,0.7046875,0.997222222);
    vec4 destPos = vec4(0.25,0.125,(vec2(1353,1077)/iResolution.xy)*((iResolution.y*0.75)/1077.));
    fragColor = alphaMix(fragColor, image(fragCoord, iChannel0, srcPos, destPos, 0.9));
    */

    // Camera
    //fragColor = alphaMix(fragColor, image(fragCoord, iChannel0, vec4(0,0,1,1), vec4(0.1,0.1,0.8,0.8), 1.));
}