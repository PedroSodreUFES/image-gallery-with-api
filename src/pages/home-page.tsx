import Container from "../components/container";
import AlbumsFilter from "../contexts/albums/components/albums-filter";
import useAlbums from "../contexts/albums/hooks/useAlbums";
import { PhotosList } from "../contexts/photos/components/photos-list";
import usePhotos from "../contexts/photos/hooks/usePhotos";

export default function HomePage() {
    const { albums, isLoadingAlbums} = useAlbums()
    const { isLoadingPhotos, photos} = usePhotos()

    return (
        <Container>
            <AlbumsFilter 
              albums={albums} 
              loading={isLoadingAlbums} 
              className="mb-8"
            />
            <PhotosList 
              photos={photos}
              loading={isLoadingPhotos}
            />
        </Container>
    )
}