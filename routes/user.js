const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController'); 
const router = express.Router();

const upload = multer({ dest: 'public/uploads/' }); 


router.post('/', upload.single('userProfile'), userController.createUser);

router.get('/', userController.renderUsersPage);

router.get('/api/users', userController.getAllUsers);

router.get('/:id', userController.getUserById);

router.put('/:id', upload.single('userProfile'), userController.editUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;
