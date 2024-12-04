export function setLocation(props, threeJsObject) {
    const position = props.position;
    const scale = props.scale;
    const rotation = props.rotation;

    threeJsObject.position.set(position.x, position.y, position.z)
    threeJsObject.scale.set(scale.x, scale.y, scale.z)
    threeJsObject.rotation.set(rotation.x, rotation.y, rotation.z)

}