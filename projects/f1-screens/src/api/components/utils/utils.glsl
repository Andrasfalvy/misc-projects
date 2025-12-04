vec4 image(vec2 fragCoord, sampler2D s, vec4 srcPos, vec4 destPos, float opacity) {
    vec2 screenPos = fragCoord / iResolution.xy;

    vec2 size = vec2(textureSize(s, 0));

    vec2 coord = (screenPos-destPos.xy) / destPos.zw;
    if (coord.x < 0. || 1. < coord.x
    || coord.y < 0. || 1. < coord.y) return vec4(0.);

    vec4 color = texture(s, srcPos.xy + srcPos.zw*coord);
    color.a *= opacity;
    return color;
}
vec4 image(vec2 fragCoord, sampler2D s, vec4 srcPos, vec4 destPos) {
    return image(fragCoord, s, srcPos, destPos, 1.);
}

float clampDiv(float x, float min, float max) {
    if (x <= min) return 0.0;
    if (x >= max) return 1.0;
    return (x-min)/(max-min);
}
vec4 alphaMix(vec4 bottom, vec4 top) {
    bottom = clamp(bottom, 0., 1.);
    top = clamp(top, 0., 1.);
    float outA = top.a + bottom.a * (1.0 - top.a);

    // Prevent divide-by-zero
    if (outA < 1e-6) return vec4(0.0);

    vec3 outRGB = (top.rgb * top.a + bottom.rgb * bottom.a * (1.0 - top.a)) / outA;

    return vec4(outRGB, outA);
}
vec2 rotate(vec2 p, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(
        c * p.x - s * p.y,
        s * p.x + c * p.y
    );
}
vec2 rotateAround(vec2 p, vec2 center, float angle) {
    p -= center;
    p = rotate(p, angle);
    p += center;
    return p;
}
bool roughly(float toTest, float target) {
    return abs(toTest-target) < 0.0001;
}