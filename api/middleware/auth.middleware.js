import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js';

export const validateAccessToken = (req, res, next) => {
    // const authHeader = req.header('Authorization');
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //     return res
    //         .status(401)
    //         .json({ message: "Access token not provided or invalid format" });
    // }

    // const accessToken = authHeader.split(' ')[1];

    const accessToken = req.header('Authorization');

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: "expired access token,please refresh" });
            }
            return res.status(403).json({ message: "invalid token" });
        }
        req.user = decoded.user; // Attach decoded user info to the request
        next();
    });
};

export const validateRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
        return res
            .status(401)
            .json({ message: "Refresh token not provided" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(400).json({ message: "expired refresh token,please login again" });
            }
            return res.status(403).json({ message: "invalid token,login again" });
        }
        req.user = decoded.user; // Attach decoded user info to the request
        req.refreshToken = refreshToken; // Attach the refresh token to the request
        next();
    });
};

export const findUserByEmail = async (req, res, next) => {
    try {
        const email = req.user.email; // Assuming email is in the decoded token
        const user = await User.findOne({ email: email });

        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found" });
        }
        req.foundUser = user; // Attach the found user to the request
        next();
    } catch (error) {
        console.error("Error finding user:", error);
        return res.status(500).send("Internal server error");
    }
};

export const verifyRefreshTokenInDB = (req, res, next) => {
    if (req.foundUser.refreshToken !== req.refreshToken) {
        return res
            .status(401)
            .json({ message: "Invalid refresh token" });
    }
    next();
};