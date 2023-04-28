const Job = require('../models/job')
const { StatusCodes } = require('http-status-codes')
const CustomApi = require('../errors/custom-api')
const path = require('path')
const cloudinary = require('cloudinary').v2
const fs = require('fs')



const getAllJobs = async (req, res) => {
    const { search, jobType, sort } = req.query
    const queryObject = { createdBy: req.user.id }
    if (search) {
        queryObject.company = { $regex: '^' + search, $options: 'i' }
    }
    if (jobType && jobType !== 'all') {
        queryObject.jobType = jobType
    }

    let result = Job.find(queryObject)
    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('createdAt')
    }
    const job = await result
    res.status(StatusCodes.OK).json({ no_of_jobs: job.length, job })
}
const getJob = async (req, res) => {
    const userId = req.user.id
    const { id } = req.params
    const job = await Job.findOne({ _id: id, createdBy: userId })
    if (!job) {

        throw new CustomApi(`No job with such ${id}`, StatusCodes.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json({ job })
}
const createJob = async (req, res) => {
    // const files = req.files.resume
    // const imagePath = path.join(__dirname, '../public/uploads/' + `${files.name}`)
    // await files.mv(imagePath)
    console.log(req.files.resume)
    const result = await cloudinary.uploader.upload(req.files.resume.tempFilePath, { use_filename: true, folder: 'file-upload2' })
    console.log(result)
    const data = req.body
    data.resume = result.secure_url
    data.createdBy = req.user.id
    const job = await Job.create(data)
    // fs.unlinkSync(req.files.resume.tempFilePath)
    res.status(StatusCodes.CREATED).json({ job })

}
const updateJob = async (req, res) => {
    const { params: { id }, user: { id: userId }, body: { company, position } } = req
    if (company == " " || position == " ") {
        throw new CustomApi('Please the company or position field cannot be empty', StatusCodes.BAD_REQUEST)
    }
    const job = await Job.findOneAndUpdate({ _id: id, createdBy: userId }, req.body, { new: true, overwrite: true, runValidators: true, timestamps: false })
    if (!job) {
        throw new CustomApi(`No job with such ${id}`, StatusCodes.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json({ job })
}
const deleteJob = async (req, res) => {
    const { params: { id }, user: { id: userId } } = req
    const job = await Job.findOneAndRemove({ _id: id, createdBy: userId })
    if (!job) {
        throw new CustomApi(`No job with such ${id}`, StatusCodes.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json({ message: 'successfully deleted' })


}
const showStats = async (req, res) => {
    let stats = await Job.aggregate([
        // {
        //     $sort: { position: 1 }
        // }
        // { $match: { company: 'Flutterave' } },
        { $group: { _id: '$jobType', count: { $sum: 1 } } },
    ]);
    console.log(stats)
    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob, showStats }