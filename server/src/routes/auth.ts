import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const mapError = (errors: Object[]) => {
    return errors.reduce((prev: any, err: any) => {
        prev[err.property] = Object.entries(err.constraints)[0][1];
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

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        let errors: any = {};

        // 빈값이면 프런트엔드로 에러 리턴
        if (isEmpty(username)) errors.username = "username을 입력해주세요";
        if (isEmpty(password)) errors.password = "password를 입력해주세요";
        if (Object.keys(errors).length > 0) return res.status(400).json(errors);

        // DB에서 유저 찾기
        const user = await User.findOneBy({ username });
        if (!user) return res.status(404).json({ username: "등록되지 않은 사용자입니다" });

        // 유저가 있다면 비밀번호 비교하기
        const passwordMatches = await bcrypt.compare(password, user.password);

        // 비밀번호가 다르다면 에러 리턴
        if (!passwordMatches) return res.status(401).json({ password: "비밀번호가 정확하지 않습니다" });

        // 비밀번호가 맞다면 토큰 생성
        const token = jwt.sign({ username }, process.env.JWT_SECRET);

        // 쿠키 저장
        res.set(
            "Set-Cookie",
            cookie.serialize("token", token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
            })
        );

        return res.json({ user, token });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};

const router = Router();
router.post("/register", register);
router.post("/login", login);

export default router;
