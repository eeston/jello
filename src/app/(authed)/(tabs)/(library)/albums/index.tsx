import { useFetchAlbums } from "@src/api/useFetchAlbums";
import { AlbumColumnList } from "@src/components/AlbumColumnList";
import { LoadingOverlay } from "@src/components/LoadingOverlay";
import { useAuth } from "@src/store/AuthContext";
import { useSearchAlbumsStore } from "@src/store/useSearchStore";

export default function AlbumsList() {
  const { api } = useAuth();
  const albums = useFetchAlbums(api);
  const { query } = useSearchAlbumsStore();

  const filteredAlbums = albums?.data?.Items?.filter((item) => {
    if (!query) return true;

    const searchLower = query.toLowerCase();
    return (
      item.Name?.toLowerCase().includes(searchLower) ||
      item.AlbumArtist?.toLowerCase().includes(searchLower)
    );
  });

  if (albums.isPending) {
    return <LoadingOverlay />;
  }

  return <AlbumColumnList albums={filteredAlbums} />;
}
