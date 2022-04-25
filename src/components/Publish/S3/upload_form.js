import aws from 'aws-sdk';
// import { useState } from 'react'
// import { useDownloadUrl } from '../../../@context/useDownloadUrl'

async function getPresignedURL(filename) {

  /*
    Note that since we moved this code from the API section,
      we'll need to expose the environment variables to the
      browser using "NEXT_PUBLIC_". This is a *bad way to do things*
      and should be changed for production.
  */
  aws.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY,
    region: process.env.NEXT_PUBLIC_REGION,
    signatureVersion: 'v4',
  });

  const s3 = new aws.S3();

  // createPresignedPost() returns a hashmap which we'll need to objectify
  const post = await s3.createPresignedPost({
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
    Fields: {
      key: filename,
    },
    Expires: 60, // seconds
    // Conditions: [
    //   ['content-length-range', 0, 1048576], // up to 1 MB
    // ],
  });

  // Post is destructurable, so return it
  return post;

}

export default function Upload() {

  let urlToSet = "";

  const { downloadUrl, setDownloadUrl } = useDownloadUrl();

  const uploadFile = async (e) => {
    const file = e.target.files[0];

    if(!(file === undefined)){
      // getPresignedURL() returns a destructurable object
      const { url, fields } = await getPresignedURL(file.name);
      const formData = new FormData();

      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const upload = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (upload.ok) {
        console.log('Uploaded successfully!');
      } else {
        console.error('Upload failed.');
      }

      urlToSet = "https://niledata-demo.s3.us-west-1.amazonaws.com/" + encodeURIComponent(file.name);
      console.log("Download URL: " + urlToSet);

    }

  };

  return (
    <>
      <p>Upload a file.</p>
      <form method="post">
        <input
          type="file"
        />
        <input type="button" onClick={uploadFile} value="Update"/>
      </form>
      <p>Download URL (copy this into the "Provider URL" box below): {urlToSet}</p>
    </>
  );

}
