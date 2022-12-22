export interface Uesr {
    username: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface Sub {
    createdAt: string;
    updatedAt: string;
    name: string;
    title: string;
    description: string;
    imageUrn: string;
    bannerUrn: string;
    username: string;
    posts: Post[];
    postCount?: string;

    imageUrl: string;
    bannerUrl: string;
}

export interface Post {
    identifier: string;
    title: string;
    slug: string;
    body: string;
    subName: string;
    username: string;
    createdAt: string;
    updatedAt: string;
    sub?: Sub;

    url: string;
    userVote?: number;
    voteScore?: number;
    commentCount?: number;
}

export interface Comment {
    identifier: string;
    body: string;
    username: string;
    createdAt: string;
    updatedAt: string;
    post?: Post;

    userVote: string;
    coteScore: string;
}
