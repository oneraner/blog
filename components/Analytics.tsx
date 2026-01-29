'use client'

import Script from 'next/script'
import { AnalyticsConfig } from '@/lib/analytics-types'

interface AnalyticsProps {
    analyticsConfig: AnalyticsConfig
}

export function Analytics({ analyticsConfig }: AnalyticsProps) {
    // Umami Analytics
    if (analyticsConfig?.umamiAnalytics?.umamiWebsiteId) {
        return (
            <Script
                async
                defer
                data-website-id={analyticsConfig.umamiAnalytics.umamiWebsiteId}
                src={analyticsConfig.umamiAnalytics.src || 'https://analytics.umami.is/script.js'}
            />
        )
    }

    // Google Analytics
    if (analyticsConfig?.googleAnalytics?.googleAnalyticsId) {
        return (
            <>
                <Script
                    strategy="afterInteractive"
                    src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.googleAnalytics.googleAnalyticsId}`}
                />
                <Script id="ga-script" strategy="afterInteractive">
                    {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${analyticsConfig.googleAnalytics.googleAnalyticsId}');
          `}
                </Script>
            </>
        )
    }

    return null
}

export default { Analytics }
