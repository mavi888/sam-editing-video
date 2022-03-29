const { watermarkVideo } = require('./watermarkVideo')

exports.lambdaHandler = async (event) => {
   console.log('Start processing the video!')

   console.log (JSON.stringify(event, null, 2))

   // Handle each incoming S3 object in the event
   await Promise.all(
    event.Records.map(async (record) => {
      try {
        const bucket = record.s3.bucket.name;
        const key = record.s3.object.key;

        await watermarkVideo(bucket, key);

      } catch (err) {
        console.error(`Handler error: ${err}`)
      }
    })
  )
  };