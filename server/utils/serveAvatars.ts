import path from "path";
import { access } from 'fs/promises';
import fs from "fs";
import { ServerResponse } from "http";

export const serveAvatar = async ({ 
  routePath,
  res,
}: {
  routePath: string;
  res: ServerResponse;
}) => {
  const uploadsFolder = path.join(process.cwd(), "uploads");
      
  // Always append .webp since that's the stored format
  const fileId = path.basename(routePath, path.extname(routePath)); // remove any extension if present
  const fileName = `${fileId}.webp`;
  const filePath = path.join(uploadsFolder, fileName);

  if (!fileId) return;

  try {
    await access(filePath)

    res.writeHead(200, {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=86400",
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } catch (err) {
    console.log('File not found:', err, 'red');
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("File not found");
  };

  return;
}