export default function validatePostTreeAdoptions(req) {
  const { id, common, email, nickname, request } = req.body;
  if (id === undefined) return false;
  if (common === undefined) return false;
  if (email === undefined) return false;
  if (nickname === undefined) return false;
  if (request.type === undefined) return false;

  return true;
}
