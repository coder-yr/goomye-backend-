import { Box, DropZone } from "@adminjs/design-system";
import axios from "axios";
// import { serverUrlApi, serverUrlImage } from "../constants";
const UploadMultipleImage = (props) => {
  const fileUpload = async (files) => {
    if (files.length > 0) {
      var images = [];
      for (var f1 in files) {
        var file = files[f1];
        const url = `https://backend.goomye.com/api/upload/image`;
        const formData = new FormData();
        formData.append("file", file);
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        axios
          .post(url, formData, config)
          .then((response) => {
            if (response.status === 200) {
              images.push(
                `https://backend.goomye.com/images/${response.data["filename"]}`
              );
            }
          })
          .catch((error) => {});
      }
      props.record.params["images"] = images;
    }
  };
  return (
    <Box>
      <DropZone
        multiple
        onChange={fileUpload}
        validate={{
          maxSize: 5024000,
          mimeTypes: ["image/png", "image/jpg", "image/jpeg", "video/mp4"],
        }}
      ></DropZone>
    </Box>
  );
};

export default UploadMultipleImage;
