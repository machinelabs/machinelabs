"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("@reactivex/rxjs");
var ObservableDbRef = (function () {
    function ObservableDbRef(ref) {
        this.ref = ref;
    }
    ObservableDbRef.prototype.limitToLast = function (limit) {
        return new ObservableDbRef(this.ref.limitToLast(limit));
    };
    ObservableDbRef.prototype.limitToFirst = function (limit) {
        return new ObservableDbRef(this.ref.limitToFirst(limit));
    };
    ObservableDbRef.prototype.orderByChild = function (value) {
        return new ObservableDbRef(this.ref.orderByChild(value));
    };
    ObservableDbRef.prototype.startAt = function (value, key) {
        return new ObservableDbRef(this.ref.startAt(value, key));
    };
    ObservableDbRef.prototype.endAt = function (value, key) {
        return new ObservableDbRef(this.ref.endAt(value, key));
    };
    ObservableDbRef.prototype.once = function (eventType) {
        return rxjs_1.Observable.fromPromise(this.ref.once(eventType));
    };
    ObservableDbRef.prototype.onceValue = function () {
        return this.once('value');
    };
    ObservableDbRef.prototype.set = function (data) {
        return rxjs_1.Observable.fromPromise(this.ref.set(data));
    };
    ObservableDbRef.prototype.update = function (data) {
        return rxjs_1.Observable.fromPromise(this.ref.update(data));
    };
    ObservableDbRef.prototype.childAdded = function () {
        return this.on('child_added');
    };
    ObservableDbRef.prototype.childChanged = function () {
        return this.on('child_changed');
    };
    ObservableDbRef.prototype.value = function () {
        return this.on('value');
    };
    ObservableDbRef.prototype.on = function (eventName) {
        var _this = this;
        return rxjs_1.Observable.fromEventPattern(function (handler) { return _this.ref.on(eventName, handler); }, function (handler) { return _this.ref.off(eventName, handler); });
    };
    return ObservableDbRef;
}());
exports.ObservableDbRef = ObservableDbRef;
//# sourceMappingURL=observable-db-ref.js.map