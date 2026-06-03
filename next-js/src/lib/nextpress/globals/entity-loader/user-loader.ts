import { IUser } from "../../entities/user/user";
import User from "../../entities/user/user-impl";
import UserQuery from "../../repository/userquery/user-query";
import { EntityLoader } from "./entity-loader";
import EntityLoaderBase from "./entity-loader-base";

class UserLoader extends EntityLoaderBase<IUser, UserQueryArgs> {
    private static _instance: UserLoader;

    protected queryClass = UserQuery;

    private constructor() {
        super();
    }

    public static instance(): UserLoader {
        if (!this._instance) {
            this._instance = new UserLoader();
        }
        return this._instance;
    }

    protected async fetchFromDatabase(ids: number[]): Promise<IUser[]> {
        return await User.get(ids);
    }

    protected getEntityId(user: IUser): number {
        return user.ID;
    }
}

declare global {
    var userLoader: EntityLoader<IUser, UserQueryArgs>
    var getUsers: (ids: number[]) => Promise<IUser[]>
    var getUser: (id: number) => Promise<IUser | undefined>
}

globalThis.userLoader = UserLoader.instance();
globalThis.getUsers = async (ids) => {
    return await userLoader.get(ids);
}
globalThis.getUser = async (id) => {
    return (await userLoader.get([id]))[0];
}

export {};
