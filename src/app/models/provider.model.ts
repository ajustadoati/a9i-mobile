export class Provider {

    constructor(
        public name: string,
        public email: string,
        public mobile: string,
        public latitude: number,
        public longitude: number,

    ) { }


    static fromJson(json: any): Provider {
        return new Provider(json.nombre, json.email, json.telefono, json.latitud, json.longitud);
    }

}