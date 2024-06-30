import express, { Request, Response } from 'express'
import asyncify from 'express-asyncify'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 } from 'uuid'

import { verifyAlien } from '@/middlewares/aliens'
import { S3_ACCESS_KEY, S3_BUCKET, S3_REGION, S3_SECRET_KEY } from '@/config'

const router = asyncify(express.Router())

router.get('/presignedUrl', verifyAlien, async (req: Request, res: Response) => {
    const filename = v4() + '-' + req.query.filename
    const s3Client = new S3Client({
        region: S3_REGION,
        credentials: {
            accessKeyId: S3_ACCESS_KEY,
            secretAccessKey: S3_SECRET_KEY,
        },
    })

    const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: filename,
    })
    const post = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 })

    res.status(200).json({
        presignedUrl: post,
    })
})

export default router
