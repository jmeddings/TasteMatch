const { Router } = require('express')
const { listDrafts, getDraft, upsertDraft, deleteDraft } = require('../controllers/draftsController')

const router = Router()

router.get('/', listDrafts)
router.get('/:id', getDraft)
router.post('/', upsertDraft)
router.delete('/:id', deleteDraft)

module.exports = { draftsRouter: router }
