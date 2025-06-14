import express from 'express';
import multer from 'multer';
import {methods as imagesController} from "../controllers/images.controller.js";  
const router = express.Router();
const upload = multer({ dest: 'public/uploads' });

router.get('/', imagesController.getImages);
router.get('/images', imagesController.getImages);
router.get('/images/upload',imagesController.getImageForm);
router.post('/images/create', upload.single('file'),imagesController.createImage);
router.post('/images/update',imagesController.updateImage);
router.post('/images/remove',imagesController.removeImage);



export default router;