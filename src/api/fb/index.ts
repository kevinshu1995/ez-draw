const _FB_API = () => window?.FB?.api;
const _FB = () => window?.FB;

type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

interface Error {
    message: string;
    type: string;
    code: "OAuthException" | 102 | 1 | 2 | 3 | 4 | 17 | 10 | 190 | IntRange<200, 299> | 341 | 368 | 506 | 1609005;
    error_subcode?: 458 | 459 | 460 | 463 | 464 | 467 | 492;
    error_user_title?: string;
    error_user_msg: string;
    fbtrace_id: string;
}

type ErrorResponse = {
    error: Error;
};

type ApiResponse<T> = Promise<{ data: T | null; error: null | Error }>;
type FbResponse<T> = T & ErrorResponse;

interface Picture {
    cache_key?: string;
    height: number;
    width: number;
    is_silhouette: boolean;
    url: string;
}

export type ArgsPaging = {
    since?: string | null;
    until?: string | null;
    before?: string | null;
    after?: string | null;
    limit?: number | null;
};

interface Paging {
    cursors: {
        before: string;
        after: string;
    };
    limit?: number;
    next?: string;
    previous?: string;
}

interface Pagination<D, S> {
    data: D[];
    paging: Paging;
    summary: S;
}

export type PaginationApi<T, U, V> = (args: V) => ApiResponse<Pagination<T[], U>>;

export type UserId = string;

export interface Me {
    id?: UserId;
    email?: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    picture?: {
        data: Picture;
    };
}
export function FBGetMe(): ApiResponse<Me> {
    return new Promise(resolve => {
        _FB_API()("/me", { fields: "id,email,first_name,last_name,name,picture,birthday,gender" }, (res: FbResponse<Me>) => {
            resolve({
                data: !!res.error ? null : res,
                error: res?.error ?? null,
            });
        });
        return;
    });
}

export type FBGetAccountsData = {
    id: string;
    name: string;
    instagram_business_account: {
        id: string;
        username: string;
        followers_count: number;
        media_count: number;
        profile_picture_url: string;
    };
};

export type FBGetAccountsResponse = Pagination<FBGetAccountsData[], any>;
export type FBGetAccounts = PaginationApi<FBGetAccountsData, any, ArgsPaging>;
export const FBGetAccounts: FBGetAccounts = ({ since, until, before, after, limit }) => {
    return new Promise(resolve => {
        _FB_API()(
            "/me/accounts",
            {
                fields: "id,name,instagram_business_account{id,name,username,followers_count,media_count,profile_picture_url}",
                ...(since && { since }),
                ...(until && { until }),
                ...(before && { before }),
                ...(after && { after }),
                ...(limit && { limit }),
            },
            (res: FbResponse<FBGetAccountsResponse>) => {
                resolve({
                    data: !!res.error ? null : res,
                    error: res?.error ?? null,
                });
            }
        );
        return;
    });
};

export type FBGetIGMediasData = {
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
export interface ArgsFBGetIGMedias extends ArgsPaging {
    igId: string;
}
export type FBGetIGMedias = PaginationApi<FBGetIGMediasData, any, ArgsFBGetIGMedias>;
export type FBGetIGMediasResponse = Pagination<FBGetIGMediasData[], any>;
export const FBGetIGMedias: FBGetIGMedias = ({ igId, since, until, before, after, limit }) => {
    return new Promise(resolve => {
        _FB_API()(
            `/${igId}/media`,
            {
                fields: "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,is_shared_to_feed",
                ...(since && { since }),
                ...(until && { until }),
                ...(before && { before }),
                ...(after && { after }),
                ...(limit && { limit }),
            },
            (res: FbResponse<FBGetIGMediasResponse>) => {
                resolve({
                    data: !!res.error ? null : res,
                    error: res?.error ?? null,
                });
            }
        );
        return;
    });
};

export type FBGetIGMediaCommentsData = {
    from: {
        id: string;
        username: string;
    };
    hidden: boolean;
    id: string;
    link_count: number;
    media: {
        id: string;
    };
    text: string;
    timestamp: string;
};
export interface ArgsFBGetIGMediaComments extends ArgsPaging {
    igMediaId: string;
}
export type FBGetIGMediaComments = PaginationApi<FBGetIGMediaCommentsData, any, ArgsFBGetIGMediaComments>;
export type FBGetIGMediaCommentsResponse = Pagination<FBGetIGMediaCommentsData[], any>;
export const FBGetIGMediaComments: FBGetIGMediaComments = ({ igMediaId, since, until, before, after, limit }) => {
    return new Promise(resolve => {
        _FB_API()(
            `/${igMediaId}/comments`,
            {
                fields: "from,hidden,id,like_count,media,parent_id,replies,text,timestamp",
                ...(since && { since }),
                ...(until && { until }),
                ...(before && { before }),
                ...(after && { after }),
                ...(limit && { limit }),
            },
            (res: FbResponse<FBGetIGMediaCommentsResponse>) => {
                resolve({
                    data: !!res.error ? null : res,
                    error: res?.error ?? null,
                });
            }
        );
        return;
    });
};

export type FBGetIGMediaAllComments = (args: { igMediaId: string; since: string; until: string }) => ApiResponse<FBGetIGMediaCommentsData[]>;
type fetchNextComments = (allComments: FBGetIGMediaCommentsData[], after: null | string) => Promise<{ allComments: FBGetIGMediaCommentsData[]; error: null | Error; after: string | null }>;
export const FBGetIGMediaAllComments: FBGetIGMediaAllComments = async ({ igMediaId, since, until }) => {
    const fetchNextComments: fetchNextComments = async (allComments = [], after = null) => {
        const { data, error } = await FBGetIGMediaComments({ igMediaId, after, since, until });
        if (error !== null) return { allComments, after, error };
        if (data !== null) {
            allComments = allComments.concat(...data.data);
        }
        const nextAfter = data?.paging?.cursors?.after;
        if (nextAfter) {
            return fetchNextComments(allComments, nextAfter);
        }
        return { allComments, after, error: null };
    };
    const { allComments, error } = await fetchNextComments([], null);
    return { data: allComments.reverse(), error };
};

export const FBSubscribe: fb.FacebookStaticEvent["subscribe"] = (eventName, callback) => {
    return _FB().Event.subscribe(eventName, callback);
};

export const FBGetLoginStatus: fb.FacebookStatic["getLoginStatus"] = (...args) => {
    return _FB().getLoginStatus(...args);
};

export const FbPopupOAuth = (callback: (response: fb.StatusResponse) => void) => {
    _FB().login(
        (response: fb.StatusResponse) => {
            callback && typeof callback === "function" && callback(response);
        },
        {
            scope: "instagram_basic,pages_show_list,business_management,user_birthday,email,user_gender",
            return_scopes: true,
            enable_profile_selector: true,
            // profile_selector_ids: true,
        }
    );
};

export const FbLogout = (callback: (response: fb.StatusResponse) => void) => {
    _FB().logout(callback);
};

export default _FB();

