import axios from "axios";

const uploadMedia = (
  formData: FormData,
  reefId: string,
  token?: string | null
) =>
  axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_BASE_URL}reefs/${reefId}/surveys/upload`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response;
  });

export default { uploadMedia };
