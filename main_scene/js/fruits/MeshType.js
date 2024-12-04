export class MeshType {
    static TOP = new MeshType('top');
    static BOTTOM = new MeshType('bottom');
    static ANIMATION = new MeshType('animation');

    constructor(id) {
        this.id = id;
    }
}