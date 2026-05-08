const { Router } = require('express')
const {
  listDrafts,
  getDraft,
  upsertDraft,
  autosaveDraft,
  resumeDraft,
  deleteDraft
} = require('../controllers/draftsController')

const router = Router()

router.get('/', listDrafts)
router.get('/resume', resumeDraft)
router.get('/:id', getDraft)
router.post('/', upsertDraft)
router.post('/autosave', autosaveDraft)
router.delete('/:id', deleteDraft)

module.exports = { draftsRouter: router }
