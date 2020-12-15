import { BASE_HOST } from './../apollo';

export const fileUploader = async (file: File): Promise<string> => {
  if (file === undefined) {
    return '';
  }
  try {
    const formBody = new FormData();
    formBody.append('file', file);
    const { url } = await (
      await fetch(`${BASE_HOST}/uploads`, {
        method: 'POST',
        body: formBody
      })
    ).json();
    return url;
  } catch {
    return '';
  }
}