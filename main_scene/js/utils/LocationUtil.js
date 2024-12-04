export function setLocation(props, threeJsObject, mirrored = false) {
    const position = props.position;
    const scale = props.scale;
    const rotation = props.rotation;

    threeJsObject.position.set(mirrored ? position.z : position.x, position.y, mirrored ? position.x : position.z)
    threeJsObject.scale.set(mirrored ? -scale.x : scale.x, scale.y, scale.z)
    threeJsObject.rotation.set(rotation.x, mirrored ? rotation.y - Math.PI / 2 : rotation.y, rotation.z)

}