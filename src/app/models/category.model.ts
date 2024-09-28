export class Category {

    constructor(
        public id: string,
        public name: string,
        public description: string
    ) { }


    static fromJson(json: any): Category {
        return new Category(json.id, json.nombre, json.descripcion);
    }

}