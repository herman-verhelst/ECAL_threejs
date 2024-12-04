export class Fruit {
    static PINEAPPLE = new Fruit('pineapple');
    static PAPAYA = new Fruit('papaya');

    constructor(id) {
        this.id = id;
    }
}