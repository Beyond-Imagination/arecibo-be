import { IOrganizationSecret, Profile } from '@/types/space'
import { Organization } from '@/models/organization'
import { Alien } from '@/models/alien'

declare global {
    namespace Express {
        interface Request {
            _routeWhitelists: { body: string[] }
            _routeBlacklists: { body: string[] }
            organization: Organization
            organizationSecret: IOrganizationSecret
            provider: 'space'
            user: Profile
            alien: Alien
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
