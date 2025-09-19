import InputText from "./input-text";
import SearchIcon from "../assets/icons/search.svg?react"
import { useCallback, useState, type ChangeEvent } from "react";
import { debounce } from "../helpers/utils";
import usePhotos from "../contexts/photos/hooks/usePhotos";

export default function PhotoSearch() {
    const [inputValue, setInputValue] = useState("")
    const { filters } = usePhotos()

    const debouncedSetValue = useCallback(
        debounce((value: string) => {
            filters.setQ(value)
        }, 300), [filters.setQ])

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value

        setInputValue(value)
        debouncedSetValue(value)
    }

    return (
        <InputText
            icon={SearchIcon}
            placeholder="Buscar fotos"
            className="flex-1"
            value={inputValue}
            onChange={handleInputChange}
        />
    )
}