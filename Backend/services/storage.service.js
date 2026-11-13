import ImageKit from '@imagekit/nodejs';

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(buffer) {
  const response = await client.files.upload({
    file: buffer.toString('base64'),
    fileName: 'image' + Date.now() + ".jpg",
    folder: "products"
  });
  return response
}

export default uploadFile
