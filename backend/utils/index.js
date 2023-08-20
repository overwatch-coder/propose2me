//create url depending on env
const frontend_url =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : process.env.FRONTEND_URL;

module.exports = {
    frontend_url
}