export function setMaterialOnLoadedModels(model) {
    model.object.traverse((child) => {
        if (child.isMesh) {
           setMaterial(child, model.material)
        }
    });
}

export function setMaterial(model, material = undefined) {
    if (material) {
        model.material = material
    }
    model.castShadow = true;
    model.receiveShadow = true;
}
