import Image from 'next/image';

export const CloudinaryImage = ({ publicId, fill, sizes, ...props }) => {
  const loader = ({ width, quality }) => {
    const optimizedWidth = Math.min(width, 256);

    const url = `https://res.cloudinary.com/dk00tjgvi/image/upload/c_scale,w_${optimizedWidth},q_${
      quality || 75
    }/profiles/${publicId}`;

    return url;
  };

  return (
    <Image
      loader={loader}
      src={`/profiles/${publicId}`}
      fill={fill}
      sizes="(max-width: 768px) 32px, 64px"
      {...props}
    />
  );
};
