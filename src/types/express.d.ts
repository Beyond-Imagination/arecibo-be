import { IOrganizationSecret, Profile } from '@/types/space'
import { Organization } from '@/models/organization'

declare global {
    namespace Express {
        interface Request {
            _routeWhitelists: { body: string[] }
            _routeBlacklists: { body: string[] }
            organization: Organization
            organizationSecret: IOrganizationSecret
            user: Profile
        }
        interface Response {
            meta: {
                requestId: string
                path?: string
                method?: string
                error?: Error
            }
        }
    }
}
