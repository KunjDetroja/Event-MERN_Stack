const successresponse = (res, data, message) => {
  return res.status(200).json({ data: data, message: message, success: true });
};
const errorresponse = (res,status_code, message) => {
  return res.status(status_code).json({ error: message, success: false });
};
const catchresponse = (res) => {
  return res.status(500).json({ error: "Internal Server Error", success: false });
};


module.exports = {
  successresponse,
  errorresponse,
  catchresponse,
};