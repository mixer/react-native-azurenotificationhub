export interface RegistrationInfo {

}

export interface RegistrationConfig {
    connectionString: string;
    hubName: strng;
    tags: string[];
}

export interface IOSAlert {
    alertBody?: string;
    alertAction?: string;
    alertTitle?: string;
    hasAction?: boolean;
    alertLaunchImage?: string;
    category?: string;
}

export interface TemplateRegistrationConfig extends RegistrationConfig {
    // JSON serialized template
    template: string;
    // Unique name for this template
    templateName: string;
}

export interface RegistrationError {
    message: string;
    code: number;
    details: any;
};

export interface AllowedPermissions {
    alert: boolean;
    badge: boolean;
    sound: boolean;
};

type NotificationUserInfo = {[key: string]: string | number | null};
type PushNotificationEventName =
    /**
     * Fired when a remote notification is received. The handler will be invoked
     * with an instance of `IOSNotification`.
     */
    'notification' |
    /**
     * Fired when a local notification is received. The handler will be invoked
     * with an instance of `IOSNotification`.
     */
    'localNotification' |
    /**
     * Fired when the user registers for remote notifications. The handler will be
     * invoked with a hex string representing the deviceToken.
     */
    'register' |
    /**
     * Fired when the user fails to register for remote notifications. Typically
     * occurs when APNS is having issues, or the device is a simulator. The
     * handler will be invoked with {message: string, code: number, details: any}.
     */
    'registrationError' |
    /**
     * Fired when the user registers for Azure notification hub. The handler will be
     * invoked with the connection string and hub name.
     */
    'registerAzureNotificationHub' |
    /**
     * Fired when the user fails to register for Azure notification hub.
     */
    'azureNotificationHubRegistrationError';

interface LocalNotification {
    alertBody: string;
    alertAction: string;
    soundName?: string;
    category?: string;
    userInfo?: NotificationUserInfo;
    applicationIconBadgeNumber?: number;
    remote?: boolean;
}

interface FutureLocalNotification extends LocalNotification {
    fireDate: Date;
}

// TODO: Generic the data if possible. Figure out registrationInfo

class IOSNotification {
    private _data: any;
    private _alert: string | IOSAlert;
    private _sound: string;
    private _badgeCount: number;

    static presentLocalNotification(details: LocalNotification): void;
    static scheduleLocalNotification(details: FutureLocalNotification): void;
    static cancelAllLocalNotifications(): void;
    static setApplicationIconBadgeNumber(number: number): void;
    static getApplicationIconBadgeNumber(callback: (number) => void): void;
    static cancelLocalNotifications(userInfo?: Partial<NotificationUserInfo>): void;
    static getScheduledLocalNotifications(callback: (notifications: Array<FutureLocalNotification>) => void): void;

    static addEventListener(name: 'register', cb: (deviceToken: string) => void): void;
    static addEventListener(name: 'notification', cb: (notification: IOSNotification) => void): void;
    static addEventListener(name: 'registrationError', cb: (err: RegistrationError) => void): void;
    static addEventListener(name: 'localNotification', cb: (notification: IOSNotification) => void): void;
    static addEventListener(name: 'registerAzureNotificationHub', cb: (registrationInfo: RegistrationInfo) => void): void;
    static addEventListener(name: 'azureNotificationHubRegistrationError', cb: (err: RegistrationError) => void): void;
    static removeEventListener(type: PushNotificationEventName, handler: Function);

    static requestPermissions(permissions?: Partial<AllowedPermissions>): Promise<AllowedPermissions>;
    static abandonPermissions(): void;
    static checkPermissions(callback: (permissions: AllowedPermissions) => void);

    static register(deviceToken: string, config: RegistrationConfig): void;
    static registerTemplate(deviceToken: string, config: TemplateRegistrationConfig): void;
    static unregister(): void;
    static unregisterTemplate(templateName: string): void;

    static getInitialNotification(): Promise<IOSNotification>;

    public getAlert(): string | IOSAlert;
    public getMessage(): string | IOSAlert;
    public getSound(): string;
    public getBadgeCount(): number;
    public getData(): any;
}

export = IOSNotification;
