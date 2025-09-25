const MAX_SIZE_BYTES = 15728640;

export async function onListData({ key }) {
  let result;
  try {
    const response = await fetch('https://api-nova.onrender.com/api/data', {
      method: 'GET',
      headers: { 'X-API-KEY': key, 'Content-Type': 'application/json' },
    });
    result = await response.json();
  } catch (e) {
    return null;
  }

  if (!result) {
    return null;
  }

  if (!result.data) {
    return null;
  }

  return result;
}

export async function onDeleteData({ id, key }) {
  let result;
  try {
    const response = await fetch('https://api-nova.onrender.com/api/data/delete', {
      method: 'DELETE',
      headers: { 'X-API-KEY': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    result = await response.json();
  } catch (e) {
    return null;
  }

  if (!result) {
    return null;
  }

  if (result.error) {
    return null;
  }

  return result;
}

export const NOVA_ENERGY_DOMAIN = 'novaenergy.ai';

export async function onUploadData({ file, domain, key, setModal }) {
  let signedResult;
  const name = file.name;
  const type = file.type;
  const size = file.size;

  if (size > MAX_SIZE_BYTES) {
    setModal({ name: 'ERROR', message: 'File size exceeds 15mb limit' });
    return;
  }

  try {
    const signedResponse = await fetch(`https://api-nova.onrender.com/api/data/generate-presigned-url`, {
      method: 'POST',
      headers: {
        'X-API-KEY': key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, domain: domain, file: name, size }),
    });
    signedResult = await signedResponse.json();
  } catch (e) {
    return null;
  }

  if (!signedResult) {
    setModal({ name: 'ERROR', message: 'Failed to upload.' });
    return null;
  }

  if (signedResult.error) {
    setModal({ name: 'ERROR', message: signedResult.message });
    return null;
  }

  if (!signedResult.uploadURL) {
    setModal({ name: 'ERROR', message: 'Failed to upload your data.' });
    return null;
  }

  try {
    fetch(signedResult.uploadURL, {
      method: 'PUT',
      body: file,
    });
  } catch (e) {
    return null;
  }

  return signedResult;
}
