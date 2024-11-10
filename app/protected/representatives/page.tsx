// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Wards from "../../../components/Calgary_Wards.png";
// type Marker = {
//   x: number;
//   y: number;
//   label: string;
// };

// type ImageData = {
//   src: string;
//   alt: string;
//   markers: Marker[];
// };

// const images: ImageData[] = [
//   {
//     src: Wards.src,
//     alt: "Wards",
//     markers: [
//       { x: 20, y: 20, label: "Calgary north" },
//       { x: 80, y: 60, label: "Sount" },
//     ],
//   },
//   {
//     src: Wards.src,
//     alt: "Wards 2",
//     markers: [
//       { x: 50, y: 30, label: "Helolo" },
//       { x: 70, y: 70, label: "Hellos" },
//       { x: 30, y: 80, label: "Hello" },
//     ],
//   },
// ];

// const representatives = () => {
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [clickedMarker, setClickedMarker] = useState<string | null>(null);

//   const handleImageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedImageIndex(parseInt(event.target.value));
//   };

//   const handleMarkerClick = (label: string) => {
//     setClickedMarker(label);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <div className="mb-4">
//         <select
//           value={selectedImageIndex}
//           onChange={handleImageChange}
//           className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
//         >
//           {images.map((image, index) => (
//             <option key={index} value={index}>
//               {image.alt}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="relative inline-block">
//         <Image
//           src={images[selectedImageIndex].src}
//           alt={images[selectedImageIndex].alt}
//           width={600}
//           height={400}
//           className="max-w-full h-auto"
//         />
//         {images[selectedImageIndex].markers.map((marker, index) => (
//           <button
//             key={index}
//             className="absolute w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
//             style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
//             onClick={() => handleMarkerClick(marker.label)}
//           >
//             {index + 1}
//           </button>
//         ))}
//       </div>
//       {clickedMarker && (
//         <div className="mt-4 p-2 bg-gray-100 rounded text-black">
//           {clickedMarker}
//         </div>
//       )}
//     </div>
//   );
// };

// export default representatives;

import React from "react";
import Map from "@/components/Map";

const Representatives: React.FC = () => {
  return (
    <div className="min-w-full">
      <Map />
    </div>
  );
};

export default Representatives;