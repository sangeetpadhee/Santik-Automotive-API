import { Router } from 'express'
import { Login, Register } from '../Controllers/UserController.js'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid';

const router = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './Uploads')
    },
    filename: function (req, file, cb) {
     const random = uuidv4();
      cb(null,  random+ " " + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

router.post('/Register',upload.single('profileImg'), Register)
router.post('/Login', Login)

export default router