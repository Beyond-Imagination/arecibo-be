import '@/config'
import API from '@/api'
import Metric from '@/metric'
import * as db from '@/models/connector'
import { logger } from '@/utils/logger'
;(async () => {
    await db.connect()
    const api = new API()
    const metric = new Metric()

    api.listen()
    metric.run()

    async function shutdown() {
        logger.info('gracefully shutdown orbit')
        await Promise.all([api.close, metric.stop])
        await db.close()
        logger.info('shutdown complete')
        process.exit()
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
})()
