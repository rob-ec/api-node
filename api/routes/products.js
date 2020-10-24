const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (request, file, callBack) => {
        callBack(null, './uploads/');
    },
    filename: (request, file, callBack) => {
        callBack(null, new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (request, file, callBack) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callBack(null, true);
    } else {
        callBack(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/products');

router.get('/', ProductsController.products_get_all);
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create);
router.get('/:id', ProductsController.products_get_by_id);
router.patch('/:id', checkAuth, ProductsController.products_update);
router.delete('/:id', checkAuth, ProductsController.products_delete);

module.exports = router;