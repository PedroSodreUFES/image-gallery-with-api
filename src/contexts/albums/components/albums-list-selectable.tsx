import { useTransition } from "react"
import Divider from "../../../components/divider"
import InputCheckBox from "../../../components/input-checkbox"
import Skeleton from "../../../components/skeleton"
import Text from "../../../components/text"
import type { Photo } from "../../photos/models/photo"
import usePhotoAlbums from "../hooks/usePhotoAlbums"
import type { Album } from "../models/album"

interface AlbumsListSelectableProps {
    loading?: boolean
    albums: Album[]
    photo: Photo
}

export default function AlbumsListSelectable({
    albums,
    photo,
    loading,
}: AlbumsListSelectableProps) {
    const { managePhotoOnAlbum } = usePhotoAlbums()
    const [isManagingPhoto, setIsManagingPhoto] = useTransition()

    function isChecked(albumId: string) {
        return photo?.albums?.some(album => album.id === albumId)
    }

    function handlePhotoOnAlbum(albumId: string) {
        let albumIds: string[] = []

        if (isChecked(albumId)) {
            albumIds = photo.albums
                .filter(album => album.id !== albumId)
                .map(album => album.id)
        } else {
            albumIds = [...photo.albums.map(album => album.id), albumId]
        }

        setIsManagingPhoto(async () => {
            await managePhotoOnAlbum(photo.id, albumIds)
        })
    }

    return (
        <ul className="flex flex-col gap-4">
            {
                !loading && photo && albums?.length > 0 &&
                albums.map((album, index) => (
                    <li key={album.id}>
                        <div className="flex items-center justify-between gap-1">
                            <Text variant="paragraph-large" className="truncate">{album.title}</Text>
                            <InputCheckBox
                                defaultChecked={isChecked(album.id)}
                                onChange={() => handlePhotoOnAlbum(album.id)}
                                disabled={isManagingPhoto}
                            />
                        </div>
                        {index !== albums.length - 1 && <Divider className="mt-4" />}
                    </li>
                ))
            }
            {
                loading && Array.from({ length: 5 }).map((_, index) => (
                    <li key={`albums-list-${index}`}>
                        <Skeleton className="h-10" />
                    </li>
                ))
            }

        </ul>
    )
}