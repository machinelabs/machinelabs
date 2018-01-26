import 'jest';
import * as targaryen from 'targaryen';

export const canRead = () => {
  return {
    compare: (auth, path, now) => {
      const data = targaryen.util.getFirebaseData().as(auth);
      const result = data.read(path, now);

      return {
        pass: result.allowed === true,
        message: targaryen.util.unreadableError(result)
      };
    }
  };
};

export const cannotRead = () => {
  return {
    compare: (auth, path, now) => {
      const data = targaryen.util.getFirebaseData().as(auth);
      const result = data.read(path, now);

      return {
        pass: result.allowed === false,
        message: targaryen.util.readableError(result)
      };
    }
  };
};

export const canWrite = () => {
  return {
    compare: (auth, path, newData, now) => {
      const data = targaryen.util.getFirebaseData().as(auth);
      const result = data.write(path, newData, undefined, now);

      return {
        pass: result.allowed === true,
        message: targaryen.util.unwritableError(result)
      };
    }
  };
};

export const cannotWrite = () => {
  return {
    compare: (auth, path, newData, now) => {
      const data = targaryen.util.getFirebaseData().as(auth);
      const result = data.write(path, newData, undefined, now);

      return {
        pass: result.allowed === false,
        message: targaryen.util.writableError(result)
      };
    }
  };
};

export const canPatch = () => {
  return {
    compare: (auth, path, newData, now) => {
      const data = targaryen.util.getFirebaseData().as(auth);
      const result = data.update(path, newData, now);

      return {
        pass: result.allowed === true,
        message: targaryen.util.unwritableError(result)
      };
    }
  };
};

export const cannotPatch = () => {
  return {
    compare: (auth, path, newData, now) => {
      const data = targaryen.util.getFirebaseData().as(auth);
      const result = data.update(path, newData, now);

      return {
        pass: result.allowed === false,
        message: targaryen.util.writableError(result)
      };
    }
  };
};
