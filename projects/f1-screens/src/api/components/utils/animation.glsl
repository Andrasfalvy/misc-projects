float timed(float time, float start, float end) {
    return clamp((time-start)/(end-start), 0., 1.);
}