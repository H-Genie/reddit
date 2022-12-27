import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";

const SubPage = () => {
    const fetcher = async (url: string) => {
        try {
            const res = await axios.get(url);
            return res.data;
        } catch (err: any) {
            throw err.response.data;
        }
    };

    const router = useRouter();
    const subName = router.query.sub;
    const { data: sub, error } = useSWR(subName ? `/sub/${subName}` : null, fetcher);

    return <div>SubPage</div>;
};

export default SubPage;
