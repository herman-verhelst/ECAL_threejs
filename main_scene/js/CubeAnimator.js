export default class CubeAnimator {
  constructor(params) {
    this.time = 0;
    this.animationSpeed = params.animationSpeed || 0.005;
    this.amplitude = Math.min(params.amplitude || params.cubeSize, 3);
    this.phaseOffset = params.phaseOffset || 20;
    this.downwardOffset = params.downwardOffset || 3;
    this.isAnimating = params.isAnimating || false;
  }

  update(cubes, gridSize) {
    if (!this.isAnimating) {
      this.resetCubes(cubes);
      return;
    }

    this.time += this.animationSpeed;
    this.animateCubes(cubes, gridSize);
  }

  resetCubes(cubes) {
    cubes.forEach((cube) => {
      if (!cube.isPressed && !cube.isTransitioning) {
        cube.positionY = cube.initialY;
      }
    });
  }

  animateCubes(cubes, gridSize) {
    cubes.forEach((cube, index) => {
      if (cube.isPressed || cube.isMoving || cube.isTransitioning) return;
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      const phase = (row + col) * this.phaseOffset;
      // Calculate wave motion
      const wave = Math.sin(this.time * 2 + phase / 10);
      const height = this.amplitude * wave;
      // Add downward motion
      const downwardMotion =
        Math.sin(this.time * 2 + phase / 10) * this.downwardOffset;
      // Combine upward and downward motions
      cube.positionY = cube.initialY + height - Math.abs(downwardMotion);
    });
  }

  toggleAnimation(isAnimating) {
    this.isAnimating = isAnimating;
  }

  updateParams(params) {
    if (params.animationSpeed !== undefined) {
      this.animationSpeed = params.animationSpeed;
    }
    if (params.amplitude !== undefined) {
      this.amplitude = Math.min(params.amplitude, 3);
    }
    if (params.phaseOffset !== undefined) {
      this.phaseOffset = params.phaseOffset;
    }
    if (params.downwardOffset !== undefined) {
      this.downwardOffset = params.downwardOffset;
    }
    this.isAnimating = params.isAnimating;
  }
}
