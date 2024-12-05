export class Fruit {
    static PINEAPPLE = new Fruit('pineapple');
    static PAPAYA = new Fruit('papaya');
    static KAKI = new Fruit('kaki');
    static ORANGE = new Fruit('orange');
    static MANDARINE = new Fruit('mandarine');
    static MANGO = new Fruit('mango');

    constructor(id) {
        this.id = id;
    }
}