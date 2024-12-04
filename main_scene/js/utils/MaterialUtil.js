export function setMaterial(model) {
    model.object.traverse((child) => {
        if (child.isMesh) {
            if (model.material) {
                child.material = model.material
            }
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
}