import v010 from './v0.1.0'
import { errors, installInfo } from '@/types'

const version = {
    '0.1.0': v010,
    latest: v010,
}

export function getInstallInfo(targetVersion = 'latest'): installInfo {
    if (targetVersion in version) {
        return version[targetVersion]
    }
    throw new errors.InvalidVersion()
}
