const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDFs are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 3,
    fileSize: 5 * 1024 * 1024, // 5MB max per file
  },
});

module.exports = upload;
