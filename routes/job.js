const express = require('express')
const router = express.Router()

const { getAllJobs, getJob, createJob, updateJob, deleteJob, showStats } = require('../controllers/job')
const sendEmails = require('../controllers/sendEmail')
router.route('/').get(getAllJobs).post(createJob)
router.route('/email').post(sendEmails)
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob)

module.exports = router