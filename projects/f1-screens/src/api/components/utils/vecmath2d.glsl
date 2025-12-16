vec2 rotate2d(vec2 p, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(
    c * p.x - s * p.y,
    s * p.x + c * p.y
    );
}
vec2 rotateAround2d(vec2 p, vec2 center, float angle) {
    p -= center;
    p = rotate2d(p, angle);
    p += center;
    return p;
}