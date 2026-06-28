import multer from 'multer';
import path from 'path';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (['.xlsx', '.xls'].includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only .xlsx / .xls allowed'));
    }
  },
});

export default upload;
