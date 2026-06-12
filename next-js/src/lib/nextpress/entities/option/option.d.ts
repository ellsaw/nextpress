import { Selectable } from "kysely";
import { WpOption } from "../../types/wpdb/wpdb";
import { IFieldLocation } from "../common";

export interface IOption extends Omit<Selectable<WpOption>, 'autoload'> {};
