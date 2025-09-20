// import React, { useState } from "react";
// import axios from "axios";
// const UploadAndDisplayImage = (props) => {
//   const [selectedImage, setSelectedImage] = useState(null);

//   const fileUpload = async (file) => {
//     const url = `https://backend.goomye.com/api/upload/image`;
//     const formData = new FormData();
//     formData.append("file", file);
//     const config = {
//       headers: {
//         "content-type": "multipart/form-data",
//       },
//     };
//     axios
//       .post(url, formData, config)
//       .then((response) => {
//         if (response.status === 200) {
//           console.log(response.data["filename"]);
//           props.record.params[
//             "image"
//           ] = `https://backend.goomye.com/images/${response.data["filename"]}`;
//         }
//       })
//       .catch((error) => {});
//   };
//   return (
//     <div>
//       <h1>Upload Image</h1>
//       {selectedImage && (
//         <div>
//           <img
//             alt="not found"
//             width={"250px"}
//             src={URL.createObjectURL(selectedImage)}
//           />
//           <br />
//           <button onClick={() => setSelectedImage(null)}>Remove</button>
//         </div>
//       )}
//       <br />

//       <br />
//       <input
//         type="file"
//         name="myImage"
//         onChange={(event) => {
//           setSelectedImage(event.target.files[0]);
//           fileUpload(event.target.files[0]);
//         }}
//       />
//     </div>
//   );
// };

// export default UploadAndDisplayImage;

import { Box, DropZone } from "@adminjs/design-system";
import axios from "axios";
// import { serverUrlApi, serverUrlImage } from "../constants";
const UploadSingleImage = (props) => {
  const fileUpload = async (file) => {
    if (file.length === 1) {
      const url = `https://backend.goomye.com/api/upload/image`;
      const formData = new FormData();
      formData.append("file", file[0]);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(url, formData, config)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data["filename"]);
            props.record.params[
              "image"
            ] = `https://backend.goomye.com/images/${response.data["filename"]}`;
          }
        })
        .catch((error) => {});
    }
  };
  return (
    <Box>
      <DropZone
        onChange={fileUpload}
        validate={{
          maxSize: 5024000,
          mimeTypes: ["image/png", "image/jpg", "image/jpeg"],
        }}
      ></DropZone>
    </Box>
  );
};

export default UploadSingleImage;
