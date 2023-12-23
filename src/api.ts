import http from 'http'
import express from 'express'
import compression from 'compression'
import hpp from 'hpp'
import helmet from 'helmet'
import cors from 'cors'

import { NODE_ENV, PORT } from '@/config'
import { logger, loggerMiddleware } from '@/utils/logger'
import controllers from '@/controllers'
import middlewares from '@/middlewares'

export default class API {
    app: express.Application
    server: http.Server

    constructor() {
        this.app = express()

        this.setPreMiddleware()
        this.setController()
        this.setPostMiddleware()
    }

    setPreMiddleware() {
        this.app.use(helmet())
        this.app.use(cors())
        this.app.use(compression())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(hpp())
        this.app.use(middlewares.request.requestId)
        this.app.use(loggerMiddleware)
        this.app.use(middlewares.space.classNameRouter)
    }

    setController() {
        this.app.use('/v1/webhooks', controllers.v1.webhooks)
        this.app.use('/v1/aliens', controllers.v1.aliens)
        this.app.use('/v1/planets/:planetId/messages', controllers.v1.messages)
    }

    setPostMiddleware() {
        this.app.use(middlewares.error)
    }

    public listen() {
        this.server = this.app.listen(PORT, () => {
            logger.info(`🚀 App listening on the port: ${PORT} ENV: ${NODE_ENV}`)
        })
    }

    public async close(): Promise<void> {
        return new Promise((resolve) => {
            this.server.close(() => {
                resolve()
            })
        })
    }
}
