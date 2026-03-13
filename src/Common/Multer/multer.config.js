import multer from "multer";
import { randomUUID } from "crypto";
import { existsSync, mkdirSync } from "fs";
import path from "path";
// const upload= multer({dest:"tmp/"})

// export default upload;

export const allowFileFormat = {
  img: ["image/png", "image/jpg", "image/jpeg"],
  video: ["video/mp4"],
  pdf: ["application/pdf"],
};

export function localUpload({
  folderName = "GeneralFiles",
  allowedFormat = allowFileFormat.img,
}) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const fullPath = `./uploads/${folderName}`;
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
      }
      cb(null, path.resolve(fullPath));
    },
    filename: function (req, file, cb) {
      const fileName = randomUUID() + "_" + file.originalname;
      file.finalPath = `uploads/${folderName}/${fileName}`;
      cb(null, fileName);
    },
  });

  function fileFilter(req, file, cb) {
    if (!allowedFormat.includes(file.mimetype)) {
      return cb(new Error("Invalid format"), false);
    }

    return cb(null, true);
  }

  return multer({ storage: storage, fileFilter: fileFilter, limits:{fileSize:10*1024*1024} });
}
