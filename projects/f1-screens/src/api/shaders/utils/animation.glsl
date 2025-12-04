float timed(float time, float start, float end) {
    return clamp((time-start)/(end-start), 0., 1.);
}
const float modeMaxDuration = 2.;
float modeTime() {
    return clamp(iTime - modeSwitchTime, 0., modeMaxDuration);
}