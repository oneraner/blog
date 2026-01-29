export interface AnalyticsConfig {
    umamiAnalytics?: {
        umamiWebsiteId: string
        src?: string
    }
    googleAnalytics?: {
        googleAnalyticsId: string
    }
    plausibleAnalytics?: {
        plausibleDataDomain: string
        src?: string
    }
    simpleAnalytics?: boolean
    posthogAnalytics?: {
        posthogProjectApiKey: string
    }
}
