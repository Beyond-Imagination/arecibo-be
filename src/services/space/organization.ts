import { IOrganizationSecret, IOrganization } from '@/types/space'
import { ErrorGetSpaceOrganization } from '@/types/errors'

export async function getOrganization(secret: IOrganizationSecret): Promise<IOrganization> {
    const url = `${secret.serverUrl}/api/http/organization`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: await secret.getBearerToken(),
        },
    })
    if (!response.ok) {
        throw new ErrorGetSpaceOrganization(await response.text())
    }
    return (await response.json()) as IOrganization
}
