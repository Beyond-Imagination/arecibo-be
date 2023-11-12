import { getInstallInfo } from '@/utils/version'
import v010 from '@/utils/version/v0.1.0'

describe('space install version', () => {
    it('should get v0.1.0', () => {
        expect(getInstallInfo('0.1.0')).toBe(v010)
    })

    it('should get latest', () => {
        expect(getInstallInfo()).toBe(v010)
    })

    it('should throw error with unknown version', () => {
        expect(() => getInstallInfo('1.0.0'))
    })
})
