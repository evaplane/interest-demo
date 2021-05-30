import { Observable, Subscriber } from 'rxjs';
export default class Emiter {
    observers: Map<string, Array<Subscriber<any>>>;
    constructor();
    on(topic: string): Observable<any>;
    emit(topic: string, data?: any): void;
}
