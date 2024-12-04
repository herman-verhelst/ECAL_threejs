import * as THREE from "three";

export const materials = {
    glass: new THREE.MeshStandardMaterial({
        metalness: .9,
        roughness: .05,
        envMapIntensity: 0.9,
        clearcoat: 1,
        transparent: true,
        // transmission: .95,
        opacity: .5,
        reflectivity: 0.2,
        refractionRatio: 0.985,
        ior: 0.9,
        side: THREE.BackSide,
    }),
    floor: new THREE.MeshStandardMaterial({
        color: '#e6810b',
    }),
    plate: new THREE.MeshStandardMaterial({
        color: '#edc493',
    })
}
