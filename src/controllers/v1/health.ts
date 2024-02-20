import express, { Request, Response } from 'express'
import asyncify from 'express-asyncify'

const router = asyncify(express.Router())

router.get('/', async (req: Request, res: Response) => {
    res.status(200).json({ version: process.env.npm_package_version })
})

export default router
