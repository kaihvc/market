import aws from 'aws-sdk';

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

// async function handler(req, res) {
//   res.status(200).json(post);
// }


export default function Upload() {

  const uploadPhoto = async (e) => {
    const file = e.target.files[0];

    // getPresignedURL() returns a destructurable object
    const { url, fields } = await getPresignedURL(file.name);

    // Next block: old code
    // const filename = encodeURIComponent(file.name);
    // const res = await fetch(`/api/upload-url?file=${filename}`);
    // // DEBUG; shit won't work unless these are commented
    // const resText = await res.text();
    // console.log(resText);
    // const { url, fields } = await res.json();

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

    // TODO: add Provider URL change functionality

  };

  return (
    <>
      <p>Upload a .png or .jpg image (max 1MB).</p>
      <input
        type="file"
        onChange={uploadPhoto}
        accept="image/png, image/jpeg"
      />
    </>
  );
}
