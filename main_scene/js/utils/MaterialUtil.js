import * as THREE from "three";

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


export function setEmissiveMaterial(model, color, intensity = 10) {
    model.material = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: intensity
    });
    model.castShadow = true;
    model.receiveShadow = true;
}
