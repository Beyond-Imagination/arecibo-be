export interface IOrganization {
    id: string
    orgId: string
    name: string
    slogan: string
    logoId: string
    onboardingRequired: boolean
    allowDomainsEdit: boolean
    createdAt: number
    timezone: {
        id: string // ex: "Asia/Seoul"
    }
}
