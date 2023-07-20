export default function validateSource(req) {
  if (!req?.body) return false;
  const { crosswalk = null, source = null } = req.body;
  if (source) {
    if (source?.idSourceName === undefined) return false;
  }
  if (crosswalk) {
    if (crosswalk?.idSourceName === undefined) return false;
  }

  return true;
}
