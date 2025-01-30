import Image from "next/image"
import { Input } from "../ui/input"
import { Label } from "../ui/label"


const ImageSelector = ({images, defaultChecked, inputName} : {images: string[], defaultChecked: string, inputName:string}) => {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 w-full">
            {images.map((img, index) => (
            <div key={index} className="flex items-center space-x-1">
            <Input type="radio" id={`${inputName}_${index}`} name={inputName} value={img} defaultChecked={img === defaultChecked} className="hidden peer" />
            <Label htmlFor={`${inputName}_${index}`} className="cursor-pointer peer-checked:ring-2 peer-checked:ring-blue-500">
            <Image src={img} alt={inputName} width={240} height={240} className="rounded-lg shadow-md hover:opacity-75 transition-opacity duration-300" />
            </Label>
            </div>
            ))}
        </div>
    )
}

export default ImageSelector