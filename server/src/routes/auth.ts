import { validate } from "class-validator";
import { Request, Response, Router } from "express";
import { User } from "../entities/User";

const mapError = (errors: Object[]) => {
    return errors.reduce((prev: any, err: any) => {
        prev[err.property] = Object.entries(err.constraints[0][1]);
        return prev;
    }, {});
};

const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    try {
        let errors: any = {};

        // 이메일과 유저이름이 이미 저장되어 있는지 확인
        const emailUser = await User.findOneBy({ email });
        const usernameUser = await User.findOneBy({ username });

        // 이미 있으면 errors 객체에 넣어줌
        if (emailUser) errors.email = "사용중인 이메일입니다";
        if (usernameUser) errors.username = "사용중인 username 입니다";

        // return error response
        if (Object.keys(errors).length > 0) return res.status(400).json(errors);

        const user = new User();
        user.email = email;
        user.username = username;
        user.password = password;

        // 엔티티에 정해놓은 조건으로 user 데이터의 유효성 검사
        errors = await validate(user);
        if (errors.length > 0) return res.status(400).json(mapError(errors));

        // 유저 정보를 user table에 저장
        await user.save();
        return res.json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err });
    }
};

const router = Router();
router.post("/register", register);

export default router;
