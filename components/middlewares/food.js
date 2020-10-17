const multer = require('multer');
const Food = require('./../foods');
const AppError = require('../../utils/appError');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/foods')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const filename = `food-${req.body.name.split(' ').join('-')}-${Date.now()}.${ext}`;
        cb(null, filename);
    }
});

const filtered = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('only image types are allowed, please provide an image', 400), false);
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: filtered
})

exports.imageUpload = upload.single('photo');

exports.foundAndSetFood = async (req, res, next, id) => {
    try {
        const food = await Food.findById(id);
        if (!food) return next(new AppError('food with that name not found', 404));

        req.food = food;
        next();
    } catch (err) {
        next(err);
    }
}
