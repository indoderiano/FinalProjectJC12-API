const multer=require('multer')
const fs=require('fs')

// Return multer object

module.exports = {
    uploader(destination, fileNamePrefix){
        let defaultPath = './public';

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const dir = defaultPath + destination;
                if (fs.existsSync(dir)) {
                    console.log(dir, "exists")
                    cb(null, dir);
                } else {
                    fs.mkdir(dir,{recursive:true}, err => cb(err, dir));
                    console.log(dir, "make")
                }
            },
            filename: (req, file, cb) => {
                console.log(file)
                // console.log('req')
                // console.log(req.body)
                let originalname = file.originalname;
                let ext = originalname.split('.');
                // console.log('ext')
                // console.log(ext)
                let filename = fileNamePrefix + Date.now() + '.' + ext[ext.length - 1];
                cb(null, filename);
            }
        });
    
        const imageFilter = (req, file, callback) => {
            const ext = /\.(jpg|jpeg|png|gif|pdf|doc|docx|xlsx)$/;
            if (!file.originalname.match(ext)) {
                return callback(new Error('Only selected file type are allowed'), false);
            }
            callback(null, true);
        };

        return multer({
            storage: storage,
            fileFilter: imageFilter
        });
    }
}