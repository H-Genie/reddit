import { Request, Response, NextFunction } from "express";
import { User } from "../entities/User";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: User | undefined = res.locals.user;

        if (!user) throw new Error("Unauthencatied");

        return next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: "Unauthencatied" });
    }
};
