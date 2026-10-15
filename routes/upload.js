const express = require('express');
const multer = require('multer');
const { extractText } = require('../services/pdfService');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

router.post('/upload-pdf', (req, res) => {
  upload.single('pdf')(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded. Use the field name "pdf".' });
    try {
      const { text, pages } = await extractText(req.file.buffer);
      res.json({ fileName: req.file.originalname, pages, text });
    } catch (e) {
      res.status(422).json({ error: e.message });
    }
  });
});

module.exports = router;