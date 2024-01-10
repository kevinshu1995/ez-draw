import Axios from "src/lib/axios";
import axios from "axios";

const apiVersion = "v18.0";

type Response<Data> = {
    data: Data | null;
    error: unknown | null;
    status: number;
    message: string | null;
    code: number | null;
};

export type Paging = {
    cursors?: {
        after?: string;
        before?: string;
    };
    previous?: string;
    next?: string;
};

function handleIgError(error: unknown) {
    if (axios.isAxiosError(error)) {
        return {
            data: null,
            error,
            status: error.response?.status || 555,
            message: error.response?.data?.error_message || error.message,
            code: error.response?.data?.code || null,
        };
    }
    return {
        data: null,
        error,
        status: 555,
        message: null,
        code: null,
    };
}

async function getAccessToken({ code }: { code: string }) {
    try {
        const { data } = await Axios.AxiosApiInstagram.postForm("/oauth/access_token", {
            client_id: import.meta.env.VITE_INSTAGRAM_CLIENT_ID,
            client_secret: import.meta.env.VITE_INSTAGRAM_CLIENT_SECRET,
            redirect_uri: import.meta.env.VITE_INSTAGRAM_REDIRECT_URL,
            grant_type: "authorization_code",
            code,
        });
        return {
            data,
            error: null,
            status: data.status,
            message: data.statusText,
            code: null,
        };
    } catch (error) {
        return handleIgError(error);
    }
}

function goGetIgOAuth() {
    const oauthUrlQuery = new URLSearchParams();
    oauthUrlQuery.append("client_id", import.meta.env.VITE_INSTAGRAM_CLIENT_ID);
    oauthUrlQuery.append("redirect_uri", import.meta.env.VITE_INSTAGRAM_REDIRECT_URL);
    oauthUrlQuery.append("response_type", "code");
    oauthUrlQuery.append("scope", "user_profile,user_media");
    const url = "https://api.instagram.com/oauth/authorize?" + oauthUrlQuery.toString();
    window.open(url);
}

async function getMeByUserId({ token, userId }: { token: string; userId: string }) {
    try {
        const { data } = await Axios.AxiosGraphInstagram.get(`/${apiVersion}/${userId}`, {
            params: {
                access_token: token,
                fields: "account_type,id,media_count,username",
            },
        });
        return {
            data,
            error: null,
            status: data.status,
            message: data.statusText,
            code: null,
        };
    } catch (error) {
        return handleIgError(error);
    }
}

export type MediaData = {
    id: string;
    caption?: string;
    media_type?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
    media_url?: string;
    permalink?: string;
    thumbnail_url?: string;
    timestamp?: string;
    username?: string;
    is_shared_to_feed?: string;
};
type ParamsGetUserMedia = {
    token: string;
    userId: string;
    since?: string | null;
    until?: string | null;
    before?: string | null;
    after?: string | null;
    limit?: number | null;
};
export type GetUserMediaData = { data: MediaData; paging: Paging };
async function getUserMedia({ token, userId, since, until, before, after, limit }: ParamsGetUserMedia): Promise<Response<GetUserMediaData>> {
    try {
        const { data } = await Axios.AxiosGraphInstagram.get(`/${apiVersion}/${userId}/media`, {
            params: {
                access_token: token,
                fields: "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,is_shared_to_feed",
                ...(since && { since }),
                ...(until && { until }),
                ...(before && { before }),
                ...(after && { after }),
                ...(limit && { limit }),
            },
        });
        return {
            data,
            error: null,
            status: data.status,
            message: data.statusText,
            code: null,
        };
    } catch (error) {
        return handleIgError(error);
    }
}

export default { getAccessToken, goGetIgOAuth, getMeByUserId, getUserMedia };

