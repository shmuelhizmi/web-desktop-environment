export default (toCheck: () => boolean, everyXSec: number) => {
  return new Promise((resolve) => {
    const check = () => {
      if (toCheck()) {
        resolve();
      } else {
        setTimeout(check, everyXSec);
      }
    };
    check();
  });
};
