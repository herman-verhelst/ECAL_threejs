export default class CubeAnimator {
  constructor(params) {
    this.time = 0;
    this.animationSpeed = params.animationSpeed || 0.005;
    this.amplitude = params.amplitude || params.cubeSize;
    this.duration = params.duration || 80;
    this.phaseOffset = params.phaseOffset || 20;
    this.isAnimating = params.isAnimating || false;
  }

  /**
   * Update animation state for all cubes
   */
  update(cubes, gridSize) {
    if (!this.isAnimating) return;

    this.time += this.animationSpeed;

    cubes.forEach((cube, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;

      const phase = (row + col) * this.phaseOffset;
      let progress =
        ((this.time * 100 + phase) % this.duration) / this.duration;

      if (progress > 0.5) {
        progress = 1 - (progress - 0.5) * 2;
      } else {
        progress = progress * 2;
      }

      const easedProgress = this.easeOutBack(progress);
      cube.positionY = cube.initialY + this.amplitude * easedProgress;
    });
  }

  /**
   * Reset animation to initial state
   */
  reset(cubes) {
    cubes.forEach((cube) => {
      cube.positionY = cube.initialY;
    });
  }

  /**
   * Toggle animation state
   */
  toggleAnimation(isAnimating) {
    this.isAnimating = isAnimating;
  }

  /**
   * Update animation parameters
   */
  updateParams(params) {
    if (params.animationSpeed !== undefined)
      this.animationSpeed = params.animationSpeed;
    if (params.amplitude !== undefined) this.amplitude = params.amplitude;
    if (params.duration !== undefined) this.duration = params.duration;
    if (params.phaseOffset !== undefined) this.phaseOffset = params.phaseOffset;
  }

  /**
   * Easing function for smooth animation
   */
  easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }
}
