import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import { isEmpty } from "class-validator";
import { AppDataSource } from "../data-source";
import Sub from "../entities/Sub";

const createSub = async (req: Request, res: Response, next: NextFunction) => {
    const { name, title, description } = req.body;

    try {
        let errors: any = {};
        if (isEmpty(name)) errors.name = "이름을 입력해주세요";
        if (isEmpty(title)) errors.title = "제목을 입력해주세요";

        const sub = await AppDataSource.getRepository(Sub).createQueryBuilder("sub").where("lower(sub.name) = :name", { name: name.toLowerCase() }).getOne();

        if (sub) errors.name = "서브가 이미 존재합니다";

        if (Object.keys(errors).length > 0) throw errors;
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err });
    }

    try {
        const user: User = res.locals.user;

        const sub = new Sub();
        sub.name = name;
        sub.description = description;
        sub.title = title;
        sub.user = user;

        await sub.save();
        return res.json(sub);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err });
    }
};

const router = Router();

router.post("/", userMiddleware, authMiddleware, createSub);

export default router;
