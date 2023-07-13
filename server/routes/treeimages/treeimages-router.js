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

//Change the route to 'idk' just change from filenumber
treeimagesRouter.get('/treeimage/:filenumber', async (req, res) => {
  const { idImage, tree_images } = req.query;

  if (!idImage && tree_images === 'All') {
    let foundImages = await getAllImages();
    if (!foundImages || foundImages.length === 0)
      throw new AppError(400, 'Error getting Images');
    res.status(200).json(foundImages);
  }

  if (idImage) {
    const responseImage = await getImageById(idImage);
    if (!responseImage) throw new AppError(400, 'Error getting Image');
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
