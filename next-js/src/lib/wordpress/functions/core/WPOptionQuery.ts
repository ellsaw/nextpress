import { Selectable, SelectQueryBuilder } from "kysely";
import logQuery from "../../wpdb/logQuery";
import wpdb from "../../wpdb/wpdb";
import { DB, WpOption } from "../../types/wpdb/wpdb";

/**
 * A query builder class for fetching WordPress options from the database using Kysely.
 * This class provides an interface to construct and execute queries
 * against the `wpOptions` table.
 */
export default class WPOptionQuery {
    private query: SelectQueryBuilder<DB, 'wpOptions', any>; 

    constructor() {
        this.query = wpdb.selectFrom('wpOptions');
    }

    /**
     * Filters the query to fetch a specific option by its name.
     * * @param {Object} args - An object containing the arguments for the filter.
     * @param {string} [args.optionName] - The specific option name (option_name) to look for in the database.
     * @returns {this} The current WPOptionQuery instance to allow method chaining.
     */
    public setName(args: {optionName?: string}): this {
        if (args.optionName) {
            this.query = this.query.where('optionName', '=', args.optionName);
        }

        return this;
    }

    /**
     * Finalizes the query build process, logs the generated SQL, and executes it against the database.
     * * @throws {Error} If the execution of the query fails due to a database or network error.
     * @returns {Promise<Selectable<WpOption>[]>} A promise that resolves to an array of fetched WordPress options.
     */
    public async getOptions(): Promise<Selectable<WpOption>[]> {
        logQuery(this.query);

        try {
            return await this.query.selectAll().execute();
        } catch (error: any) {
            throw new Error(`WPOptionQuery: Error while fetching options: ${error.message}`, { cause: error });
        }
    }
}
