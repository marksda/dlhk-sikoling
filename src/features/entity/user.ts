import { ICredential } from "./credential";
import { IPerson } from "./person";

export interface IUser {
    credential: Partial<ICredential>|null;
    person: Partial<IPerson>|null;
};