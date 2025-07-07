import {Strategy as BaseStrategy, Profile as PassportProfile} from 'passport';
import * as oauth2 from "passport-oauth2";
import { Request } from "express";

type VKIDProvider = "vkid" | "ok_ru" | "mail_ru";

export interface VKIDProfile extends Omit<PassportProfile, 'emails' | 'username'> {
    id: string;
    provider: VKIDProvider;
    name: {
        familyName: string;
        givenName: string;
        middleName?: string;
    }
    phone?: string;
    email?: string;
    gender: string;
    _json: {
        "user_id": string,
        "first_name": string,
        "last_name": string,
        "phone"?: string,
        "avatar": string,
        "email"?: string,
        "sex": number,
        "verified": string,
        "birthday": string
    }
    [key: string]: any
}

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

export enum VKIDLang {
    RUS = 0,
    UKR = 1,
    ENG = 3,
    SPA = 4,
    GERMAN = 6,
    POL = 15,
    FRA = 15,
    TURKEY = 82,
}

export type OAuth2StrategyOptionsWithoutRequiredURLs = Pick<
    oauth2._StrategyOptionsBase,
    Exclude<keyof oauth2._StrategyOptionsBase, "authorizationURL" | "tokenURL">
>;

export interface _StrategyOptionsBase extends OAuth2StrategyOptionsWithoutRequiredURLs {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: VKIDScope[];
    provider?: VKIDProvider;
    lang_id?: VKIDLang;
    scheme?: "light" | "dark";
}

export interface StrategyOptions extends _StrategyOptionsBase {
    passReqToCallback?: false | undefined;
}

export interface StrategyOptionsWithRequest extends _StrategyOptionsBase {
    passReqToCallback: true;
}

export type VerifyCallback = oauth2.VerifyCallback;

export class Strategy<U> extends BaseStrategy {
    constructor(
        options: StrategyOptions,
        verify: (
            accessToken: string,
            refreshToken: string,
            profile: VKIDProfile,
            done: VerifyCallback,
        ) => void,
    );
    constructor(
        options: StrategyOptionsWithRequest,
        verify: (
            req: Request,
            accessToken: string,
            refreshToken: string,
            profile: VKIDProfile,
            done: VerifyCallback,
        ) => void,
    );
}
