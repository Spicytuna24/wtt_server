export default function validateImage(req) {
    if (!req?.body) return false;
    const {  treeimages = null } = req.body;
    if (treeimages) {
      if (treeimages?.idImage === undefined) return false;
    }
  
    return true;
  }
  