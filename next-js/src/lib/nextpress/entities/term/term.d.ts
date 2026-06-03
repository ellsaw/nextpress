import { Selectable } from "kysely";
import { WpTerm, WpTermTaxonomy } from "../../types/wpdb/wpdb";
import { AsyncGetterInterface, IPath } from "../common";

export interface ITerm extends Selectable<WpTerm>, Selectable<WpTermTaxonomy>, IPath {}
