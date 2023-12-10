import express from 'express'
import asyncify from 'express-asyncify'
import { verifyUserRequest } from '@/middlewares/space'

// todo: import AlienModel

const router = asyncify(express.Router())

router.use(verifyUserRequest)

router.put('/:id/nickname', async (req, res) => {
    // todo: get req data
    // todo: exec function updateNickname
    res.status(204).send()
})

export default router
