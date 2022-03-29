
// Configure S3
const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

// Set ffpmeg
const ffmpegPath = '/opt/bin/ffmpeg'
const ffTmp = '/tmp'

const { exec } = require('child_process')
const { tmpCleanup } = require('./tmpCleanup.js')

const fs = require('fs')

const OUTPUT_BUCKET_NAME = process.env.OutputBucketName
const WATERMARK_FILE_NAME = 'watermark.png'

module.exports.watermarkVideo = async (bucket, key) => {

	// Get signed URL for source object
	const Key = decodeURIComponent(key.replace(/\+/g, ' '))

	// Get object from S3 bucket 
	const data = await getS3Object(bucket, Key);

	//Get watermark file from S3 bucket
	const watermarkData = await getS3Object(bucket, WATERMARK_FILE_NAME);

	// Save original to tmp directory
	const tempFile = `${ffTmp}/${Key}`
	console.log('Saving downloaded file to ', tempFile)
	fs.writeFileSync(tempFile, data.Body)

	// Save watermark file to tmp directory
	const tempWatermark = `${ffTmp}/${WATERMARK_FILE_NAME}`
	console.log('Saving downloaded file to ', tempWatermark)
	fs.writeFileSync(tempWatermark, watermarkData.Body)

	// Add watermark and save to /tmp
	const outputFilename = `${Key.split('.')[0]}-watermark.mp4`
	console.log(`Adding watermark and saving to ${outputFilename}`)
	await execPromise(`${ffmpegPath} -i "${tempFile}" -i "${tempWatermark}" -loglevel error -filter_complex overlay ${ffTmp}/${outputFilename}`)

	// Read watermarked file from tmp
	console.log('Read tmp file into tmpData')
	const tmpData = fs.readFileSync(`${ffTmp}/${outputFilename}`)
	console.log(`tmpData size: ${tmpData.length}`)

	// Upload tmpData to Output bucket
	console.log(`Uploading ${outputFilename} to ${OUTPUT_BUCKET_NAME}`)
	await uploadObjectS3(OUTPUT_BUCKET_NAME, outputFilename, tmpData)
	console.log(`Object written to ${OUTPUT_BUCKET_NAME}`)

	// Clean up temp files
	console.log('Cleaning up temporary files')
	await tmpCleanup()
}

// Promisified wrapper for child_process.exec
const execPromise = async (command) => {
	return new Promise((resolve, reject) => {
		const ls = exec(command, function (error, stdout, stderr) {
		  if (error) {
		    console.log('Error: ', error)
		    reject(error)
		  }
		  if (stdout) console.log('stdout: ', stdout)
		  if (stderr) console.log('stderr: ' ,stderr)
		})

		ls.on('exit', (code) => {
		  if (code != 0) console.log('execPromise finished with code ', code)
			resolve()
		})
	})
}

const getS3Object = async (bucket, key) => {
	const params = {
		Bucket: bucket,
		Key: key
	}
	return await s3.getObject(params).promise()
}

const uploadObjectS3 = async (bucket, key, object) => {
	const params = {
		Bucket: bucket,
		Key: key,
		Body: object
	}

	return await s3.putObject(params).promise();
}