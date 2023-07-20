export default function validateGetTreeId(req) {
  const { common, scientific, genus, sourceId, lat, lng } = req.body;
  const genusScientific = scientific || genus;
  if (common === undefined) return false;
  if (genusScientific === undefined) return false;
  if (sourceId === undefined) return false;
  if (lat === undefined) return false;
  if (lng === undefined) return false;

  return true;
}
