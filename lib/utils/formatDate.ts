import siteMetadata from '@/data/siteMetadata'

/**
 * Format a date string according to locale
 */
export function formatDate(date: string, locale: string = siteMetadata.locale): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }

    const now = new Date(date).toLocaleDateString(locale, options)
    return now
}
