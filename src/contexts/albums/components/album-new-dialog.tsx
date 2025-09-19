import { useEffect, useState, useTransition, type ReactNode } from "react"
import { Dialog, DialogBody, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../../../components/dialog"
import Button from "../../../components/button"
import InputText from "../../../components/input-text"
import Text from "../../../components/text"
import SelectCheckboxIllustration from "../../../assets/images/select-checkbox.svg?react"
import Skeleton from "../../../components/skeleton"
import PhotoImageSelectable from "../../photos/components/photo-image-selectable"
import usePhotos from "../../photos/hooks/usePhotos"
import { albumNewFormSchema, type AlbumNewFormSchema } from "../schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import useAlbum from "../hooks/useAlbum"

interface AlbumNewDialogProps {
    trigger: ReactNode
}

export default function AlbumNewDialog({ trigger }: AlbumNewDialogProps) {
    const [modalOpen, setModalOpen] = useState(false)

    const form = useForm<AlbumNewFormSchema>({
        resolver: zodResolver(albumNewFormSchema)
    })

    const { isLoadingPhotos, photos } = usePhotos()
    const { createAlbum } = useAlbum()
    const [isCreatingAlbum, setIsCreatingAlbum] = useTransition()

    useEffect(() => {
        if (!modalOpen) {
            form.reset()
        }
    }, [modalOpen, form])

    function handleTogglePhoto(selected: boolean, photoId: string) {
        const photosIds = form.getValues("photosIds") || []
        let newValue: string[] = []

        if (selected) {
            newValue = [...photosIds, photoId]
        } else {
            newValue = photosIds.filter(id => id !== photoId)
        }

        form.setValue("photosIds", newValue)
    }

    function handleSubmit(payload: AlbumNewFormSchema) {
        setIsCreatingAlbum(async () => {
            await createAlbum(payload)
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

                    <DialogHeader>Criar álbum</DialogHeader>

                    <DialogBody className="flex flex-col gap-5">
                        <InputText
                            placeholder="Adicione um título"
                            error={form.formState.errors.title?.message}
                            {...form.register("title")}
                        />

                        <div className="space-y-3">
                            <Text as="div" variant="label-small" className="mb-3" >Fotos cadastradas</Text>
                            {
                                isLoadingPhotos && (
                                    <div className="flex flex-wrap gap-2">
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <Skeleton
                                                key={`photo-loading-${index}`} className="w-20 h-20 rounded"
                                            />
                                        ))}
                                    </div>
                                )
                            }

                            {
                                !isLoadingPhotos && photos.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {photos.map(photo =>
                                            <PhotoImageSelectable
                                                key={photo.id}
                                                title={photo.title}
                                                src={`${import.meta.env.VITE_IMAGES_URL}/${photo.imageId}`}
                                                imageClassName="h-20 w-20"
                                                onSelectImage={(selected) => handleTogglePhoto(selected, photo.id)}
                                            />
                                        )}
                                    </div>
                                )
                            }

                            {
                                !isLoadingPhotos && photos.length === 0 && (
                                    <div className="w-full flex flex-col justify-center items-center gap-3">
                                        <SelectCheckboxIllustration />
                                        <Text variant="paragraph-medium" className="text-center">
                                            Nenhuma foto disponível para seleção
                                        </Text>
                                    </div>
                                )
                            }
                        </div>
                    </DialogBody>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary" disabled={isCreatingAlbum}>
                                Cancelar
                            </Button>
                        </DialogClose>

                        <Button type="submit" disabled={isCreatingAlbum} handling={isCreatingAlbum}>
                            {isCreatingAlbum ? "Criando..." : "Criar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}