const User = require('../models/userdetails');


exports.createUser = async (req, res) => {
    try {
        const { username, email, phone } = req.body;
        const userProfile = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.png';
        
        const newUser = new User({
            username,
            email,
            phone,
            userProfile
        });

        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error saving user' });
    }
};


exports.renderUsersPage = async (req, res) => {
    try {
        const page = 1;
        const limit = 5; 

        const skip = (page - 1) * limit;
        const users = await User.find().skip(skip).limit(limit);
        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);

        
        res.render('index', {
            users,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error rendering the users page' });
    }
};



exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 5;  
        const search = req.query.search || '';         
        const skip = (page - 1) * limit;              
        // console.log('search:', search);
        
        
        const query = search
            ? {
                $or: [
                    { username: { $regex: search, $options: 'i' } },  
                    { email: { $regex: search, $options: 'i' } },      
                    { phone: { $regex: search, $options: 'i' } }     
                ]
            }
            : {};  
        // console.log('query:', query);
       
        const users = await  User.find(query?query:{}).skip(skip).limit(limit).exec();
        
        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);
        
        
       
        res.json({
            users,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};




exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
};


exports.editUser = async (req, res) => {
    try {
        const { username, email, phone } = req.body;
        const userProfile = req.file ? `/uploads/${req.file.filename}` : undefined;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, phone, ...(userProfile && { userProfile }) },
            { new: true }
        );

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};
