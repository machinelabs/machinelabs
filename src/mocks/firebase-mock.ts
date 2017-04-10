export class FirebaseMock {
  log = [];
  data = {};

  mockDb() {
    return new FireBaseDbMock(this);
  }
}


export class FireBaseDbMock {

  constructor(private fbMock: FirebaseMock) {}

  ref(ref: string) { 
    return new FirebaseDbRefMock(this.fbMock, ref);
  }
}

export class FirebaseDbRefMock {

  constructor(private fbMock: FirebaseMock, private ref: string) {}

  set(data: any) {
    this.fbMock.data[this.ref] = data;
    return Promise.resolve(new FirebaseDataSnapshotMock(this.fbMock, data))
  }

  once(eventType: string) {
    return Promise.resolve(new FirebaseDataSnapshotMock(this.fbMock, this.fbMock.data[this.ref]))
  }
}

export class FirebaseDataSnapshotMock {

  constructor(private fbMock: FirebaseMock, private data: any) {}

  val() {
    return this.data  || null;
  }
}
