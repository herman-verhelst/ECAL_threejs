export default class CubeAnimator {
  constructor(params) {
    this.time = 0;
    this.animationSpeed = params.animationSpeed || 0.005;
    this.maxAmplitude = 3;
    this.amplitude = Math.min(
      params.amplitude || params.cubeSize,
      this.maxAmplitude
    );
    this.duration = params.duration || 80;
    this.phaseOffset = params.phaseOffset || 20;
    this.isAnimating = params.isAnimating || false;
    this.downwardOffset = params.downwardOffset || 3;

    // Add transition parameters
    this.transitionSpeed = 0.005;
    this.isTransitioning = false;
    this.transitionProgress = 0;

    // Add start animation parameters
    this.isStarting = false;
    this.startProgress = 0;
    this.startDuration = 1; // Duration in seconds for start animation
  }

  /**
   * Update animation state for all cubes
   */
  update(cubes, gridSize) {
    if (this.isAnimating) {
      if (this.isStarting) {
        // Handle start animation
        this.updateStartAnimation(cubes, gridSize);
      } else {
        // Handle regular animation
        this.updateAnimation(cubes, gridSize);
      }
      this.isTransitioning = false;
      this.transitionProgress = 0;
    } else if (this.isTransitioning || this.needsReset(cubes)) {
      // Handle transition back to initial position
      this.updateTransitionToInitial(cubes);
    }
  }

  /**
   * Check if any cube needs to return to initial position
   */
  needsReset(cubes) {
    return cubes.some(
      (cube) => Math.abs(cube.mesh.position.y - cube.initialY) > 0.01
    );
  }

  /**
   * Update the main animation
   */
  updateAnimation(cubes, gridSize) {
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

      // Calculate amplitude relative to cube height
      const cubeHeight = cube.mesh.geometry.parameters.height;
      const relativeAmplitude = Math.min(this.amplitude, cubeHeight * 0.5);

      // Add downward motion before going up
      const downwardMotion = Math.sin(progress * Math.PI) * this.downwardOffset;

      // Combine upward and downward motions
      cube.positionY =
        cube.initialY +
        Math.abs(relativeAmplitude * easedProgress) -
        downwardMotion;
    });
  }

  /**
   * Update transition to initial position
   */
  updateTransitionToInitial(cubes) {
    this.isTransitioning = true;

    // Even slower progression as we get closer to the end
    const slowdownFactor = Math.pow(1 - this.transitionProgress, 2);
    this.transitionProgress += this.transitionSpeed * slowdownFactor;

    // Clamp transition progress between 0 and 1
    this.transitionProgress = Math.min(this.transitionProgress, 1);

    cubes.forEach((cube) => {
      const currentY = cube.mesh.position.y;
      const targetY = cube.initialY;
      const newY = this.lerp(
        currentY,
        targetY,
        this.easeOutQuint(this.transitionProgress)
      );
      cube.positionY = newY;
    });

    // More forgiving completion threshold
    if (this.transitionProgress > 0.995) {
      this.isTransitioning = false;
      this.transitionProgress = 0;
      // Ensure cubes are exactly at their initial positions
      cubes.forEach((cube) => {
        cube.positionY = cube.initialY;
      });
    }
  }

  /**
   * Linear interpolation between two values
   */
  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  /**
   * Quartic easing for smoother stop transition
   */
  easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }

  /**
   * Cubic easing for start transition
   */
  easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  /**
   * Easing function for smooth animation
   */
  easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  /**
   * Toggle animation state
   */
  toggleAnimation(isAnimating) {
    if (this.isAnimating !== isAnimating) {
      this.isAnimating = isAnimating;
      if (isAnimating) {
        // Start the animation with easing
        this.isStarting = true;
        this.startProgress = 0;
      } else {
        // Start transition when animation is turned off
        this.isTransitioning = true;
        this.transitionProgress = 0;
      }
    }
  }

  /**
   * Update animation parameters
   */
  updateParams(params) {
    if (params.animationSpeed !== undefined)
      this.animationSpeed = params.animationSpeed;
    if (params.amplitude !== undefined)
      this.amplitude = Math.min(params.amplitude, this.maxAmplitude);
    if (params.duration !== undefined) this.duration = params.duration;
    if (params.phaseOffset !== undefined) this.phaseOffset = params.phaseOffset;
    if (params.downwardOffset !== undefined)
      this.downwardOffset = params.downwardOffset;
  }

  /**
   * Update the start animation
   */
  updateStartAnimation(cubes, gridSize) {
    this.startProgress += this.transitionSpeed;

    if (this.startProgress >= 1) {
      this.isStarting = false;
      this.startProgress = 0;
      return;
    }

    const startEase = this.easeOutCubic(this.startProgress);

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

      // Calculate amplitude relative to cube height
      const cubeHeight = cube.mesh.geometry.parameters.height;
      const relativeAmplitude = Math.min(this.amplitude, cubeHeight * 0.5);

      // Add downward motion before going up
      const downwardMotion = Math.sin(progress * Math.PI) * this.downwardOffset;

      // Combine upward and downward motions with start easing
      const animatedY =
        cube.initialY +
        Math.abs(relativeAmplitude * easedProgress) -
        downwardMotion;

      cube.positionY = this.lerp(cube.initialY, animatedY, startEase);
    });

    this.time += this.animationSpeed;
  }

  /**
   * Quintic easing for even smoother stop transition
   */
  easeOutQuint(x) {
    return 1 - Math.pow(1 - x, 5);
  }
}
