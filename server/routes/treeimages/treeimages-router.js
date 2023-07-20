import express from 'express';
import AppError from '../../errors/AppError.js';
import {
  createImage,
  deleteImage,
  getAllImages,
  getImageById,
} from './treeimages-queries';
import validatePostTreeLikes from './treeimages-validations';
import { create } from 'domain';

const treeimagesRouter = express.Router();

//TODO change URL
treeimagesRouter.get('/treeimage/:filenumber', async (req, res) => {
  const { idImage,id,treeImages } = req.query;

  if (!idImage && treeImages === 'All') {
    let foundImages = await getAllImages();
    if (!foundImages || foundImages.length === 0)
      throw new AppError(400, 'Error getting Images');
    res.status(200).json(foundImages);
  }

  if (idImage && id) {
    const responseImage = await getImageById(idImage && id);
    if (!responseImage || !id) throw new AppError(400, 'Error getting Image');
    res
      .status(200)
      .json({ tree_images: responseImage });
  }
});

treeimagesRouter.post('/treeimage', async (req, res) => {
  const validated = await validateImage(req);
  if (!validated) throw new AppError(400, 'Error validating images');

  const { treeimages = null } = req.body;
  let postImage;
  if (treeimages) {
    postImage = await createImage(treeimages);
    if (!postImage) throw new AppError(400, 'Error creating image');
  }

  const response = { source: postImage };
  res.status(200).json(response);
});