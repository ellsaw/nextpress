import * as mysql from 'mysql2/promise';

export default class WPDatabaseDriver
{
    public connection?: mysql.Pool;

    public errorMessage?: string;

    private static inst?: WPDatabaseDriver;

    private constructor(){
        try {
            this.connection = mysql.createPool({
                user: 'root',
                host: 'db',
                password: process.env.MYSQL_ROOT_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                waitForConnections: true,
                connectionLimit: 10,
                maxIdle: 10, 
                idleTimeout: 60000, 
                queueLimit: 0,
                enableKeepAlive: true,
                keepAliveInitialDelay: 0,
            });
        } catch (error: any) {
            this.errorMessage = 'WPDatabaseDriver: ' + error.message;
        }
    }

    public static instance(): WPDatabaseDriver
    {
        if (!WPDatabaseDriver.inst || !WPDatabaseDriver.inst.connection) {
            WPDatabaseDriver.inst?.connection?.end();
            WPDatabaseDriver.inst = new WPDatabaseDriver();
        }
        return WPDatabaseDriver.inst
    }
}