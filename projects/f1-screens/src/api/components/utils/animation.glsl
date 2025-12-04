float timed(float time, float start, float end) {
    return clamp((time-start)/(end-start), 0., 1.);
}
bool roughly(float toTest, float target) {
    return abs(toTest-target) < 0.0001;
}