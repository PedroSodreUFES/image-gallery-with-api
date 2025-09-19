import { useEffect, useState, useTransition, type ReactNode } from "react";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../../../components/dialog";
import Button from "../../../components/button";
import InputText from "../../../components/input-text";
import Alert from "../../../components/alert";
import InputSingleFile from "../../../components/input-single-file";
import ImagePreview from "../../../components/image-preview";
import Text from "../../../components/text";
import Skeleton from "../../../components/skeleton";
import { useForm } from "react-hook-form";
import useAlbums from "../../albums/hooks/useAlbums";
import { photoNewFormSchema, type PhotoNewFormSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod"
import usePhoto from "../hooks/usePhoto";

interface PhotoNewDialogProps {
    trigger: ReactNode
}

export default function PhotoNewDialog({ trigger }: PhotoNewDialogProps) {
    const [modalOpen, setModalOpen] = useState(false)
    const { albums, isLoadingAlbums } = useAlbums()
    const [isCreatingPhoto, setIsCreatingPhoto] = useTransition()
    const { createPhoto } = usePhoto()

    const form = useForm<PhotoNewFormSchema>({
        resolver: zodResolver(photoNewFormSchema)
    })

    const file = form.watch("file")
    const fileSource = file?.[0] ? URL.createObjectURL(file[0]) : undefined

    const albumsIds = form.watch("albumsIds")

    useEffect(() => {
        if (!modalOpen) {
            form.reset()
        }
    }, [modalOpen, form])

    function handleToggleAlbum(albumId: string) {
        const albumsIds = form.getValues("albumsIds") || []
        const albumsSet = new Set(albumsIds)

        if (albumsSet.has(albumId)) {
            albumsSet.delete(albumId)
        } else {
            albumsSet.add(albumId)
        }

        form.setValue("albumsIds", Array.from(albumsSet))
    }

    function handleSubmit(payload: PhotoNewFormSchema) {
        setIsCreatingPhoto(async () => {
            await createPhoto(payload)
            setModalOpen(false)
        })
    }

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={form.handleSubmit(handleSubmit)}>

                    <DialogHeader>Adicionar foto</DialogHeader>

                    <DialogBody className="flex flex-col gap-5">
                        <InputText
                            placeholder="Adicione um título"
                            maxLength={255}
                            error={form.formState.errors.title?.message}
                            {...form.register("title")}
                        />

                        <Alert>
                            Tamanho máximo: 50MB
                            <br />
                            Você pode selecionar o arquivo em PNG, JPG ou JPEG
                        </Alert>

                        <InputSingleFile
                            form={form}
                            allowedExtensions={['png', 'jpg', 'jpeg']}
                            maxFileSizeInMB={50}
                            replaceBy={<ImagePreview src={fileSource} className="w-full h-56" />}
                            error={form.formState.errors.file?.message}
                            {...form.register("file")}
                        />

                        <div className="space-y-3">
                            <Text variant="label-small">Selecionar álbuns</Text>
                            <div className="flex flex-wrap gap-3 mt-3">
                                {!isLoadingAlbums ? (
                                    albums.map(album =>
                                        <Button
                                            key={album.id}
                                            variant={albumsIds?.includes(album.id) ? "primary" : "ghost"}
                                            size="sm"
                                            className="truncate"
                                            onClick={() => handleToggleAlbum(album.id)}
                                        >
                                            {album.title}
                                        </Button>
                                    )
                                ) : (
                                    Array.from({ length: 5 }).map((_, index) =>
                                        <Skeleton key={`album-loading-${index}`} className="w-20 h-7" />
                                    )
                                )}
                            </div>
                        </div>
                    </DialogBody>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary" disabled={isCreatingPhoto}>
                                Cancelar
                            </Button>
                        </DialogClose>

                        <Button type="submit" handling={isCreatingPhoto} disabled={isCreatingPhoto}>
                            {isCreatingPhoto ? "Adicionando..." : "Adicionar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}