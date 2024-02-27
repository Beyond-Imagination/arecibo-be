import '@/config'
import API from '@/api'
import * as db from '@/models/connector'
import { logger } from '@/utils/logger'
;(async () => {
    await db.connect()
    const api = new API()

    api.listen()

    async function shutdown() {
        logger.info('gracefully shutdown orbit')
        await Promise.all([api.close])
        await db.close()
        logger.info('shutdown complete')
        process.exit()
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
})()
