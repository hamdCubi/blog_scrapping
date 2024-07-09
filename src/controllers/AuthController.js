const ErrorCode = require('../utils/ErrorCode');
const UserModel = require('../models/UserModel');
const bcrypt = require("bcrypt")
const SECRET = "THE Secret"
// const addNewUser = async (req, res) => {
//     try {
//         const { uid } = req.body;
//         const user = await verifyUID(uid);
//         console.log(user, "USAE ++++++++++++");

//         const ip = req.ip || req.connection.remoteAddress;
//         const country = await getCountryByIP(ip);
//         const userAgent = req.headers['user-agent'];
//         const deviceUniqueId = req.headers.deviceuniqueid;

//         if (!country) {
//             return res.status(500).json({ message: 'Unable to determine country from IP address' });
//         }

//         const userId = await UserModel.create(user.providerData[0].UserInfo?.displayName, user.email, country, uid, user.providerData[0].UserInfo?.providerId);

//         const authToken = generateAuthToken();
//         await UserModel.logDevice(userId, req.headers.devicemodel, ip, authToken, userAgent, deviceUniqueId);
//         const newUser = await UserModel.findById(userId);
//         res.status(201).json({ message: 'User registered successfully', authToken, user: newUser });
//     } catch (error) {
//         if (error.code === 'ER_DUP_ENTRY' || error.sqlMessage?.includes('Duplicate entry')) {
//             return res.status(409).json({ message: 'This email is already registered' });
//         }
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// const login = async (req, res) => {
//     try {
//         const { uid } = req.body;
//         const verify = await verifyUID(uid)
//         const userAgent = req.headers['user-agent'];
//         const deviceUniqueId = req.headers['deviceuniqueid'];
//         const user = await UserModel.getUserByUid(uid);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         const authToken = generateAuthToken();
//         await UserModel.logDevice(user.id, req.headers.devicemodel, req.ip, authToken, userAgent, deviceUniqueId);

//         res.status(200).json({ message: 'Login successful', authToken, user });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

const joinUser = async (req, res) => {
    try {
        const { email , password } = req.body;
        console.log(req.body)

        let user = await UserModel.findByEmail(email);

        if (!user) {
            return res.status(401).send( "Incorrect email" );
          }
          console.log(user)
          
        const isMatch = await bcrypt.compare(password, user.password);

      
        if(!isMatch){ 
            return res.status(400).send("incorrect Password")
        }
        const token = jwt.sign({
            _id: user._id,
            email: user.email,
            iat: Math.floor(Date.now() / 1000) - 30,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            role:user.role
        }, SECRET);
  
        // res.send(token);
  
        res.cookie('token', token, {
            maxAge: 86_400_000,
            httpOnly: true,
            
        });
            res.status(200).json({
                success: true,
                message: "User Logged In Successfully",
                type: "login",
                data: {
                    id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
                }
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errorCode: ErrorCode.SERVER_ERROR, message: 'Server error', error: error.message });
    }
};

module.exports = { joinUser };
