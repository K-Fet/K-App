/**
 * Return a default template for a week of services.
 *
 * Day start from 0 (Sunday).
 * Generate services for a normal week.
 *
 * @return {Array<Object>} services (same structure as ServicesTemplateUnit)
 */
function getDefaultTemplate() {
    const DEFAULT_NB_MAX = 5;

    return [
        // Monday
        {
            nbMax: DEFAULT_NB_MAX,
            startAt: {
                day: 1,
                hours: 12,
                minutes: 0,
            },
            endAt: {
                day: 1,
                hours: 14,
                minutes: 0,
            },
        },
        {
            nbMax: DEFAULT_NB_MAX,
            startAt: {
                day: 1,
                hours: 19,
                minutes: 0,
            },
            endAt: {
                day: 2,
                hours: 1,
                minutes: 0,
            },
        },
        // Tuesday
        {
            nbMax: DEFAULT_NB_MAX,
            startAt: {
                day: 2,
                hours: 12,
                minutes: 0,
            },
            endAt: {
                day: 2,
                hours: 14,
                minutes: 0,
            },
        },
        {
            nbMax: DEFAULT_NB_MAX,
            startAt: {
                day: 2,
                hours: 18,
                minutes: 0,
            },
            endAt: {
                day: 3,
                hours: 1,
                minutes: 0,
            },
        },
        // Wednesday
        {
            nbMax: DEFAULT_NB_MAX,
            startAt: {
                day: 3,
                hours: 12,
                minutes: 0,
            },
            endAt: {
                day: 3,
                hours: 14,
                minutes: 0,
            },
        },
        {
            nbMax: DEFAULT_NB_MAX,
            startAt: {
                day: 3,
                hours: 18,
                minutes: 0,
            },
            endAt: {
                day: 4,
                hours: 1,
                minutes: 0,
            },
        },
        // Thursday
        {
            nbMax: DEFAULT_NB_MAX,
            startAt: {
                day: 4,
                hours: 12,
                minutes: 0,
            },
            endAt: {
                day: 4,
                hours: 14,
                minutes: 0,
            },
        },
        {
            nbMax: DEFAULT_NB_MAX,
            startAt: {
                day: 4,
                hours: 18,
                minutes: 0,
            },
            endAt: {
                day: 5,
                hours: 1,
                minutes: 0,
            },
        },
        // Friday
        {
            nbMax: DEFAULT_NB_MAX,
            startAt: {
                day: 5,
                hours: 12,
                minutes: 0,
            },
            endAt: {
                day: 5,
                hours: 14,
                minutes: 0,
            },
        },
        {
            nbMax: DEFAULT_NB_MAX,
            startAt: {
                day: 5,
                hours: 18,
                minutes: 0,
            },
            endAt: {
                day: 6,
                hours: 1,
                minutes: 0,
            },
        },
    ];
}


module.exports = {
    getDefaultTemplate,
};
