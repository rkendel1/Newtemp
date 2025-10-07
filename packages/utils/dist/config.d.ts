export declare const APP_CONFIG: {
    siteUrl: string;
    catApi: {
        baseUrl: string;
        apiKey: string | undefined;
    };
    externalLinks: {
        youtubeDemo: string;
        discord: string;
        github: string;
        docs: string;
        updateDashboard: string;
    };
    auth: {
        redirects: {
            afterSignIn: string;
            afterSignUp: string;
            afterReset: string;
            afterSignOut: string;
            afterEmailConfirmation: string;
        };
        passwordMinLength: number;
        passwordRecommendedLength: number;
    };
};
export declare const getFullUrl: (path: string) => string;
//# sourceMappingURL=config.d.ts.map