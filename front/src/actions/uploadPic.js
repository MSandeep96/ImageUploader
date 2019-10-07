import axios from "axios";

export default (imgData, imgDims) => {
  const formData = new FormData();
  formData.append('image', imgData);
  formData.append('dims', JSON.stringify(imgDims));
  return axios.post("https://localhost:3004/imageData", formData)
    .catch((error) => {
      throw error;
    })
    .then((response) => {
      if (response.status === 200)
        return response.data.links;
    });
}