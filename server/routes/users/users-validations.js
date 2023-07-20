function validatePostUser(req) {
  const { name, email, nickname } = req.body;

  if (name === undefined) return false;
  if (email === undefined) return false;
  if (nickname === undefined) return false;

  return true;
}
export default validatePostUser;
