import { Request, Response, NextFunction } from "express";
import { User } from "../entities/User";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        if (!token) return next();

        const { username }: any = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOneBy({ username });

        if (!user) throw new Error("Unauthenticated");

        res.locals.user = user;
    } catch (err) {
        console.log(err);
        return res.status(400).json({ err });
    }
};
