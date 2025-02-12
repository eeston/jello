import { fmtIsoYear } from "@src/util/date";

export const formatAlbumSubtext = ({
  albumDate,
  albumName,
  withAlbumName,
  withAlbumYear,
}: {
  albumDate: string;
  albumName: string;
  withAlbumName?: boolean;
  withAlbumYear?: boolean;
}) => {
  if (!withAlbumName) return "";
  if (!albumName) return "";
  if (withAlbumYear && albumDate) {
    return `${albumName} • ${fmtIsoYear(albumDate)}`;
  }
  return albumName;
};
