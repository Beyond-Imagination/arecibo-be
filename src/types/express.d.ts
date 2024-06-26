import { IOrganizationSecret, Profile } from '@/types/space'
import { Organization } from '@/models/organization'
import { Alien } from '@/models/alien'
import { Message } from '@/models/message'
import { Comment } from '@/models/comment'

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
            message: Message
            comment: Comment
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
