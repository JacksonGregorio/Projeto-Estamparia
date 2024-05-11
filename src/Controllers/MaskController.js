import Mask from "../Models/Mask.js";
import multer from 'multer';
import bucket from '../Config/dbFireConnection.js';
import ProductServices from "../Services/ProductServices.js";

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

class MaskController{

  static upload = upload;

  static listMasks = async (req, res) => {
    try {
        const masks = await Mask.find();
        res.status(200).json(masks);
    } catch (err) {
        res.status(500).json(err);
    }
  }

  static getMask = async (req, res) => {
    try {
        const mask = await Mask.findById(req.params.id);
        res.status(200).json(mask);
    } catch (err) {
        res.status(500).json(err);
    }
  }

  static updateMask = async (req, res) => {
    try {
        const mask = await Mask.findById(req.params.id);
        if (!mask) {
            return res.status(404).json({ message: 'Mask not found' });
        }

        const updatedMask = await Mask.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json(updatedMask);
    } catch (err) {
        res.status(500).json(err);
    }
  }

  static deleteMask = async (req, res) => {
    try {
        const mask = await Mask.findById(req.params.id);
        if (!mask) {
            return res.status(404).json({ message: 'Mask not found' });
        }
        const imageDeleted = await ProductServices.deleteMaskByIdImages(req.params.id);
        if (!imageDeleted) {
          return res.status(404).json({ message: 'Failed to delete order' });
        }
        await Mask.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Mask deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  static getMasksBy = async (req, res) => {
    const query = {};

    for (let key in req.body) {
        if (Mask.schema.paths[key]) {
            query[key] = req.body[key];
        }
    }

    const masks = await Mask.find(query);

    res.send(masks);
  }

  static getMasksByCategory = async (req, res) => {
    const mask_Categories = req.params.categorie;
  
    if(!mask_Categories){
      return res.status(422).json({message: "Category is required"})
    }
  
    const masks = await Mask.find({mask_Categories: mask_Categories});
  
    res.send(masks);
  }

  static createMask = async (req, res) => {
    const { mask_Type, mask_Price, mask_Description, mask_Available, mask_Shirt_Colar, mask_Shirt_Cloth, 
      mask_Categories, mask_Sewing, mask_Name } = req.body;

    if(!mask_Type || !mask_Price || !mask_Description || !mask_Available || !mask_Categories || !mask_Name){
      return res.status(422).json({message: "All fields are required"})
    }

    const newMask = new Mask({
      mask_Type,
      mask_Price,
      mask_Name,
      mask_Description,
      mask_Available,
      mask_Shirt_Colar,
      mask_Shirt_Cloth,
      mask_Categories,
    });

    try {
      const savedMask = await newMask.save();

      const destinationImage = 'Estamparia/Mask' + savedMask._id.toString();

      const blobImage = bucket.file(destinationImage);
      const streamImage = blobImage.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });
      streamImage.end(req.file.buffer);
      const config = {
        action: 'read',
        expires: '03-09-2491',
      };

      blobImage.getSignedUrl(config, async (err, urlImage) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        savedMask.mask_Image = urlImage;

        try {
          const updatedMask = await savedMask.save();
          res.send(updatedMask);
        } catch (err) {
          console.error(err);
          res.status(400).send(err);
        }
      });
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  }
}

export default MaskController;