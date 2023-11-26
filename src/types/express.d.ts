import { IOrganizationSecret } from '@/types/space'

declare global {
    namespace Express {
        interface Request {
            _routeWhitelists: { body: string[] }
            _routeBlacklists: { body: string[] }
            organizationSecret: IOrganizationSecret
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
