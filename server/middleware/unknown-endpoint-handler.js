export default function unknownEndpointHandler(req, res) {
  res
    .status(404)
    .send({ error: `Unknown endpoint: ${req.method} ${req.path}` });
}
