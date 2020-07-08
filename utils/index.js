const pad = (num) => (num > 9 ? '' : '0') + num;
const generator = (time, index) => {
  if (!time) return 'access.log';

  let month = time.getFullYear() + '' + pad(time.getMonth() + 1);
  let day = pad(time.getDate());
  let hour = pad(time.getHours());
  let minute = pad(time.getMinutes());

  return `${month}/${month}${day}-${hour}${minute}-${index}-access.log`;
};

module.exports = {
  pad,
  generator,
};
