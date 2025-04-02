import {Strategy as BaseStrategy} from 'passport';

export interface Profile {
    user_id: string;
    provider: string;
    first_name: string;
    last_name: string;
    phone?: string;
    avatar: string;
    email?: string;
    sex: string;
    verified: string;
    [key: string]: any
}

interface Config {
    clientID: string;
    callbackURL: string;
}

type Callback<U> = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: string | null, user: U) => void
) => void;

export class Strategy<U> extends BaseStrategy {
    public constructor(config: Config, callback: Callback<U>);
}
