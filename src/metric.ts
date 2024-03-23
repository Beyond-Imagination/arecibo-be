import newrelic from 'newrelic'
import schedule from 'node-schedule'

import { logger } from '@/utils/logger'
import { OrganizationModel, AlienModel, MessageModel } from '@/models'

export default class Metric {
    private async organizationCount() {
        const count = (await OrganizationModel.estimatedDocumentCount()) as number
        newrelic.recordMetric('organization/count', count)
    }

    private async alienCount() {
        const count = (await AlienModel.estimatedDocumentCount()) as number
        newrelic.recordMetric('alien/count', count)
    }

    private async messageCount() {
        const count = (await MessageModel.estimatedDocumentCount()) as number
        newrelic.recordMetric('message/count', count)
    }

    //TODO: comment 개수 metric 저장

    public run() {
        schedule.scheduleJob('0 0 * * *', async () => {
            try {
                await this.alienCount()
                await this.organizationCount()
                await this.messageCount()
            } catch (e) {
                logger.error('metric record fail', { error: e })
            }
        })
    }

    public async stop() {
        await schedule.gracefulShutdown() // wait finish current job
    }
}
