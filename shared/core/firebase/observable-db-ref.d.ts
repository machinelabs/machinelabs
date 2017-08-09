import { Observable } from '@reactivex/rxjs';
import * as firebase from 'firebase';
export declare class ObservableDbRef {
    ref: any;
    constructor(ref: any);
    limitToLast(limit: number): ObservableDbRef;
    limitToFirst(limit: number): ObservableDbRef;
    orderByChild(value: any): ObservableDbRef;
    startAt(value: any, key?: any): ObservableDbRef;
    endAt(value: any, key?: any): ObservableDbRef;
    once(eventType: string): Observable<firebase.database.DataSnapshot>;
    onceValue(): Observable<firebase.database.DataSnapshot>;
    set(data: any): Observable<firebase.database.DataSnapshot>;
    update(data: any): Observable<firebase.database.DataSnapshot>;
    childAdded(): Observable<firebase.database.DataSnapshot>;
    childChanged(): Observable<firebase.database.DataSnapshot>;
    value(): Observable<firebase.database.DataSnapshot>;
    on(eventName: string): Observable<firebase.database.DataSnapshot>;
}
