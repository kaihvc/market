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

function generateDownloadURL(filename){

  // Generate url
  const encodedFilename = encodeURIComponent(filename);
  return "https://niledata-demo.s3.us-west-1.amazonaws.com/" + encodedFilename;

}

function updateProviderURL(filename){

  const url = generateDownloadURL(filename);

  // Create new state variable "downloadUrl" and initialize to empty string
  const [downloadUrl, setDownloadUrl] = useState("");


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

      urlToSet = generateDownloadUrl(file.name);
      console.log(urlToSet);

    }

  };

  const handleClick = () => {
    setDownloadUrl(urlToSet);
    console.log("Updated downloadUrl");
  };

  return (
    <>
      <p>Upload a .png or .jpg image (max 1MB).</p>
      <form method="post">
        <input
          type="file"
          onChange={uploadFile}
        />
        <input type="button" onClick={handleClick} value="Update"/>
      </form>
    </>
  );

}
