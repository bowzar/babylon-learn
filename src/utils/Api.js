import { Api as _Api } from "@yulintu/freesia-requests";

export default class Api extends _Api {

    static apiPrefix = '/api';

    static getByName(name) {
        return this.getJson("/get/by/name", {
            name
        });
    }
}