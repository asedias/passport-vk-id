import {Strategy as BaseStrategy} from 'passport';

export interface VKIDProfile {
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

type VKIDProvider = "vkid" | "ok_ru" | "mail_ru";
type VKIDScope =
    "vkid.personal_info"    //  Фамилия, имя, пол, фото профиля, дата рождения. Базовое право доступа, которое по умолчанию используется для всех приложений
    | "email"	            //  Доступ к почте пользователя
    | "phone"	            //  Доступ к номеру телефона
    | "friends"	            //	Доступ к друзьям
    | "wall"	            //	Доступ к обычным и расширенным методам работы со стеной
    | "groups"	            //	Доступ к сообществам пользователя
    | "stories"	            //	Доступ к историям
    | "docs"	            //	Доступ к документам
    | "photos"	            //	Доступ к фотографиям
    | "ads"	                //	Доступ к расширенным методам работы с рекламным API
    | "video"	            //	Доступ к видеозаписям
    | "status"	            //	Доступ к статусу пользователя
    | "market"	            //	Доступ к товарам
    | "pages"	            //	Доступ к wiki-страницам
    | "notifications"	    //	Доступ к оповещениям об ответах пользователю
    | "stats"	            //	Доступ к статистике сообществ и приложений пользователя, администратором которых он является
    | "notes"	            //	Доступ к заметкам

export interface Config {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: VKIDScope[];
    provider?: VKIDProvider;
    lang_id?: number;
    scheme?: "light" | "dark";
}

type Callback<U> = (
    accessToken: string,
    refreshToken: string,
    profile: VKIDProfile,
    done: (error: string | null, user: U) => void
) => void;

export class Strategy<U> extends BaseStrategy {
    public constructor(config: Config, callback: Callback<U>);
}
